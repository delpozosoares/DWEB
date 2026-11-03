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

function carregarSalas() {
    var dados = localStorage.getItem("salas");
    if (dados) {
        salas = JSON.parse(dados);
    } else {
        salas = [
            { id: 1, numero: "Sala 01", capacidade: 15 },
            { id: 2, numero: "Sala 02", capacidade: 20 },
            { id: 3, numero: "Sala 03", capacidade: 12 }
        ];
        salvarSalas();
    }
}

function salvarSalas() {
    localStorage.setItem("salas", JSON.stringify(salas));
}

function proximoId() {
    var maior = 0;
    for (var i = 0; i < salas.length; i++) {
        if (salas[i].id > maior) {
            maior = salas[i].id;
        }
    }
    return maior + 1;
}

function mostrarAviso(texto) {
    aviso.textContent = texto;
    aviso.className = "aviso mostrar";
    setTimeout(function () {
        aviso.className = "aviso";
    }, 2500);
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

document.getElementById("form-sala").addEventListener("submit", function (evento) {
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

    for (var i = 0; i < salas.length; i++) {
        if (salas[i].numero.toLowerCase() === numero.toLowerCase() && String(salas[i].id) !== campoId.value) {
            erro.textContent = "Já existe uma sala com esse nome.";
            return;
        }
    }

    if (campoId.value === "") {
        salas.push({ id: proximoId(), numero: numero, capacidade: capacidade });
        mostrarAviso("Sala cadastrada com sucesso!");
    } else {
        for (var j = 0; j < salas.length; j++) {
            if (String(salas[j].id) === campoId.value) {
                salas[j].numero = numero;
                salas[j].capacidade = capacidade;
            }
        }
        mostrarAviso("Sala alterada com sucesso!");
    }

    salvarSalas();
    fecharFormulario();
    listarSalas();
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

document.getElementById("btn-sim").addEventListener("click", function () {
    var novaLista = [];
    for (var i = 0; i < salas.length; i++) {
        if (salas[i].id !== idParaExcluir) {
            novaLista.push(salas[i]);
        }
    }
    salas = novaLista;

    salvarSalas();
    modalExcluir.className = "fundo-modal";
    listarSalas();
    mostrarAviso("Sala excluída com sucesso!");
});

busca.addEventListener("input", listarSalas);

carregarSalas();
listarSalas();
