/**
 * ============================================================================
 * ARQUIVOS DO MUNDO ESPIRITUAL - SCRIPT PRINCIPAL
 * Integrador de Eventos Google Analytics 4 (GA4) & Interações do Sistema
 * ============================================================================
 */

/* ============================================================================
   CONFIGURAÇÃO DO GOOGLE ANALYTICS 4
   Insira o seu ID de Medição (Measurement ID) no formato 'G-XXXXXXXXXX' abaixo.
   Se mantido como 'G-XXXXXXXXXX', o sistema funcionará normalmente em modo
   de simulação segura com monitor local e logs no console sem gerar erros.
   ============================================================================ */
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

/* ============================================================================
   CONFIGURAÇÃO DO CLOUD FIRESTORE (FIREBASE)
   Projeto criado e conectado: mundo-espiritual-1994
   ============================================================================ */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBkEcVnXkMl60IbfLVKAroviFG9rixD_Qk",
  authDomain: "mundo-espiritual-1994.firebaseapp.com",
  projectId: "mundo-espiritual-1994",
  storageBucket: "mundo-espiritual-1994.firebasestorage.app",
  messagingSenderId: "60008323124",
  appId: "1:60008323124:web:b4125a529d4e7b99489261"
};

let firestoreDb = null;
try {
  if (typeof firebase !== 'undefined' && firebase.initializeApp) {
    firebase.initializeApp(FIREBASE_CONFIG);
    firestoreDb = firebase.firestore();
    console.info(
      '%c[Cloud Firestore]%c Conectado ao projeto "mundo-espiritual-1994".',
      'background: #FFA000; color: #000; font-weight: bold; padding: 2px 6px;',
      'color: #7CFF9B;'
    );
  }
} catch (fbErr) {
  console.warn('[Cloud Firestore] Inicialização do Firebase:', fbErr);
}

/**
 * Estado Global e Flags de Controle de Eventos Únicos
 */
const AppState = {
  hasFiredPageview: false,
  hasFiredScroll50: false,
  hasFiredFormStart: false,
  isGa4Configured: false,
  eventsLog: []
};

/**
 * Níveis de Energia Espiritual para o Easter Egg
 */
const SPIRIT_LEVELS = [
  { level: 1, title: 'Nível 1', text: 'Humano comum. Por enquanto.', percent: 20 },
  { level: 2, title: 'Nível 2', text: 'Sensibilidade espiritual detectada.', percent: 40 },
  { level: 3, title: 'Nível 3', text: 'Potencial de detetive identificado.', percent: 65 },
  { level: 4, title: 'Nível 4', text: 'Não entre em torneios sem ler o regulamento.', percent: 85 },
  { level: 5, title: 'Nível 5', text: 'O Departamento gostaria de conversar com você.', percent: 100 }
];

/* ============================================================================
   1. INICIALIZAÇÃO SEGURA DO GA4 (gtag.js)
   ============================================================================ */
function initGoogleAnalytics() {
  const isPlaceholder = !GA_MEASUREMENT_ID || 
                        GA_MEASUREMENT_ID === 'G-XXXXXXXXXX' || 
                        !GA_MEASUREMENT_ID.startsWith('G-');

  // Atualiza o indicador do painel HUD
  const hudIdDisplay = document.getElementById('hud-ga-id');
  const hudDot = document.getElementById('hud-indicator-dot');

  if (isPlaceholder) {
    console.info(
      '%c[Mundo Espiritual // GA4]%c Modo de Emulação Ativo (ID: G-XXXXXXXXXX não configurado). ' +
      'Os eventos serão exibidos no Monitor HUD e console com zero erros.',
      'background: #8057E8; color: #fff; font-weight: bold; padding: 2px 6px;',
      'color: #7CFF9B;'
    );
    AppState.isGa4Configured = false;
    if (hudIdDisplay) hudIdDisplay.textContent = 'SIMULAÇÃO LOCAL (G-XXXXXXXXXX)';
    if (hudDot) hudDot.style.background = '#8057E8';

    // Cria fallback seguro para window.gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
  } else {
    // Configura gtag.js oficial do Google
    AppState.isGa4Configured = true;
    if (hudIdDisplay) hudIdDisplay.textContent = `CONECTADO (${GA_MEASUREMENT_ID})`;
    if (hudDot) hudDot.style.background = '#7CFF9B';

    // Cria dataLayer e função gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());

    // Importante: 'send_page_view: false' evita duplicar o evento automático do GA4,
    // pois disparamos explicitamente o evento 'page_view' solicitado no projeto.
    gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false,
      debug_mode: true // Habilita visualização no DebugView do GA4 durante testes
    });

    // Injeta a tag oficial do Google
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    document.head.appendChild(script);

    console.info(
      `%c[Mundo Espiritual // GA4]%c Google Analytics 4 conectado com sucesso via ${GA_MEASUREMENT_ID}.`,
      'background: #7CFF9B; color: #0B1020; font-weight: bold; padding: 2px 6px;',
      'color: #fff;'
    );
  }

  // Dispara o evento page_view solicitado
  triggerPageView();
}

