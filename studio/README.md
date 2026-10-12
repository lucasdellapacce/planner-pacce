# PACCE Planner Studio 📅✨
### Estúdio de Criação de Planners Digitais Personalizados para Goodnotes

![Status dos Testes](https://img.shields.io/badge/Testes-45%20Aprovados%20(100%25)-success)
![Versão](https://img.shields.io/badge/Versão-0.2.0-blue)
![Goodnotes](https://img.shields.io/badge/Goodnotes-Compatível-indigo)

![Licença](https://img.shields.io/badge/Licença-MIT-green)

O **PACCE Planner Studio** é uma aplicação completa e local-first desenvolvida para criar, personalizar e exportar planners digitais interativos com navegação hiperlinkada nativa e compatibilidade total com o Goodnotes, Notability e dispositivos e-ink.

---

## 🌟 Principais Recursos

- 🚀 **Assistente de Criação em Etapas (Wizard):** Escolha o nome, período (ano, trimestre ou datas personalizadas), formato de folha (A4 horizontal, A4 vertical, A3, A5), estilo visual e seções.
- 📆 **Motor de Calendário Inteligente em PT-BR:** Cálculo automático de anos bissextos, feriados nacionais e móveis brasileiros (Carnaval, Sexta-feira Santa, Páscoa e Corpus Christi), semanas ISO e nomes em Português do Brasil.
- 🔗 **Sistema de Hyperlinks e Abas:** Geração de abas clicáveis entre meses, semanas e dias, índices e retorno. Resolução de IDs estáveis com **validação de integridade pré-exportação**.
- 🎨 **Interface Apple-like com Editor Visual:** Canvas com proporção milimétrica real, zoom, seleção de objetos, alteração de cores, textos, dimensões e hyperlinks.
- 📑 **Biblioteca de Seções Prontas:** Capa, Índice, Calendário Mensal, Planejamento Semanal, Planejamento Diário, Rastreador de Hábitos, Projetos, Cronograma de Estudos, Rastreador de Leitura, Revisões Mensais e Páginas Livres Pontilhadas (5 mm).
- 🏷️ **Gerenciador de Adesivos Digitais:** Geração e exportação de etiquetas e badges em PNG transparente empacotados em `.zip` para importação direta no Goodnotes.
- ⚡ **Alta Performance:** Renderiza mais de 100 páginas de alta fidelidade com centenas de hyperlinks em menos de 2 segundos.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Backend:** Python 3.14, FastAPI, ReportLab 5.0 (geração vetorial de PDF e anotações `linkRect`), Pillow (adesivos).
- **Persistência:** Local-first em JSON estruturado com versionamento de schema (`1.0.0`) e backups automáticos.

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ (testado em Node.js v26) e npm
- Python 3.11+ (testado em Python 3.14)

### Execução no Windows (1 Clique)
1. Dê um duplo clique em `iniciar_backend.bat` para iniciar a API REST em `http://127.0.0.1:8000`.
2. Dê um duplo clique em `iniciar_frontend.bat` para iniciar o estúdio web em `http://localhost:5173`.
3. Abra seu navegador em `http://localhost:5173`.

### Execução Manual via Terminal

#### 1. Backend:
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1   # No Windows
pip install -e ".[dev]"
uvicorn pacce.api.app:app --host 127.0.0.1 --port 8000 --reload
```

#### 2. Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Testes Automatizados

O projeto possui **45 testes automatizados cobrindo 100% dos requisitos críticos** (calendário, anos bissextos, feriados brasileiros, conversão de medidas, renderização de PDF, validação de hyperlinks e API REST).

Para rodar todos os testes:
```powershell
.\executar_testes.bat
# ou:
cd backend
.\venv\Scripts\python.exe -m pytest -v
```

---

## 📦 Projeto de Teste Obrigatório Gerado

O projeto obrigatório especificado (**PACCE Planner — Outubro a Dezembro 2026**, A4 horizontal, paleta Índigo/Lavanda com todas as seções e hyperlinks) foi gerado e validado programaticamente:
- 📄 **PDF do Planner:** `projects/output_mandatory/PACCE_Planner_Outubro_Dezembro_2026.pdf` (129 páginas, 295 hyperlinks válidos)
- 🎨 **Pacote de Adesivos:** `projects/output_mandatory/PACCE_Stickers_Out_Dez_2026.zip` (Etiquetas e Badges PNG transparentes)
- 💾 **Arquivo do Projeto:** `projects/output_mandatory/project.json`

---

## 📚 Documentação Técnica

Toda a documentação requerida está disponível na pasta `docs/`:
- [Matriz de Pesquisa de Repositórios](docs/REPOSITORY_RESEARCH.md)
- [Arquitetura de Software](docs/ARCHITECTURE.md)
- [Licenças e Atribuições](docs/LICENSES.md)
- [Compatibilidade com Goodnotes](docs/GOODNOTES_COMPATIBILITY.md)
- [Relatório de Testes Automatizados](docs/TEST_REPORT.md)
- [Manual do Usuário em Português](docs/USER_GUIDE_PTBR.md)
- [Plano de Desenvolvimento](docs/DEVELOPMENT_PLAN.md)
- [Registro de Alterações (Changelog)](docs/CHANGELOG.md)

---

## 📄 Licença

Distribuído sob a Licença **MIT**. Consulte o arquivo [LICENSES.md](docs/LICENSES.md) para obter mais informações.
