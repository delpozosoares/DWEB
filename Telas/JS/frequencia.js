var alunos = pegarAlunos();
var frequencias = pegarFrequencias();
var alunosDaTurma = [];
var turmaAtual = "";
var dataAtual = "";

var campoTurma = document.getElementById("turma");
var campoData = document.getElementById("data");
var erro = document.getElementById("erro");
var areaLista = document.getElementById("area-lista");
var tabela = document.getElementById("tabela-alunos");

for (var t = 0; t < TURMAS.length; t++) {
    campoTurma.innerHTML += "<option value='" + TURMAS[t] + "'>" + TURMAS[t] + "</option>";
}
campoData.value = dataDeHoje();

function acharFrequencia(idAluno, data) {
    for (var i = 0; i < frequencias.length; i++) {
        if (frequencias[i].idAluno === idAluno && frequencias[i].data === data) {
            return frequencias[i];
        }
    }
    return null;
}

document.getElementById("btn-carregar").addEventListener("click", function () {
    erro.textContent = "";
    areaLista.className = "caixa oculto";

    turmaAtual = campoTurma.value;
    dataAtual = campoData.value;

    if (dataAtual === "") {
        erro.textContent = "Informe a data da aula.";
        return;
    }

    alunosDaTurma = [];
    for (var i = 0; i < alunos.length; i++) {
        if (alunos[i].turma === turmaAtual) {
            alunosDaTurma.push(alunos[i]);
        }
    }

    if (alunosDaTurma.length === 0) {
        erro.textContent = "Essa turma ainda não tem alunos cadastrados.";
        return;
    }

    tabela.innerHTML = "";
    for (var j = 0; j < alunosDaTurma.length; j++) {
        var aluno = alunosDaTurma[j];
        var registro = acharFrequencia(aluno.id, dataAtual);
        var presente = registro === null || registro.presente;

        var linha = document.createElement("tr");
        linha.innerHTML =
            "<td>" + aluno.nome + "</td>" +
            "<td>" +
                "<label class='opcao'><input type='radio' name='aluno-" + aluno.id + "' value='presente'" + (presente ? " checked" : "") + ">Presente</label>" +
                "<label class='opcao'><input type='radio' name='aluno-" + aluno.id + "' value='falta'" + (presente ? "" : " checked") + ">Falta</label>" +
            "</td>";
        tabela.appendChild(linha);
    }

    document.getElementById("titulo-lista").textContent =
        turmaAtual + " - " + formatarData(dataAtual);
    areaLista.className = "caixa";
});

document.getElementById("btn-todos").addEventListener("click", function () {
    for (var i = 0; i < alunosDaTurma.length; i++) {
        document.querySelector("input[name='aluno-" + alunosDaTurma[i].id + "'][value='presente']").checked = true;
    }
});

document.getElementById("btn-salvar").addEventListener("click", function () {
    for (var i = 0; i < alunosDaTurma.length; i++) {
        var aluno = alunosDaTurma[i];
        var escolha = document.querySelector("input[name='aluno-" + aluno.id + "']:checked").value;
        var presente = escolha === "presente";
        var registro = acharFrequencia(aluno.id, dataAtual);

        if (registro === null) {
            frequencias.push({
                id: proximoIdLista(frequencias),
                idAluno: aluno.id,
                turma: turmaAtual,
                data: dataAtual,
                presente: presente,
                justificativa: ""
            });
        } else {
            registro.presente = presente;
            if (presente) {
                registro.justificativa = "";
            }
        }
    }

    salvarFrequencias(frequencias);
    mostrarAviso("Frequência salva com sucesso!");
});