/**
 * Função Central de Despacho de Eventos do GA4
 * Garante que NENHUM dado pessoal (PII) seja enviado.
 */
function trackEvent(eventName, eventParams = {}) {
  // Higienização de segurança: remove chaves com e-mail ou dados potencialmente sensíveis
  const sanitizedParams = { ...eventParams };
  delete sanitizedParams.email;
  delete sanitizedParams.user_email;
  delete sanitizedParams.name;
  delete sanitizedParams.telefone;

  // Envia para o gtag se disponível
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, sanitizedParams);
    }
  } catch (err) {
    console.warn('[GA4] Falha ao enviar evento:', err);
  }

  // Registra no log do console formatado estilo anime anos 90
  console.log(
    `%c[GA4 EVENT]%c ${eventName}`,
    'background: #0B1020; color: #7CFF9B; border: 1px solid #7CFF9B; font-weight: bold; padding: 2px 5px;',
    'color: #8057E8; font-weight: bold;',
    sanitizedParams
  );

  // Registra no Monitor HUD em tempo real
  logEventToHUD(eventName, sanitizedParams);
}

/**
 * Atualiza o painel HUD em tempo real
 */
function logEventToHUD(eventName, params) {
  const list = document.getElementById('hud-event-list');
  if (!list) return;

  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);

  const li = document.createElement('li');
  li.className = 'hud-event-item';

  const paramsPreview = Object.keys(params).length > 0 
    ? JSON.stringify(params) 
    : '(sem parâmetros)';

  li.innerHTML = `
    <div class="hud-event-row">
      <span class="hud-event-name">${escapeHTML(eventName)}</span>
      <span class="hud-event-time">${timeStr}</span>
    </div>
    <div class="hud-event-params" title="${escapeHTML(paramsPreview)}">${escapeHTML(paramsPreview)}</div>
  `;

  list.insertBefore(li, list.firstChild);

  // Limite visual de 20 eventos
  while (list.children.length > 20) {
    list.removeChild(list.lastChild);
  }
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ============================================================================
   2. IMPLEMENTAÇÃO DOS EVENTOS SOLICITADOS
   ============================================================================ */

/**
 * Evento: page_view
 * Disparado na visualização da página, sem duplicar com o envio automático.
 */
function triggerPageView() {
  if (AppState.hasFiredPageview) return;
  AppState.hasFiredPageview = true;

  trackEvent('page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname
  });
}

/**
 * Evento: scroll_50
 * Disparado quando o visitante atinge 50% da altura da página (uma única vez).
 */
