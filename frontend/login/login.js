// URL base da nossa API
const API_URL = "http://localhost:3000/api";

// Selecionando os elementos do DOM
const formLogin = document.getElementById("form-login");
const formCadastro = document.getElementById("form-cadastro");
const subtitulo = document.getElementById("form-subtitle");

// ==========================================
// 1. LÓGICA DE LOGIN INTEGRADA
// ==========================================
formLogin.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Captura os dados digitados
  const email = formLogin.querySelector('input[type="email"]').value;
  const senha = formLogin.querySelector('input[type="password"]').value;
  const btnSubmit = formLogin.querySelector('button[type="submit"]');

  try {
    // Feedback visual de carregamento (Requisito UX/UI)
    btnSubmit.innerText = "Conectando...";
    btnSubmit.disabled = true;

    // Dispara a requisição para o nosso Node.js
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    // Se o Node.js retornar erro (ex: 401 Credenciais inválidas)
    if (!response.ok) {
      alert(data.erro || "Falha ao entrar.");
      return;
    }

    // Sucesso! Salva o Token e os dados no navegador do usuário
    localStorage.setItem("mb_token", data.token);
    localStorage.setItem("mb_perfil", data.usuario.perfil); // Salva se é JOGADOR ou MESTRE
    localStorage.setItem("mb_nome", data.usuario.nome);

    // Redireciona para a página principal (Home/Dashboard)
    window.location.href = "../index/index.html";
  } catch (erro) {
    console.error("Erro na requisição:", erro);
    alert(
      "Erro ao conectar com os servidores da Forja. Verifique se o backend está rodando.",
    );
  } finally {
    // Restaura o botão
    btnSubmit.innerText = "Entrar";
    btnSubmit.disabled = false;
  }
});

// ==========================================
// 2. LÓGICA DE CADASTRO INTEGRADA
// ==========================================
formCadastro.addEventListener("submit", async function (event) {
  event.preventDefault(); // Impede o envio padrão

  // Captura os dados do formulário do Guilherme
  const nome = document.getElementById("cad-nome").value;
  const email = document.getElementById("cad-email").value;
  const senha = document.getElementById("cad-senha").value;
  const confirma = document.getElementById("cad-confirma").value;
  const btnSubmit = formCadastro.querySelector('button[type="submit"]');

  const perfil = document.getElementById("cad-perfil").value || "jogador";

  // Validação customizada de senhas (Mantida intacta)
  if (senha !== confirma) {
    alert("As senhas não coincidem. Tente novamente.");
    return; // Interrompe a execução
  }

  try {
    btnSubmit.innerText = "Forjando conta...";
    btnSubmit.disabled = true;

    // Envia os dados para a rota de cadastro no Node.js
    const response = await fetch(`${API_URL}/auth/cadastro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        email,
        senha,
        perfil: perfil.toUpperCase(),
      }),
    });

    const data = await response.json();

    // Se o e-mail já existir, por exemplo (Status 409)
    if (!response.ok) {
      alert(data.erro || "Falha ao criar conta.");
      return;
    }

    // Se passou por tudo:
    alert("✅ Conta criada com sucesso! Faça o login para continuar.");

    // Limpa os campos do formulário e joga o usuário pra tela de login
    formCadastro.reset();
    toggleForm("login");
  } catch (erro) {
    console.error("Erro na requisição:", erro);
    alert("Erro ao conectar com o servidor da Forja.");
  } finally {
    btnSubmit.innerText = "Cadastrar";
    btnSubmit.disabled = false;
  }
});

// ==========================================
// 3. Lógica dos botões de Caminho (Jogador / Mestre)
// ==========================================
document.querySelectorAll(".perfil-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".perfil-btn").forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    document.getElementById("cad-perfil").value = this.dataset.value;
  });
});

// ==========================================
// 4. Função de Alternância de Telas (Mantida Intacta)
// ==========================================
function toggleForm(tipo) {
  if (tipo === "cadastro") {
    formLogin.classList.add("hidden");
    formCadastro.classList.remove("hidden");
    subtitulo.innerText = "Junte-se à guilda e forje sua lenda.";
  } else {
    formCadastro.classList.add("hidden");
    formLogin.classList.remove("hidden");
    subtitulo.innerText = "Identifique-se para forjar sua lenda.";
  }
}
