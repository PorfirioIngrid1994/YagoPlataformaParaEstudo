# 靈 Arquivos do Mundo Espiritual // Divisão de Investigação

Landing page temática fictícia inspirada na atmosfera de animes japoneses dos anos 90 (*Yu Yu Hakusho*, fitas VHS, estética de mangá e terminais retrô), desenvolvida como projeto de demonstração e homologação para testes do **Google Analytics 4 (GA4)**.

O site foi construído em arquitetura estática leve e de alta performance, sem dependências de frameworks pesados, pronto para deploy na **Vercel**.

---

## 📁 Estrutura de Arquivos

```text
├── index.html       # Estrutura semântica HTML5, arte SVG original e tags meta
├── style.css        # Identidade visual 90s, responsividade, scanlines e animações
├── script.js        # Lógica de interações, validação segura e rastreador GA4
├── vercel.json      # Configurações de cabeçalhos e URLs limpas para a Vercel
└── README.md        # Guia completo de execução, GA4 e publicação
```

---

## ⚡ 1. Como Executar o Site Localmente

Como o projeto é 100% estático (HTML, CSS e JS puros), você pode executá-lo de qualquer uma das seguintes formas:

### Opção A: Servidor Node.js rápido (Recomendado)
No terminal, dentro da pasta do projeto:
```bash
npx serve .
```
Ou usando `http-server`:
```bash
npx http-server -p 3000
```
Em seguida, abra o link exibido (geralmente `http://localhost:3000` ou `http://localhost:5000`) no seu navegador.

### Opção B: Python (Nativo em vários sistemas)
```bash
# Python 3
python -m http.server 8000
```
Acesse `http://localhost:8000`.

### Opção C: Extensão "Live Server" do VS Code
Clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.

---

## 🎯 2. Onde Inserir o ID do Google Analytics 4 (GA4)