function setupScrollDepthTracking() {
  let isTicking = false;

  function handleScroll() {
    if (AppState.hasFiredScroll50) return;

    if (!isTicking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const totalHeight = document.documentElement.scrollHeight;

        // Progresso do scroll: porcentagem da área visual atingida
        const scrollPercent = (scrollTop + windowHeight) / totalHeight;

        if (scrollPercent >= 0.5) {
          AppState.hasFiredScroll50 = true;
          trackEvent('scroll_50', {
            percent_scrolled: 50,
            page_title: document.title
          });
          window.removeEventListener('scroll', handleScroll);
        }
        isTicking = false;
      });
      isTicking = true;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Evento: cta_click
 * Disparado quando o visitante clica no botão principal "QUERO INVESTIGAR"
 */
function setupCtaTracking() {
  const ctaBtn = document.getElementById('cta-investigate');
  if (!ctaBtn) return;

  ctaBtn.addEventListener('click', (e) => {
    e.preventDefault();

    trackEvent('cta_click', {
      cta_name: 'QUERO INVESTIGAR',
      cta_location: 'hero_principal',
      target_destination: 'recrutamento'
    });

    // Rola suavemente até a seção de recrutamento
    const recruitSection = document.getElementById('recrutamento');
    if (recruitSection) {
      recruitSection.scrollIntoView({ behavior: 'smooth' });

      // Foca no campo de e-mail após a rolagem para boa acessibilidade
      setTimeout(() => {
        const emailInput = document.getElementById('agent-email');
        if (emailInput) emailInput.focus();
      }, 600);
    }
  });
}

/**
 * Eventos: form_start & form_submit
 * Validação segura de e-mail, sem envio de PII ou gravação em banco/cookies.
 */
function setupFormRecruitment() {
  const form = document.getElementById('recruitment-form');
  const emailInput = document.getElementById('agent-email');
  const errorBox = document.getElementById('email-error');
  const errorText = document.getElementById('email-error-text');
  const successBox = document.getElementById('recruit-success-box');
  const resetBtn = document.getElementById('btn-reset-recruit');
  const submitBtn = document.getElementById('btn-submit-recruit');
  const submitSpinner = submitBtn ? submitBtn.querySelector('.submit-spinner') : null;

  if (!form || !emailInput) return;

  // 1. form_start: Disparado na primeira interação com o campo de e-mail
  function handleFormStart() {
    if (AppState.hasFiredFormStart) return;
    AppState.hasFiredFormStart = true;

    trackEvent('form_start', {
      form_id: 'recruitment-form',
      form_name: 'recrutamento_agente'
    });
  }

  emailInput.addEventListener('focus', handleFormStart, { once: true });
  emailInput.addEventListener('input', handleFormStart, { once: true });

  // Limpa erro conforme o usuário digita
  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('is-invalid')) {
      emailInput.classList.remove('is-invalid');
      if (errorBox) errorBox.hidden = true;
    }
  });

  // 2. Validação e Envio Simulado (form_submit)
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const rawValue = emailInput.value.trim();

    // Validação de formato de e-mail seguro (RFC 5322 simplificado)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    if (!rawValue) {
      showError('O campo de e-mail não pode ficar vazio.');
      return;
    }

    if (!emailRegex.test(rawValue)) {
      showError('Por favor, informe um endereço de e-mail válido (ex: agente@mundoespiritual.gov.br).');
      return;
    }

    // E-mail válido! Proceder com a simulação segura
    clearError();

    // Feedback de carregamento retrô
    if (submitBtn) submitBtn.disabled = true;
    if (submitSpinner) submitSpinner.hidden = false;

    // Grava o e-mail no Cloud Firestore (Coleção: recrutamento_agentes)
    if (firestoreDb && typeof firebase !== 'undefined') {
      try {
        firestoreDb.collection('recrutamento_agentes').add({
          email: rawValue,
          criado_em: firebase.firestore.FieldValue.serverTimestamp(),
          origem: 'landing_page_arquivos',
          status: 'pendente'
        }).then((docRef) => {
          console.info(
            '%c[Cloud Firestore]%c Registro de agente gravado com sucesso! ID:',
            'background: #FFA000; color: #000; font-weight: bold; padding: 2px 6px;',
            'color: #7CFF9B; font-weight: bold;',
            docRef.id
          );
        }).catch((dbErr) => {
          console.warn('[Cloud Firestore] Falha ao gravar no Firestore:', dbErr);
        });
      } catch (err) {
        console.warn('[Cloud Firestore] Exceção ao acessar Firestore:', err);
      }
    }

    // Simulação visual de envio (pequeno delay de 450ms para sensação de transmissão ao vivo)
    setTimeout(() => {
      if (submitBtn) submitBtn.disabled = false;
      if (submitSpinner) submitSpinner.hidden = true;

      // Dispara o evento form_submit do GA4
      // IMPORTANTE: NÃO envia o endereço de e-mail nem qualquer PII
      trackEvent('form_submit', {
        form_id: 'recruitment-form',
        form_name: 'recrutamento_agente',
        simulated_status: 'success'
      });

      // Limpa o valor digitado do campo
      emailInput.value = '';

      // Oculta o formulário e exibe a mensagem de sucesso no site
      form.hidden = true;
      if (successBox) {
        successBox.hidden = false;
        successBox.focus();
      }
    }, 450);
  });

  // Botão para reiniciar a simulação
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.hidden = false;
      if (successBox) successBox.hidden = true;
      AppState.hasFiredFormStart = false; // Permite novo ciclo de teste
      emailInput.value = '';
      emailInput.focus();
    });
  }

  function showError(msg) {
    emailInput.classList.add('is-invalid');
    if (errorText) errorText.textContent = msg;
    if (errorBox) errorBox.hidden = false;
    emailInput.focus();
  }

  function clearError() {
    emailInput.classList.remove('is-invalid');
    if (errorBox) errorBox.hidden = true;
  }
}

