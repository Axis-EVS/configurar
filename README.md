# Admin CMS – Painel de Controle (Site 1)

Painel administrativo para gerenciamento de conteúdo do site vitrine **AXIS EVS**.

## Funcionalidades

- **Login seguro** com autenticação via Supabase Auth
- **Gestão de Cardápio**: criar, editar, excluir itens com imagem, preço, categoria e status
- **Gestão de Programas**: gerenciar programas de acompanhamento com benefícios e descrições
- **Interface responsiva** para uso em desktop e celular

## Stack

| Tecnologia | Uso |
|---|---|
| HTML + Tailwind CSS (CDN) | Interface visual |
| JavaScript (ES Modules) | Lógica do frontend |
| Vite | Bundler / build tool |
| Supabase | Backend: banco de dados + autenticação |

## Hospedagem

Este repositório contém o **build estático de produção** gerado pelo Vite.  
O arquivo de entrada é `index.html` na raiz.

### Como publicar no GitHub Pages

1. Faça o upload/push dos arquivos desta pasta para um repositório GitHub
2. Vá em **Settings → Pages**
3. Em *Source*, selecione **Deploy from a branch** → branch `main` → pasta `/ (root)`
4. Clique em **Save** — seu site estará disponível em `https://<seu-usuario>.github.io/<nome-do-repositorio>/`

## Backend (Supabase)

As credenciais do Supabase estão **embutidas no bundle JS** durante o build (chave pública `anon`).  
Isso é seguro pois:
- A chave `anon` é pública por design no Supabase
- O controle de acesso real é feito via **Row Level Security (RLS)** no banco de dados
- Dados sensíveis exigem autenticação prévia (login no painel)

> ⚠️ Nunca exponha sua **Service Role Key** no frontend.
