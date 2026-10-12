let runtime;
async function init() {
  const {loadPyodide} = await import('/python-runtime/pyodide.mjs');
  const py = await loadPyodide({indexURL: new URL('/python-runtime/',self.location.href).href, packageBaseUrl: new URL('/python-runtime/',self.location.href).href});
  const response=await fetch('/python-sources.json');
  if(!response.ok) throw new Error('Não foi possível carregar o motor de planners.');
  const sources=await response.json();
  for(const [name,source] of Object.entries(sources)) {
    py.FS.mkdirTree('/home/pyodide/'+name.slice(0,name.lastIndexOf('/')));
    py.FS.writeFile('/home/pyodide/'+name,source);
  }
  py.runPython('import sys; sys.path.insert(0,"/home/pyodide"); import json; from pacce_browser import dispatch');
  return py;
}
let exportReady;
async function exportPackages(py) {
  if(!exportReady) exportReady=(async()=>{
    await py.loadPackage(['pillow','charset-normalizer']);
    const res=await fetch('/python-wheels/reportlab-4.4.10-py3-none-any.whl');
    if(!res.ok) throw new Error('Falha ao carregar o exportador PDF.');
    py.unpackArchive(await res.arrayBuffer(),'zip',{extractDir:'/home/pyodide'});
  })().catch(e=>{exportReady=undefined;throw e;});
  return exportReady;
}
let queue=Promise.resolve();
self.onmessage=({data})=>{
  queue=queue.then(async()=>{
    try {
      if(!runtime) runtime=init().catch(e=>{runtime=undefined;throw e;});
      const py=await runtime;
      if(data.action==='pdf'||data.action==='stickers') await exportPackages(py);
      py.globals.set('request_action',data.action);
      py.globals.set('request_payload',JSON.stringify(data.payload));
      const result=py.runPython('dispatch(request_action,json.loads(request_payload))');
      if(data.action==='pdf'||data.action==='stickers') {
        const bytes=py.FS.readFile(result);
        py.FS.unlink(result);
        self.postMessage({id:data.id,bytes},[bytes.buffer]);
      } else self.postMessage({id:data.id,result:JSON.parse(result)});
    } catch(error) { self.postMessage({id:data.id,error:String(error.message||error)}); }
  });
};
