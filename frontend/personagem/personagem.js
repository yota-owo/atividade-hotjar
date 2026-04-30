/* ============================================================
   personagem.js — Lógica do Gerador de Ficha (Integrado via API)
   Mighty Blade | A Runa
   ============================================================ */

const API_URL = "http://localhost:3000/api";

/* ── Dados Dinâmicos da API ───────────────────────────────── */
// Agora deixaram de ser constantes fixas para serem populadas pelo Node.js
let RACAS = [];
let CLASSES = [];

const HABILIDADES_RACA = {
  anao: {
    nome: "Coração da Montanha",
    tipo: "Suporte",
    categoria: "Característica",
    descricao:
      "Sua constituição foi forjada nos subterrâneos agrestes e impiedosos, onde apenas os mais resistentes conseguem sobreviver. Você é imune a todos os venenos naturais e mágicos e rola +1d6 em testes para resistir à fadiga, doenças e quaisquer outros efeitos físicos. Além disso, sua Carga é calculada como se você tivesse Força +2.",
  },
  elfo: {
    nome: "Benção de Lathellanis",
    tipo: "Suporte",
    categoria: "Característica",
    descricao:
      "A proteção de Lathellanis é evidente em você, assim como uma pálida sombra da astúcia da divindade da natureza. Você é imune à todas as doenças de origem natural ou mágica, Dreno de Energia e efeitos que causem Envelhecimento (de qualquer tipo ou origem). Além disso, você rola +1d6 em todos os seus testes de Inteligência para perceber e rastrear alvos.",
  },
};

const HABILIDADES_CLASSE = {
  guerreiro: {
    nome: "Mestre de Armas 1",
    tipo: "Suporte",
    categoria: "Técnica",
    descricao:
      "Você é particularmente eficiente no uso de armas brancas. Sempre que realizar um ataque corporal bem sucedido, adicione 3 ao dano do ataque.",
  },
  feiticeiro: {
    nome: "Conhecimento Arcano",
    tipo: "Ação",
    categoria: "Técnica",
    descricao:
      "Você é capaz de decifrar e canalizar os fenômenos do sobrenatural. Você pode ler e utilizar tomos mágicos e desenhar Runas Arcanas. Você também é capaz de canalizar sua energia para a conjuração de fenômenos mágicos com eficiência. Sempre que usar uma Habilidade do tipo Magia, você pode gastar Pontos de Vida ao invés de Pontos de Mana para pagar seu custo. Nesse caso, cada 2 Pontos de Vida equivalem à 1 Ponto de Mana.",
  },
};

const ATRIB_NOMES = {
  forca: "Força",
  agilidade: "Agilidade",
  inteligencia: "Inteligência",
  vontade: "Vontade",
};

const TIPO_CLASS = {
  Suporte: "tag-suporte",
  Ação: "tag-acao",
  Reação: "tag-reacao",
};
const CAT_CLASS = {
  Técnica: "tag-tecnica",
  Característica: "tag-caracteristica",
  Magia: "tag-acao",
  Padrão: "tag-suporte",
};

/* ── Estado da ficha ──────────────────────────────────────── */
const fichaState = {
  nome: "",
  racaId: null,
  classeId: null,
  nivel: 1,
  vida: 60,
  mana: 60,
};

/* ── Sidebar ──────────────────────────────────────────────── */
document.getElementById("btn-toggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("collapsed");
});

/* ── Inicialização ────────────────────────────────────────── */
async function init() {
  await carregarCatalogo(); // Busca do Banco de Dados primeiro
  renderRacas();
  renderClasses();
  renderAtributos();
  renderHabilidades();
  carregarFichaSalva(); // Mantivemos para não perder a ficha se der F5
  mostrarMestreCard();
}

/* ── Integração: Carregar Catálogo da API ─────────────────── */
async function carregarCatalogo() {
  try {
    // 1. Busca Raças
    const resRacas = await fetch(`${API_URL}/catalogo/racas`);
    const racasDb = await resRacas.json();

    // Padrão Adapter: Converte os nomes do banco (forcaBase) para a UI do Guilherme (atributos.forca)
    RACAS = racasDb.map((r) => ({
      id: r.id,
      nome: r.nome,
      atributos: {
        forca: r.forcaBase,
        agilidade: r.agilidadeBase,
        inteligencia: r.inteligenciaBase,
        vontade: r.vontadeBase,
      },
      habilidade: HABILIDADES_RACA[r.id] || {
        nome: "Habilidade Passiva",
        tipo: "Suporte",
        categoria: "Característica",
        descricao: "Habilidade ainda não registrada.",
      },
    }));

    // 2. Busca Classes
    const resClasses = await fetch(`${API_URL}/catalogo/classes`);
    const classesDb = await resClasses.json();

    CLASSES = classesDb.map((c) => ({
      id: c.id,
      nome: c.nome,
      bonus: {
        forca: c.bonusForca,
        agilidade: c.bonusAgilidade,
        inteligencia: c.bonusInteligencia,
        vontade: c.bonusVontade,
      },
      bonusLabel: montarLabelBonus(c),
      habilidade: HABILIDADES_CLASSE[c.id] || {
        nome: "Técnica de Combate",
        tipo: "Ação",
        categoria: "Técnica",
        descricao: "Técnica ainda não registrada.",
      },
    }));
  } catch (e) {
    console.error("Erro na API:", e);
    showToast("Falha ao se conectar com os Arquivos Etéreos.", "error");
  }
}

