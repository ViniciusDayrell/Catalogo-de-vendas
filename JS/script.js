// Seleciona os elementos
const form = document.getElementById("form");
const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const comentarioInput = document.getElementById("comentario");
const listaComentarios = document.getElementById("lista-comentarios");

// ===== Função: Validar Email =====
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ===== Carregar comentários ao abrir a página =====
function carregarComentarios() {
    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    comentarios.forEach(adicionarComentarioNaPagina);
}

// ===== Criar card de comentário na página =====
function adicionarComentarioNaPagina({ id, nome, email, comentario, data }) {
    const card = document.createElement("div");
    card.classList.add("comentario-card");
    card.setAttribute("data-id", id);
    
    // Escapar HTML para evitar XSS
    const nomeSeguro = escaparHTML(nome);
    const comentarioSeguro = escaparHTML(comentario);
    
    card.innerHTML = `
        <div class="info-top">
            <div class="avatar">${nomeSeguro[0].toUpperCase()}</div>
            <div class="nome-data">
                <span>${nomeSeguro}</span>
                <span>${data}</span>
            </div>
        </div>
        <p class="texto-comentario">${comentarioSeguro}</p>
        <div class="actions">
            <div class="left">
                <button class="curtir-btn">❤ Curtir</button>
                <button class="responder-btn">↩ Responder</button>
            </div>
            <div class="right">
                <button class="delete-btn">🗑 Excluir</button>
            </div>
        </div>
    `;
    
    // Evento excluir
    card.querySelector(".delete-btn").addEventListener("click", () => {
        if (confirm("Deseja realmente excluir este comentário?")) {
            card.classList.add("removendo"); // animação
            setTimeout(() => {
                removerComentario(id);
                card.remove();
            }, 300);
        }
    });
    
    listaComentarios.prepend(card); // Adiciona no topo (mais recente primeiro)
}

// ===== Função auxiliar: Escapar HTML =====
function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// ===== Salvar comentário no localStorage =====
function salvarComentario(nome, email, comentario) {
    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    const novoComentario = {
        id: Date.now(),
        nome,
        email,
        comentario,
        data: new Date().toLocaleDateString("pt-BR", {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    comentarios.unshift(novoComentario); // Adiciona no início do array
    localStorage.setItem("comentarios", JSON.stringify(comentarios));
    return novoComentario;
}

// ===== Remover comentário do localStorage =====
function removerComentario(id) {
    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    const novoArray = comentarios.filter(c => c.id !== id);
    localStorage.setItem("comentarios", JSON.stringify(novoArray));
}

// ===== Evento submit =====
form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const comentario = comentarioInput.value.trim();
    
    // Validação simples
    if (!nome || !email || !comentario) {
        alert("Por favor, preencha todos os campos.");
        nomeInput.focus();
        return;
    }
    
    if (nome.length < 3) {
        alert("O nome deve ter pelo menos 3 caracteres.");
        nomeInput.focus();
        return;
    }
    
    if (!validarEmail(email)) {
        alert("Por favor, insira um e-mail válido.");
        emailInput.focus();
        return;
    }
    
    if (comentario.length < 10) {
        alert("O comentário deve ter pelo menos 10 caracteres.");
        comentarioInput.focus();
        return;
    }
    
    // Criar e salvar comentário
    const novo = salvarComentario(nome, email, comentario);
    
    // Mostrar na página
    adicionarComentarioNaPagina(novo);
    
    // Limpar o formulário
    form.reset();
    
    // Focar no primeiro campo
    nomeInput.focus();
    
    alert("Comentário enviado com sucesso! ⚪🔴⚫");
});

// Carregar ao iniciar
carregarComentarios();