/**
 * Evento: easter_egg_click
 * Detector de Energia Espiritual com geração pseudoaleatória e efeito de scanner
 */
function setupEasterEggDetector() {
  const detectBtn = document.getElementById('btn-detect-energy');
  const meterFill = document.getElementById('energy-meter-fill');
  const gaugeVal = document.getElementById('energy-gauge-val');
  const idleState = document.getElementById('scanner-idle-state');
  const activeState = document.getElementById('scanner-active-state');
  const levelBadge = document.getElementById('scanner-level-badge');
  const messageText = document.getElementById('scanner-message-text');

  if (!detectBtn) return;

  detectBtn.addEventListener('click', () => {
    // Escolhe aleatoriamente um dos 5 níveis
    const randomIndex = Math.floor(Math.random() * SPIRIT_LEVELS.length);
    const result = SPIRIT_LEVELS[randomIndex];

    // Efeito sonoro visual / animação da barra de energia
    if (idleState) idleState.hidden = true;
    if (activeState) activeState.hidden = false;

    // Atualiza medidor e números estilo scouter
    if (meterFill) meterFill.style.width = `${result.percent}%`;
    if (gaugeVal) {
      const calculatedValue = Math.floor((result.percent / 100) * 999);
      gaugeVal.textContent = `${String(calculatedValue).padStart(3, '0')} / 999`;
    }

    // Atualiza textos
    if (levelBadge) {
      levelBadge.textContent = result.title.toUpperCase();
    }
    if (messageText) {
      messageText.textContent = result.text;
    }

    // Dispara evento GA4
    trackEvent('easter_egg_click', {
      energy_level: result.level,
      energy_title: result.title,
      feature_name: 'detector_energia_espiritual'
    });
  });
}

/* ============================================================================
   3. RECURSOS ADICIONAIS DE INTERFACE RETRÔ (VHS, SCANLINES & HUD)
   ============================================================================ */

/**
 * Relógio de Código de Tempo VHS no topo
 */
function startVhsClock() {
  const clockEl = document.getElementById('vhs-clock');
  if (!clockEl) return;

  function update() {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    clockEl.textContent = `CANAL-04 ${h}:${m}:${s}`;
  }

  update();
  setInterval(update, 1000);
}

/**
 * Alternador de Efeito VHS (Scanlines) para Acessibilidade e Preferência
 */
function setupVhsEffectToggle() {
  const toggleBtn = document.getElementById('crt-toggle');
  if (!toggleBtn) return;

  let vhsActive = true;
  toggleBtn.addEventListener('click', () => {
    vhsActive = !vhsActive;
    if (vhsActive) {
      document.body.classList.remove('vhs-off');
      toggleBtn.querySelector('.crt-toggle-text').textContent = 'EFEITO VHS: LIGADO';
    } else {
      document.body.classList.add('vhs-off');
      toggleBtn.querySelector('.crt-toggle-text').textContent = 'EFEITO VHS: DESLIGADO';
    }
  });
}

/**
 * Controles do Monitor HUD GA4 (Minimizar / Limpar)
 */
function setupGa4HudControls() {
  const hud = document.getElementById('ga4-hud');
  const toggleHeader = document.getElementById('ga4-hud-toggle');
  const minBtn = document.getElementById('hud-min-btn');
  const clearBtn = document.getElementById('hud-clear-btn');
  const eventList = document.getElementById('hud-event-list');

  if (toggleHeader && hud) {
    toggleHeader.addEventListener('click', () => {
      hud.classList.toggle('is-collapsed');
      if (minBtn) {
        minBtn.textContent = hud.classList.contains('is-collapsed') ? '▲' : '▼';
      }
    });
  }

  if (clearBtn && eventList) {
    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      eventList.innerHTML = '';
    });
  }
}

/* ============================================================================
   4. INICIALIZAÇÃO NO CARREGAMENTO DA PÁGINA
   ============================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initGoogleAnalytics();
  setupScrollDepthTracking();
  setupCtaTracking();
  setupFormRecruitment();
  setupEasterEggDetector();
  startVhsClock();
  setupVhsEffectToggle();
  setupGa4HudControls();
});