// Auxiliar para gerar o selo de bônus da classe automaticamente
function montarLabelBonus(c) {
  let label = [];
  if (c.bonusForca) label.push(`For +${c.bonusForca}`);
  if (c.bonusAgilidade) label.push(`Agi +${c.bonusAgilidade}`);
  if (c.bonusInteligencia) label.push(`Int +${c.bonusInteligencia}`);
  if (c.bonusVontade) label.push(`Von +${c.bonusVontade}`);
  return label.join(" | ");
}

/* ── Raça ─────────────────────────────────────────────────── */
function renderRacas() {
  const container = document.getElementById("raca-opcoes");
  container.innerHTML = RACAS.map(
    (raca) => `
    <button class="opcao-btn ${fichaState.racaId === raca.id ? "selected" : ""}" onclick="selecionarRaca('${raca.id}')">
      <span>${raca.nome}</span>
      <span class="opcao-sub">For ${raca.atributos.forca} | Agi ${raca.atributos.agilidade} | Int ${raca.atributos.inteligencia} | Von ${raca.atributos.vontade}</span>
    </button>
  `,
  ).join("");
}

function selecionarRaca(id) {
  fichaState.racaId = fichaState.racaId === id ? null : id;
  renderRacas();
  renderAtributos();
  renderHabilidades();
}

/* ── Classe ───────────────────────────────────────────────── */
function renderClasses() {
  const container = document.getElementById("classe-opcoes");
  container.innerHTML = CLASSES.map(
    (classe) => `
    <button class="opcao-btn ${fichaState.classeId === classe.id ? "selected" : ""}" onclick="selecionarClasse('${classe.id}')">
      <span>${classe.nome}</span>
      <span class="opcao-sub">${classe.bonusLabel}</span>
    </button>
  `,
  ).join("");
}

function selecionarClasse(id) {
  fichaState.classeId = fichaState.classeId === id ? null : id;
  renderClasses();
  renderAtributos();
  renderHabilidades();
}

/* ── Cálculo de atributos ─────────────────────────────────── */
function calcularAtributos() {
  const totais = { forca: 0, agilidade: 0, inteligencia: 0, vontade: 0 };
  const racaSelecionada = RACAS.find((r) => r.id === fichaState.racaId);
  const classeSelecionada = CLASSES.find((c) => c.id === fichaState.classeId);

  if (racaSelecionada) {
    Object.keys(racaSelecionada.atributos).forEach(
      (chave) => (totais[chave] += racaSelecionada.atributos[chave]),
    );
  }
  if (classeSelecionada) {
    Object.keys(classeSelecionada.bonus).forEach(
      (chave) => (totais[chave] += classeSelecionada.bonus[chave]),
    );
  }
  return totais;
}

function renderAtributos() {
  const atributos = calcularAtributos();
  const container = document.getElementById("atrib-list");

  container.innerHTML = Object.entries(ATRIB_NOMES)
    .map(([chave, label]) => {
      const valor = atributos[chave];
      const bonusTexto =
        valor > 0 ? `+${valor}` : valor === 0 ? "—" : `${valor}`;
      return `
      <div class="atrib-row">
        <span class="atrib-name">${label}</span>
        <span class="atrib-val">${valor}</span>
        <span class="atrib-bonus ${valor > 0 ? "positive" : ""}">${bonusTexto}</span>
      </div>
    `;
    })
    .join("");
}

