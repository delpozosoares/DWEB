var alunos = pegarAlunos();
var frequencias = pegarFrequencias();

var tabelaResumo = document.getElementById("tabela-resumo");
var tabelaHistorico = document.getElementById("tabela-historico");
var busca = document.getElementById("busca");
var filtroTurma = document.getElementById("filtro-turma");
var dataInicio = document.getElementById("data-inicio");
var dataFim = document.getElementById("data-fim");
var modalHistorico = document.getElementById("modal-historico");

for (var t = 0; t < TURMAS.length; t++) {
    filtroTurma.innerHTML += "<option value='" + TURMAS[t] + "'>" + TURMAS[t] + "</option>";
}

function frequenciasDoAluno(idAluno) {
    var lista = [];
    for (var i = 0; i < frequencias.length; i++) {
        var f = frequencias[i];
        if (f.idAluno !== idAluno) {
            continue;
        }
        if (dataInicio.value !== "" && f.data < dataInicio.value) {
            continue;
        }
        if (dataFim.value !== "" && f.data > dataFim.value) {
            continue;
        }
        lista.push(f);
    }
    return lista;
}

function listarResumo() {
    var filtro = busca.value.toLowerCase();
    var turma = filtroTurma.value;
    tabelaResumo.innerHTML = "";
    var achou = false;

    for (var i = 0; i < alunos.length; i++) {
        var aluno = alunos[i];

        if (aluno.nome.toLowerCase().indexOf(filtro) === -1) {
            continue;
        }
        if (turma !== "" && aluno.turma !== turma) {
            continue;
        }
        achou = true;

        var registros = frequenciasDoAluno(aluno.id);
        var presencas = 0;
        for (var j = 0; j < registros.length; j++) {
            if (registros[j].presente) {
                presencas++;
            }
        }
        var faltas = registros.length - presencas;

        var percentual = "-";
        var classe = "";
        if (registros.length > 0) {
            var valor = Math.round((presencas / registros.length) * 100);
            percentual = valor + "%";
            if (valor < 75) {
                classe = "baixo";
            }
        }

        var linha = document.createElement("tr");
        linha.innerHTML =
            "<td>" + aluno.nome + "</td>" +
            "<td>" + aluno.turma + "</td>" +
            "<td>" + registros.length + "</td>" +
            "<td>" + presencas + "</td>" +
            "<td>" + faltas + "</td>" +
            "<td class='" + classe + "'>" + percentual + "</td>" +
            "<td class='acoes'><button class='botao botao-pequeno' onclick='verHistorico(" + aluno.id + ")'>Ver histórico</button></td>";
        tabelaResumo.appendChild(linha);
    }

    if (!achou) {
        tabelaResumo.innerHTML = "<tr><td colspan='7' class='vazio'>Nenhum aluno encontrado.</td></tr>";
    }
}

function verHistorico(idAluno) {
    var nome = "";
    for (var i = 0; i < alunos.length; i++) {
        if (alunos[i].id === idAluno) {
            nome = alunos[i].nome;
        }
    }
    document.getElementById("titulo-historico").textContent = "Frequência de " + nome;

    var registros = frequenciasDoAluno(idAluno);
    registros.sort(function (a, b) {
        if (a.data < b.data) {
            return 1;
        }
        if (a.data > b.data) {
            return -1;
        }
        return 0;
    });

    tabelaHistorico.innerHTML = "";
    if (registros.length === 0) {
        tabelaHistorico.innerHTML = "<tr><td colspan='4' class='vazio'>Nenhuma aula registrada neste período.</td></tr>";
    }

    for (var j = 0; j < registros.length; j++) {
        var r = registros[j];
        var situacao = r.presente ? "<span class='presente'>Presente</span>" : "<span class='falta'>Falta</span>";

        var justificativa = "-";
        if (r.justificativa) {
            justificativa = r.justificativa;
        }
        if (r.atestado) {
            justificativa += " (Atestado: " + r.atestado + ")";
        }

        var acao = "";
        if (!r.presente) {
            var texto = r.justificativa || r.atestado ? "Alterar justificativa" : "Justificar";
            acao = "<a class='botao botao-pequeno' href='justificar.html?id=" + r.id + "'>" + texto + "</a>";
        }

        var linha = document.createElement("tr");
        linha.innerHTML =
            "<td>" + formatarData(r.data) + "</td>" +
            "<td>" + situacao + "</td>" +
            "<td>" + justificativa + "</td>" +
            "<td class='acoes'>" + acao + "</td>";
        tabelaHistorico.appendChild(linha);
    }

    modalHistorico.className = "fundo-modal aberto";
}

document.getElementById("btn-fechar-historico").addEventListener("click", function () {
    modalHistorico.className = "fundo-modal";
});

busca.addEventListener("input", listarResumo);
filtroTurma.addEventListener("change", listarResumo);
dataInicio.addEventListener("change", listarResumo);
dataFim.addEventListener("change", listarResumo);

listarResumo();
