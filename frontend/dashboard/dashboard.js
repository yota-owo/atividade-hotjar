const API_URL = "http://localhost:3000/api";
let personagensDb = []; // Nossa lista real vinda do banco
const ehMestre = localStorage.getItem("mb_perfil") === "MESTRE";

// ── Guard de Acesso e Saudação ──────────
(function autenticarSessao() {
  const token = localStorage.getItem("mb_token");
  const nome = localStorage.getItem("mb_nome");

  // Se não tiver token, chuta para o login
  if (!token) {
    window.location.href = "../login/login.html";
    return;
  }

  // Atualiza o nome exibido no header
  const spanSaudacao = document.getElementById("header-saudacao");
  if (spanSaudacao && nome) {
    spanSaudacao.innerHTML = `Saudações, <b class="saudacao-nome">${nome}</b>`;
  }

  // Dispara a busca no banco de dados!
  buscarPersonagensDaApi(token);
})();

// ── Integração: Fetch (Listagem) ──────────
async function buscarPersonagensDaApi(token) {
  try {
    const response = await fetch(`${API_URL}/personagens`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Sessão expirada ou erro no servidor.");
      return;
    }

    // Pega as fichas reais do Node.js
    personagensDb = await response.json();
    aplicarFiltros(); // Renderiza na tela
  } catch (erro) {
    console.error("Erro de conexão:", erro);
    alert("Erro ao buscar suas fichas na Forja.");
  }
}

// ── Mapeamento dos elementos do HTML ──────────
const grid = document.getElementById("gridPersonagens");
const emptyState = document.getElementById("emptyState");
const inputBusca = document.getElementById("inputBusca");
const filtroRaca = document.getElementById("filtroRaca");
const filtroClasse = document.getElementById("filtroClasse");

// ── Função que desenha os Cards na Tela ──────────
function renderizarFichas(lista) {
  grid.innerHTML = ""; // Limpa a grid atual

  if (lista.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  lista.forEach((personagem) => {
    // Usa o "include" do Prisma para pegar o nome da raça e classe
    const nomeRaca = personagem.raca ? personagem.raca.nome : "Desconhecida";
    const nomeClasse = personagem.classe
      ? personagem.classe.nome
      : "Desconhecida";

    // Define Vida/Mana/Nivel (Caso ainda não tenha no banco, define padrão)
    const vida = personagem.vidaAtual || 60;
    const mana = personagem.manaAtual || 60;
    const nivel = personagem.nivel || 1;

    const vidaPct = Math.min(100, Math.round((vida / 60) * 100));
    const manaPct = Math.min(100, Math.round((mana / 60) * 100));

    const cardHTML = `
            <div class="personagem-card">
                <h3>${personagem.nome}</h3>
                <p class="personagem-info"><span class="nivel-badge">Nv.${nivel}</span> ${nomeRaca} · ${nomeClasse}</p>

                <div class="personagem-stats">
                    <div class="stat-barra">
                        <span class="stat-label">Vida</span>
                        <div class="barra-track">
                            <div class="barra-fill barra-vida" style="width: ${vidaPct}%"></div>
                        </div>
                    </div>
                    <div class="stat-barra">
                        <span class="stat-label">Mana</span>
                        <div class="barra-track">
                            <div class="barra-fill barra-mana" style="width: ${manaPct}%"></div>
                        </div>
                    </div>
                </div>

                <div class="personagem-acoes">
                    ${ehMestre ? `<button onclick="abrirModalEdicao(${personagem.id}, '${personagem.nome.replace(/'/g, "\\'")}', ${vida}, ${mana})" class="btn-editar">Editar Ficha</button>` : `<button class="btn-editar" disabled>Editar Ficha</button>`}
                    <button onclick="deletarPersonagem(${personagem.id}, '${personagem.nome}')" class="btn-deletar">Excluir</button>
                </div>
            </div>
        `;
    grid.insertAdjacentHTML("beforeend", cardHTML);
  });
}

// ── Função de Filtragem ──────────
function aplicarFiltros() {
  const termoBusca = inputBusca.value.toLowerCase();
  const racaSelecionada = filtroRaca.value;
  const classeSelecionada = filtroClasse.value;

  const listaFiltrada = personagensDb.filter((personagem) => {
    const nomeRaca = personagem.raca ? personagem.raca.nome : "";
    const nomeClasse = personagem.classe ? personagem.classe.nome : "";

    const bateNome = personagem.nome.toLowerCase().includes(termoBusca);
    const bateRaca =
      racaSelecionada === "todas" || nomeRaca === racaSelecionada;
    const bateClasse =
      classeSelecionada === "todas" || nomeClasse === classeSelecionada;

    return bateNome && bateRaca && bateClasse;
  });

  renderizarFichas(listaFiltrada);
}

// Escutando as ações
inputBusca.addEventListener("input", aplicarFiltros);
filtroRaca.addEventListener("change", aplicarFiltros);
filtroClasse.addEventListener("change", aplicarFiltros);

// ── Integração: Deletar no Banco de Dados ──────────
async function deletarPersonagem(id, nome) {
  if (
    !confirm(
      `Tem certeza que deseja apagar a lenda de "${nome}"? Esta ação é irreversível.`,
    )
  )
    return;

  const token = localStorage.getItem("mb_token");

  try {
    const response = await fetch(`${API_URL}/personagens/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.erro || "Sem permissão para deletar.");
      return;
    }

    // Remove do array local para atualizar a tela rápido
    personagensDb = personagensDb.filter((p) => p.id !== id);
    aplicarFiltros();
  } catch (erro) {
    console.error("Erro ao deletar:", erro);
    alert("Erro ao se conectar com a Forja.");
  }
}

// ── Modal de Edição (apenas Mestre) ──────────
function abrirModalEdicao(id, nome, vida, mana) {
  document.getElementById("edit-id").value = id;
  document.getElementById("edit-nome").value = nome;
  document.getElementById("edit-vida").value = vida;
  document.getElementById("edit-mana").value = mana;
  document.getElementById("modal-edicao").classList.remove("hidden");
}

function fecharModal() {
  document.getElementById("modal-edicao").classList.add("hidden");
}

async function confirmarEdicao() {
  const id = Number(document.getElementById("edit-id").value);
  const nome = document.getElementById("edit-nome").value.trim();
  const vidaAtual = Number(document.getElementById("edit-vida").value);
  const manaAtual = Number(document.getElementById("edit-mana").value);

  if (!nome) {
    alert("O nome não pode estar vazio.");
    return;
  }

  const token = localStorage.getItem("mb_token");

  try {
    const response = await fetch(`${API_URL}/personagens/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome, vidaAtual, manaAtual }),
    });

    if (!response.ok) {
      const text = await response.text();
      let mensagem = "Erro ao salvar alterações.";
      try { mensagem = JSON.parse(text).erro || mensagem; } catch (_) {}
      alert(mensagem);
      return;
    }


    const idx = personagensDb.findIndex((p) => p.id === id);
    if (idx !== -1) {
      personagensDb[idx].nome = nome;
      personagensDb[idx].vidaAtual = vidaAtual;
      personagensDb[idx].manaAtual = manaAtual;
    }

    fecharModal();
    aplicarFiltros();
  } catch (erro) {
    console.error("Erro ao editar:", erro);
    alert("Erro ao se conectar com a Forja.");
  }
}

// ── Logout ──────────
function sairDaConta(event) {
  event.preventDefault();
  localStorage.removeItem("mb_token");
  localStorage.removeItem("mb_nome");
  localStorage.removeItem("mb_perfil");
  window.location.href = "../login/login.html";
}