/* ── Habilidades ──────────────────────────────────────────── */
function renderHabilidades() {
  const racaSelecionada = RACAS.find((r) => r.id === fichaState.racaId);
  const classeSelecionada = CLASSES.find((c) => c.id === fichaState.classeId);

  const habilidades = [];
  if (racaSelecionada)
    habilidades.push({
      origem: racaSelecionada.nome,
      ...racaSelecionada.habilidade,
    });
  if (classeSelecionada)
    habilidades.push({
      origem: classeSelecionada.nome,
      ...classeSelecionada.habilidade,
    });

  const container = document.getElementById("habilidades-list");

  if (!habilidades.length) {
    container.innerHTML =
      '<p class="hab-empty">Selecione uma raça e uma classe para ver as habilidades.</p>';
    return;
  }

  container.innerHTML = habilidades
    .map(
      (hab) => `
    <div class="habilidade-card">
      <div class="hab-nome">${hab.nome}</div>
      <div class="hab-tags">
        <span class="hab-tag ${TIPO_CLASS[hab.tipo] || "tag-suporte"}">${hab.tipo}</span>
        <span class="hab-tag ${CAT_CLASS[hab.categoria] || "tag-tecnica"}">${hab.categoria}</span>
        <span class="hab-tag tag-origem">${hab.origem}</span>
      </div>
      <p class="hab-descricao">${hab.descricao}</p>
    </div>
  `,
    )
    .join("");
}

/* ── Integração: Lógica de Permissões (Mestre) ────────────── */
function mostrarMestreCard() {
  const perfil = localStorage.getItem("mb_perfil"); // Pega quem está logado
  const card = document.getElementById("mestre-card");

  // O Dashboard agora é visível para todos os perfis.
  // Se o usuário for Mestre, nós apenas escondemos o card de "Enviar para Mestre".
  if (perfil === "MESTRE") {
    if (card) card.style.display = "none";
  }
}

/* Integra a ação do botão Enviar para Mestre com o Salvar */
function enviarParaMestre() {
  const email = document.getElementById("input-mestre-email").value.trim();
  if (!email) {
    showToast("Informe o email do Mestre.", "error");
    return;
  }
  // Se tem email, chama a função principal de forja
  salvarFicha();
}

/* ── Integração: Salvar no Banco de Dados ──────────────────── */
async function salvarFicha() {
  const nome = document.getElementById("input-nome").value.trim();
  const mestreEmail = document
    .getElementById("input-mestre-email")
    .value.trim(); // Pega caso ele queira vincular

  if (!nome) {
    showToast("Dê um nome ao personagem antes de salvar.", "error");
    return;
  }
  if (!fichaState.racaId) {
    showToast("Selecione uma raça.", "error");
    return;
  }
  if (!fichaState.classeId) {
    showToast("Selecione uma classe.", "error");
    return;
  }

  // 1. Pega a chave de segurança
  const token = localStorage.getItem("mb_token");
  if (!token) {
    showToast("Acesso negado. Você precisa estar logado na Forja.", "error");
    setTimeout(() => (window.location.href = "../login/login.html"), 2000);
    return;
  }

  // 2. Prepara o formato exato que a nossa API espera
  const payload = {
    nome: nome,
    racaId: fichaState.racaId,
    classeId: fichaState.classeId,
    mestreEmail: mestreEmail !== "" ? mestreEmail : undefined,
  };

  try {
    // 3. Manda para o Node.js
    const response = await fetch(`${API_URL}/personagens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.erro || "Falha ao forjar a ficha.", "error");
      return;
    }

    showToast(
      `A Lenda de ${nome} foi registrada no Arquivo Etéreo!`,
      "success",
    );

    // Limpa os dados de localStorage para evitar preencher com a ficha velha depois
    localStorage.removeItem("mb_ficha");
    resetFicha();
  } catch (e) {
    console.error("Erro ao salvar:", e);
    showToast("Erro de conexão. O servidor caiu.", "error");
  }
}

function resetFicha() {
  fichaState.nome = "";
  fichaState.racaId = null;
  fichaState.classeId = null;
  document.getElementById("input-nome").value = "";
  document.getElementById("input-mestre-email").value = "";
  renderRacas();
  renderClasses();
  renderAtributos();
  renderHabilidades();
}

function carregarFichaSalva() {
  const salvo = localStorage.getItem("mb_ficha");
  if (!salvo) return;
  try {
    const dados = JSON.parse(salvo);
    document.getElementById("input-nome").value = dados.nome || "";
    fichaState.nome = dados.nome || "";
    fichaState.racaId = dados.raca || null;
    fichaState.classeId = dados.classe || null;
    renderRacas();
    renderClasses();
    renderAtributos();
    renderHabilidades();
  } catch (erro) {
    console.warn("Não foi possível carregar a ficha salva:", erro);
  }
}

/* ── WIP alert ────────────────────────────────────────────── */
function wipAlert(evento) {
  evento.preventDefault();
  showToast("Esta seção ainda está em desenvolvimento.", "error");
  return false;
}

/* ── Toast ────────────────────────────────────────────────── */
function showToast(mensagem, tipo = "success") {
  const DURACAO_MS = 3200;
  const container = document.getElementById("toast-container");
  const el = document.createElement("div");
  el.className = `toast ${tipo}`;
  el.textContent = mensagem;
  container.appendChild(el);
  setTimeout(() => el.remove(), DURACAO_MS);
}

/* ── Start ────────────────────────────────────────────────── */
init();