Abra o arquivo [`script.js`](file:///c:/Users/Ingrid/OneDrive/Área de Trabalho/YagoMarketing/script.js) e localize logo no topo (linha 16):

```javascript
/* ============================================================================
   CONFIGURAÇÃO DO GOOGLE ANALYTICS 4
   Insira o seu ID de Medição (Measurement ID) no formato 'G-XXXXXXXXXX' abaixo.
   ============================================================================ */
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
```

Basta substituir `'G-XXXXXXXXXX'` pelo seu Measurement ID real, por exemplo:
```javascript
const GA_MEASUREMENT_ID = 'G-ABC123DEF4';
```

> **Comportamento Seguro Sem ID:**  
> Se o ID for mantido como `'G-XXXXXXXXXX'` ou deixado em branco, o site funcionará perfeitamente em modo de **simulação local**. Nenhum erro será exibido no console do navegador e todos os eventos continuarão sendo simulados e listados no **Monitor HUD em Tempo Real** fixado no canto inferior direito da tela.

---

## 📊 3. Eventos Mapeados no GA4

Todos os eventos solicitados foram implementados seguindo a nomenclatura oficial do GA4:

| Evento | Gatilho de Disparo | Parâmetros Enviados | Proteção de Dados (LGPD) |
|---|---|---|---|
| `page_view` | No carregamento inicial da página (sem duplicar o evento automático) | `page_title`, `page_location`, `page_path` | Nenhum dado de usuário |
| `scroll_50` | Quando o usuário rola até 50% da altura da página (1 única vez por sessão) | `percent_scrolled: 50`, `page_title` | Nenhum dado de usuário |
| `form_start` | Na primeira interação (foco ou digitação) com o campo de e-mail | `form_id`, `form_name` | Nenhum dado de usuário |
| `form_submit` | Após a validação correta do e-mail e conclusão do envio simulado | `form_id`, `form_name`, `simulated_status: 'success'` | **E-mail NUNCA é transmitido** |
| `cta_click` | Ao clicar no botão principal `QUERO INVESTIGAR` do Hero | `cta_name`, `cta_location`, `target_destination` | Nenhum dado de usuário |
| `easter_egg_click` | Ao acionar o detector de energia espiritual | `energy_level`, `energy_title`, `feature_name` | Nenhum dado de usuário |

---

## 🔍 4. Como Conferir os Eventos no Google Analytics

### A. Monitor HUD em Tempo Real (Direto no Site)
No canto inferior direito da página, há um componente flutuante chamado **"MONITOR GA4"**. Ele lista todos os eventos acionados com timestamp e payload detalhado, permitindo validar o disparo imediato de cada ação enquanto você navega.

### B. Console de Desenvolvedor (F12)
Abra o DevTools no navegador (`F12` ou `Ctrl + Shift + I`) e visualize os logs com destaque colorido estilizado `[GA4 EVENT]`.

### C. GA4 DebugView (Recomendado para Testes sem Poluir Produção)
O script já inclui o parâmetro `debug_mode: true` na configuração do `gtag`. Para visualizar os disparos no painel do Google Analytics:
1. Instale a extensão oficial do Chrome [Google Analytics Debugger](https://chromewebstore.google.com/detail/google-analytics-debugger/jnkmfdileelkgflhpibflklddhnmhoap) ou use o Google Tag Assistant.
2. No painel do Google Analytics 4, vá em **Administrador (Admin)** no menu lateral esquerdo.
3. Na coluna de propriedades, desça até **Exibição de depuração (DebugView)**.
4. Conforme você interage com o site (rola a página, clica no botão, preenche o e-mail ou ativa o scanner), os eventos aparecerão em tempo real no feed vertical do DebugView.

### D. Relatórios em Tempo Real (Real-time Report)
No painel do GA4, vá em **Relatórios > Tempo Real**. Na seção **"Contagem de eventos por nome de evento"**, você verá os eventos `page_view`, `scroll_50`, `cta_click`, `form_start`, `form_submit` e `easter_egg_click`.

---

## 🏆 5. Como Configurar `form_submit` como Evento Principal (Conversão)

Para marcar o envio do formulário de recrutamento como uma conversão chave:

1. Acesse o painel do **Google Analytics 4**.
2. Clique no ícone de engrenagem **Administrador** no canto inferior esquerdo.
3. Em *Exibição de dados*, selecione **Eventos principais** (ou **Conversões** nas versões anteriores).
4. Clique no botão azul **Novo evento principal**.
5. No campo *Nome do evento*, digite exatamente:  
   `form_submit`
6. Clique em **Salvar**.
7. A partir deste momento, cada envio simulado validado será contabilizado como uma conversão de sucesso nos seus relatórios de aquisição e tráfego.

---

## 🛡️ 6. Privacidade e LGPD para o Público Brasileiro

- **Sem Coleta de PII (Personally Identifiable Information):** O e-mail informado no formulário de recrutamento é estritamente validado em memória pelo navegador do visitante e **nunca** é enviado nos parâmetros do GA4 nem a qualquer serviço externo.
- **Armazenamento Zero:** Nenhum e-mail ou dado pessoal é salvo em banco de dados, `localStorage`, `sessionStorage` ou cookies próprios do domínio.
- **Cookies do GA4 e Consent Mode:** O Google Analytics utiliza cookies próprios de medição (`_ga`, `_ga_*`). Para conformidade com a LGPD quando publicado com tráfego real no Brasil, o Google Consent Mode v2 pode ser ativado adicionando a chamada `gtag('consent', 'default', { analytics_storage: 'denied' })` antes da tag, caso utilize uma plataforma de gestão de consentimento (CMP) integrada. Como este é um ambiente de demonstração e teste controlado, o site opera sem retenção de dados sensíveis.

---

## 🚀 7. Como Publicar na Vercel

O projeto já está estruturado e configurado com [`vercel.json`](file:///c:/Users/Ingrid/OneDrive/Área de Trabalho/YagoMarketing/vercel.json).

### Método 1: Via Vercel CLI (Direto pelo Terminal)
1. Instale a CLI da Vercel (se ainda não tiver):
   ```bash
   npm i -g vercel
   ```
2. Na pasta do projeto, execute:
   ```bash
   vercel
   ```
3. Responda `Y` para configurar o projeto e selecione as opções padrão (diretório `./`).
4. Para enviar para produção:
   ```bash
   vercel --prod
   ```

### Método 2: Via GitHub / Interface da Vercel
1. Crie um repositório no seu GitHub (ex: `arquivos-mundo-espiritual`).
2. Faça commit e push dos arquivos:
   ```bash
   git init
   git add .
   git commit -m "feat: landing page arquivos do mundo espiritual com GA4"
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git branch -M main
   git push -u origin main
   ```
3. Acesse [vercel.com](https://vercel.com) e clique em **Add New > Project**.
4. Importe o repositório do GitHub.
5. A Vercel detectará automaticamente que se trata de um site estático e fará o deploy com URL pública em segundos.

---

## 🎨 Especificações de Design

- **Paleta de Cores:**
  - Azul-marinho profundo: `#0B1020`
  - Roxo espiritual: `#8057E8`
  - Verde de energia (Reiki): `#7CFF9B`
  - Vinho (Alerta/Poder): `#681C43`
  - Branco envelhecido: `#F0EBDD`
- **Acessibilidade:**
  - Suporte completo a navegação por teclado (`Tab`, `:focus-visible`).
  - Respeito à preferência de sistema `prefers-reduced-motion`.
  - Botão de alternância para ligar/desligar o efeito de linhas scanline CRT.
  - Alvos de toque adequados para dispositivos móveis (mínimo de 48px).
- **Tipografia:** Google Fonts (`Chakra Petch`, `Share Tech Mono` e `Plus Jakarta Sans`).
