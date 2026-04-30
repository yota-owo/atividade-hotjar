/**
 * Bloqueia o redirecionamento dos cards inativos e exibe feedback visual.
 * (Mantido do código original do Guilherme)
 */
function mostrarAvisoObras(event) {
  event.preventDefault();
  alert(
    "🚧 Funcionalidade em desenvolvimento!\n\nEsta área será desbloqueada nas próximas atualizações da Forja.",
  );
}

// ==========================================
// LÓGICA DE SESSÃO E INTEGRAÇÃO (HOME)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Busca os dados salvos no navegador (se existirem)
  const token = localStorage.getItem("mb_token");
  const nome = localStorage.getItem("mb_nome");
  const perfil = localStorage.getItem("mb_perfil");

  // 2. Procura a área do cabeçalho onde fica o botão de login
  const menuUsuario = document.getElementById("menu-usuario");

  // 3. Se tem token e nome, o usuário está logado!
  if (token && nome) {
    if (menuUsuario) {
      // Remove o botão "Entrar / Cadastrar" e injeta a Saudação + Botão de Sair
      // Obs: Mantive a estrutura HTML simples para herdar o CSS do Guilherme
      menuUsuario.innerHTML = `
                <span style="color: #A1A1AA; margin-right: 20px; font-size: 0.9rem;">
                    Saudações, <strong style="color: #EAB308;">${nome}</strong>
                </span>
                <a href="#" id="btn-sair" style="color: #EF4444; text-decoration: none; font-size: 0.9rem; transition: 0.3s;">
                    Sair da Conta
                </a>
            `;

      // Ativa a funcionalidade de Sair (Logout)
      document.getElementById("btn-sair").addEventListener("click", (event) => {
        event.preventDefault();
        sairDaConta();
      });
    }

    // 4. Lógica de Perfis (Mestre vs Jogador)
    // Se houver algum menu lateral de "Dashboard" que só o Mestre pode ver, a lógica entra aqui:
    if (perfil === "MESTRE") {
      console.log("👑 Mestre da Forja reconhecido. Carregando privilégios...");
      // Exemplo: document.getElementById('menu-dashboard-mestre').classList.remove('hidden');
    } else {
      console.log("⚔️ Jogador reconhecido.");
    }
  } else {
    console.log("Visitante não autenticado na Forja.");
    // Se não tem token, deixa o botão "Entrar / Cadastrar" que já veio no HTML estático do Guilherme.
  }
});

// Função para limpar a sessão e deslogar
function sairDaConta() {
  // Apaga os dados de segurança do navegador
  localStorage.removeItem("mb_token");
  localStorage.removeItem("mb_nome");
  localStorage.removeItem("mb_perfil");

  // Recarrega a página para voltar ao estado de "Visitante"
  window.location.reload();
}
