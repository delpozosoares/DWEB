var salas = [];
var idParaExcluir = null;

var campoId = document.getElementById("id-sala");
var campoNumero = document.getElementById("numero");
var campoCapacidade = document.getElementById("capacidade");
var tabela = document.getElementById("tabela-salas");
var erro = document.getElementById("erro");
var busca = document.getElementById("busca");
var tituloForm = document.getElementById("titulo-form");
var modalForm = document.getElementById("modal-form");
var modalExcluir = document.getElementById("modal-excluir");
var aviso = document.getElementById("aviso");

function mostrarAviso(texto) {
    aviso.textContent = texto;
    aviso.className = "aviso mostrar";
    setTimeout(function () {
        aviso.className = "aviso";
    }, 2500);
}

async function carregarSalas() {
    tabela.innerHTML = "<tr><td colspan='4' class='vazio'>Carregando...</td></tr>";
    try {
        var resposta = await fetch("/api/salas");
        if (!resposta.ok) {
            throw new Error("Falha ao carregar salas");
        }
        salas = await resposta.json();
    } catch (e) {
        salas = [];
        mostrarAviso("Não foi possível carregar as salas. Tente novamente.");
    }
    listarSalas();
}

function listarSalas() {
    var filtro = busca.value.toLowerCase();
    tabela.innerHTML = "";
    var achou = false;

    for (var i = 0; i < salas.length; i++) {
        var sala = salas[i];

        if (sala.numero.toLowerCase().indexOf(filtro) === -1) {
            continue;
        }
        achou = true;

        var linha = document.createElement("tr");
        linha.innerHTML =
            "<td>" + sala.id + "</td>" +
            "<td>" + sala.numero + "</td>" +
            "<td>" + sala.capacidade + " alunos</td>" +
            "<td class='acoes'>" +
                "<button class='botao botao-pequeno botao-claro' onclick='consultarSala(" + sala.id + ")'>Ver</button> " +
                "<button class='botao botao-pequeno' onclick='editarSala(" + sala.id + ")'>Editar</button> " +
                "<button class='botao botao-pequeno botao-vermelho' onclick='pedirExclusao(" + sala.id + ")'>Excluir</button>" +
            "</td>";
        tabela.appendChild(linha);
    }

    if (!achou) {
        tabela.innerHTML = "<tr><td colspan='4' class='vazio'>Nenhuma sala encontrada.</td></tr>";
    }
}

function abrirFormulario() {
    erro.textContent = "";
    modalForm.className = "fundo-modal aberto";
    campoNumero.focus();
}

function fecharFormulario() {
    modalForm.className = "fundo-modal";
}

document.getElementById("btn-nova").addEventListener("click", function () {
    campoId.value = "";
    campoNumero.value = "";
    campoCapacidade.value = "";
    tituloForm.textContent = "Nova sala";
    abrirFormulario();
});

document.getElementById("btn-cancelar").addEventListener("click", fecharFormulario);

document.getElementById("form-sala").addEventListener("submit", async function (evento) {
    evento.preventDefault();

    var numero = campoNumero.value.trim();
    var capacidade = parseInt(campoCapacidade.value);

    if (numero === "") {
        erro.textContent = "Informe o número ou nome da sala.";
        return;
    }
    if (isNaN(capacidade) || capacidade <= 0) {
        erro.textContent = "A capacidade deve ser maior que zero.";
        return;
    }

    var ehEdicao = campoId.value !== "";
    var url = ehEdicao ? "/api/salas/" + campoId.value : "/api/salas";
    var metodo = ehEdicao ? "PUT" : "POST";

    var botaoSalvar = evento.target.querySelector("button[type='submit']");
    botaoSalvar.disabled = true;

    try {
        var resposta = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ numero: numero, capacidade: capacidade })
        });
        var dados = await resposta.json();

        if (!resposta.ok) {
            erro.textContent = dados.erro || "Não foi possível salvar a sala.";
            return;
        }

        fecharFormulario();
        await carregarSalas();
        mostrarAviso(ehEdicao ? "Sala alterada com sucesso!" : "Sala cadastrada com sucesso!");
    } catch (e) {
        erro.textContent = "Erro de conexão. Tente novamente.";
    } finally {
        botaoSalvar.disabled = false;
    }
});

function consultarSala(id) {
    for (var i = 0; i < salas.length; i++) {
        if (salas[i].id === id) {
            document.getElementById("dados-sala").innerHTML =
                "<p><b>ID:</b> " + salas[i].id + "</p>" +
                "<p><b>Número / Nome:</b> " + salas[i].numero + "</p>" +
                "<p><b>Capacidade:</b> " + salas[i].capacidade + " alunos</p>";
        }
    }
    document.getElementById("modal-detalhes").className = "fundo-modal aberto";
}

document.getElementById("btn-fechar-detalhes").addEventListener("click", function () {
    document.getElementById("modal-detalhes").className = "fundo-modal";
});

function editarSala(id) {
    for (var i = 0; i < salas.length; i++) {
        if (salas[i].id === id) {
            campoId.value = salas[i].id;
            campoNumero.value = salas[i].numero;
            campoCapacidade.value = salas[i].capacidade;
        }
    }
    tituloForm.textContent = "Alterar sala";
    abrirFormulario();
}

function pedirExclusao(id) {
    idParaExcluir = id;
    for (var i = 0; i < salas.length; i++) {
        if (salas[i].id === id) {
            document.getElementById("texto-excluir").textContent =
                "Deseja realmente excluir a " + salas[i].numero + "? Essa ação não pode ser desfeita.";
        }
    }
    modalExcluir.className = "fundo-modal aberto";
}

document.getElementById("btn-nao").addEventListener("click", function () {
    modalExcluir.className = "fundo-modal";
});

document.getElementById("btn-sim").addEventListener("click", async function () {
    try {
        var resposta = await fetch("/api/salas/" + idParaExcluir, { method: "DELETE" });
        if (!resposta.ok && resposta.status !== 204) {
            throw new Error("Falha ao excluir");
        }
        modalExcluir.className = "fundo-modal";
        await carregarSalas();
        mostrarAviso("Sala excluída com sucesso!");
    } catch (e) {
        modalExcluir.className = "fundo-modal";
        mostrarAviso("Não foi possível excluir a sala.");
    }
});

busca.addEventListener("input", listarSalas);

carregarSalas();
