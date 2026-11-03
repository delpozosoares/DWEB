var alunos = pegarAlunos();
var frequencias = pegarFrequencias();
var faltaAberta = null;
var atestadoAtual = "";

var tabela = document.getElementById("tabela-faltas");
var busca = document.getElementById("busca");
var filtroTurma = document.getElementById("filtro-turma");
var filtroStatus = document.getElementById("filtro-status");
var modalJustificar = document.getElementById("modal-justificar");
var modalConfirmar = document.getElementById("modal-confirmar");
var campoJustificativa = document.getElementById("justificativa");
var campoAtestado = document.getElementById("atestado");
var erro = document.getElementById("erro");

for (var t = 0; t < TURMAS.length; t++) {
    filtroTurma.innerHTML += "<option value='" + TURMAS[t] + "'>" + TURMAS[t] + "</option>";
}

function acharAluno(id) {
    for (var i = 0; i < alunos.length; i++) {
        if (alunos[i].id === id) {
            return alunos[i];
        }
    }
    return null;
}

function foiJustificada(f) {
    return Boolean(f.justificativa) || Boolean(f.atestado);
}

function listarFaltas() {
    var filtro = busca.value.toLowerCase();
    var turma = filtroTurma.value;
    var status = filtroStatus.value;

    var faltas = [];
    for (var i = 0; i < frequencias.length; i++) {
        var f = frequencias[i];
        var aluno = acharAluno(f.idAluno);

        if (f.presente || aluno === null) {
            continue;
        }
        if (aluno.nome.toLowerCase().indexOf(filtro) === -1) {
            continue;
        }
        if (turma !== "" && aluno.turma !== turma) {
            continue;
        }
        if (status === "pendentes" && foiJustificada(f)) {
            continue;
        }
        if (status === "justificadas" && !foiJustificada(f)) {
            continue;
        }
        faltas.push(f);
    }

    faltas.sort(function (a, b) {
        if (a.data < b.data) {
            return 1;
        }
        if (a.data > b.data) {
            return -1;
        }
        return 0;
    });

    tabela.innerHTML = "";
    if (faltas.length === 0) {
        tabela.innerHTML = "<tr><td colspan='5' class='vazio'>Nenhuma falta encontrada.</td></tr>";
    }

    for (var j = 0; j < faltas.length; j++) {
        var falta = faltas[j];
        var dono = acharAluno(falta.idAluno);
        var situacao = foiJustificada(falta) ? "<span class='presente'>Justificada</span>" : "<span class='falta'>Sem justificativa</span>";
        var texto = foiJustificada(falta) ? "Alterar" : "Justificar";

        var linha = document.createElement("tr");
        linha.innerHTML =
            "<td>" + dono.nome + "</td>" +
            "<td>" + dono.turma + "</td>" +
            "<td>" + formatarData(falta.data) + "</td>" +
            "<td>" + situacao + "</td>" +
            "<td class='acoes'><button class='botao botao-pequeno' onclick='abrirJustificar(" + falta.id + ")'>" + texto + "</button></td>";
        tabela.appendChild(linha);
    }
}

function abrirJustificar(idFalta) {
    for (var i = 0; i < frequencias.length; i++) {
        if (frequencias[i].id === idFalta) {
            faltaAberta = frequencias[i];
        }
    }
    var aluno = acharAluno(faltaAberta.idAluno);

    document.getElementById("texto-falta").textContent =
        aluno.nome + " - falta do dia " + formatarData(faltaAberta.data);
    campoJustificativa.value = faltaAberta.justificativa || "";
    campoAtestado.value = "";
    atestadoAtual = faltaAberta.atestado || "";
    document.getElementById("atestado-atual").textContent =
        atestadoAtual === "" ? "" : "Atestado atual: " + atestadoAtual;
    erro.textContent = "";
    modalJustificar.className = "fundo-modal aberto";
    campoJustificativa.focus();
}

document.getElementById("btn-cancelar").addEventListener("click", function () {
    modalJustificar.className = "fundo-modal";
});

document.getElementById("btn-continuar").addEventListener("click", function () {
    var motivo = campoJustificativa.value.trim();
    var temArquivo = campoAtestado.files.length > 0;

    if (motivo === "" && !temArquivo && atestadoAtual === "") {
        erro.textContent = "Informe o motivo da falta ou anexe o atestado.";
        return;
    }
    erro.textContent = "";
    modalConfirmar.className = "fundo-modal aberto";
});

document.getElementById("btn-voltar").addEventListener("click", function () {
    modalConfirmar.className = "fundo-modal";
});

document.getElementById("btn-confirmar").addEventListener("click", function () {
    faltaAberta.justificativa = campoJustificativa.value.trim();
    if (campoAtestado.files.length > 0) {
        faltaAberta.atestado = campoAtestado.files[0].name;
    }
    salvarFrequencias(frequencias);

    modalConfirmar.className = "fundo-modal";
    modalJustificar.className = "fundo-modal";
    listarFaltas();
    mostrarAviso("Justificativa registrada com sucesso!");
});

busca.addEventListener("input", listarFaltas);
filtroTurma.addEventListener("change", listarFaltas);
filtroStatus.addEventListener("change", listarFaltas);

var idDaUrl = new URLSearchParams(location.search).get("id");
if (idDaUrl !== null) {
    filtroStatus.value = "todas";
}

listarFaltas();

if (idDaUrl !== null) {
    for (var k = 0; k < frequencias.length; k++) {
        if (String(frequencias[k].id) === idDaUrl && !frequencias[k].presente) {
            abrirJustificar(frequencias[k].id);
        }
    }
}
