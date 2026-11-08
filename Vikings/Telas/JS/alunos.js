var alunos = pegarAlunos();
var idParaExcluir = null;

var campoId = document.getElementById("id-aluno");
var campoNome = document.getElementById("nome");
var campoEmail = document.getElementById("email");
var campoTelefone = document.getElementById("telefone");
var campoNascimento = document.getElementById("nascimento");
var campoTurma = document.getElementById("turma");
var tabela = document.getElementById("tabela-alunos");
var erro = document.getElementById("erro");
var busca = document.getElementById("busca");
var tituloForm = document.getElementById("titulo-form");
var modalForm = document.getElementById("modal-form");
var modalExcluir = document.getElementById("modal-excluir");
var modalDetalhes = document.getElementById("modal-detalhes");

for (var t = 0; t < TURMAS.length; t++) {
    campoTurma.innerHTML += "<option value='" + TURMAS[t] + "'>" + TURMAS[t] + "</option>";
}

function listarAlunos() {
    var filtro = busca.value.toLowerCase();
    tabela.innerHTML = "";
    var achou = false;

    for (var i = 0; i < alunos.length; i++) {
        var aluno = alunos[i];

        if (aluno.nome.toLowerCase().indexOf(filtro) === -1) {
            continue;
        }
        achou = true;

        var linha = document.createElement("tr");
        linha.innerHTML =
            "<td>" + aluno.id + "</td>" +
            "<td>" + aluno.nome + "</td>" +
            "<td>" + aluno.turma + "</td>" +
            "<td>" + aluno.telefone + "</td>" +
            "<td class='acoes'>" +
                "<button class='botao botao-pequeno botao-claro' onclick='consultarAluno(" + aluno.id + ")'>Ver</button> " +
                "<button class='botao botao-pequeno' onclick='editarAluno(" + aluno.id + ")'>Editar</button> " +
                "<button class='botao botao-pequeno botao-vermelho' onclick='pedirExclusao(" + aluno.id + ")'>Excluir</button>" +
            "</td>";
        tabela.appendChild(linha);
    }

    if (!achou) {
        tabela.innerHTML = "<tr><td colspan='5' class='vazio'>Nenhum aluno encontrado.</td></tr>";
    }
}

function abrirFormulario() {
    erro.textContent = "";
    modalForm.className = "fundo-modal aberto";
    campoNome.focus();
}

function fecharFormulario() {
    modalForm.className = "fundo-modal";
}

document.getElementById("btn-novo").addEventListener("click", function () {
    campoId.value = "";
    campoNome.value = "";
    campoEmail.value = "";
    campoTelefone.value = "";
    campoNascimento.value = "";
    campoTurma.value = TURMAS[0];
    tituloForm.textContent = "Novo aluno";
    abrirFormulario();
});

document.getElementById("btn-cancelar").addEventListener("click", fecharFormulario);

document.getElementById("form-aluno").addEventListener("submit", function (evento) {
    evento.preventDefault();

    var nome = campoNome.value.trim();
    var email = campoEmail.value.trim();
    var telefone = campoTelefone.value.trim();
    var nascimento = campoNascimento.value;
    var turma = campoTurma.value;

    if (nome === "") {
        erro.textContent = "Informe o nome do aluno.";
        return;
    }
    if (email.indexOf("@") === -1) {
        erro.textContent = "Informe um e-mail válido.";
        return;
    }
    if (telefone === "") {
        erro.textContent = "Informe o telefone.";
        return;
    }
    if (nascimento === "") {
        erro.textContent = "Informe a data de nascimento.";
        return;
    }

    for (var i = 0; i < alunos.length; i++) {
        if (alunos[i].email.toLowerCase() === email.toLowerCase() && String(alunos[i].id) !== campoId.value) {
            erro.textContent = "Já existe um aluno com esse e-mail.";
            return;
        }
    }

    if (campoId.value === "") {
        alunos.push({
            id: proximoIdLista(alunos),
            nome: nome,
            email: email,
            telefone: telefone,
            nascimento: nascimento,
            turma: turma
        });
        mostrarAviso("Aluno cadastrado com sucesso!");
    } else {
        for (var j = 0; j < alunos.length; j++) {
            if (String(alunos[j].id) === campoId.value) {
                alunos[j].nome = nome;
                alunos[j].email = email;
                alunos[j].telefone = telefone;
                alunos[j].nascimento = nascimento;
                alunos[j].turma = turma;
            }
        }
        mostrarAviso("Aluno alterado com sucesso!");
    }

    salvarAlunos(alunos);
    fecharFormulario();
    listarAlunos();
});

function consultarAluno(id) {
    for (var i = 0; i < alunos.length; i++) {
        if (alunos[i].id === id) {
            document.getElementById("dados-aluno").innerHTML =
                "<p><b>ID:</b> " + alunos[i].id + "</p>" +
                "<p><b>Nome:</b> " + alunos[i].nome + "</p>" +
                "<p><b>E-mail:</b> " + alunos[i].email + "</p>" +
                "<p><b>Telefone:</b> " + alunos[i].telefone + "</p>" +
                "<p><b>Data de nascimento:</b> " + formatarData(alunos[i].nascimento) + "</p>" +
                "<p><b>Turma:</b> " + alunos[i].turma + "</p>";
        }
    }
    modalDetalhes.className = "fundo-modal aberto";
}

document.getElementById("btn-fechar-detalhes").addEventListener("click", function () {
    modalDetalhes.className = "fundo-modal";
});

function editarAluno(id) {
    for (var i = 0; i < alunos.length; i++) {
        if (alunos[i].id === id) {
            campoId.value = alunos[i].id;
            campoNome.value = alunos[i].nome;
            campoEmail.value = alunos[i].email;
            campoTelefone.value = alunos[i].telefone;
            campoNascimento.value = alunos[i].nascimento;
            campoTurma.value = alunos[i].turma;
        }
    }
    tituloForm.textContent = "Alterar aluno";
    abrirFormulario();
}

function pedirExclusao(id) {
    idParaExcluir = id;
    for (var i = 0; i < alunos.length; i++) {
        if (alunos[i].id === id) {
            document.getElementById("texto-excluir").textContent =
                "Deseja realmente excluir o aluno " + alunos[i].nome + "? O histórico de frequência dele também será apagado.";
        }
    }
    modalExcluir.className = "fundo-modal aberto";
}

document.getElementById("btn-nao").addEventListener("click", function () {
    modalExcluir.className = "fundo-modal";
});

document.getElementById("btn-sim").addEventListener("click", function () {
    var novaLista = [];
    for (var i = 0; i < alunos.length; i++) {
        if (alunos[i].id !== idParaExcluir) {
            novaLista.push(alunos[i]);
        }
    }
    alunos = novaLista;

    var frequencias = pegarFrequencias();
    var novasFrequencias = [];
    for (var j = 0; j < frequencias.length; j++) {
        if (frequencias[j].idAluno !== idParaExcluir) {
            novasFrequencias.push(frequencias[j]);
        }
    }
    salvarFrequencias(novasFrequencias);

    salvarAlunos(alunos);
    modalExcluir.className = "fundo-modal";
    listarAlunos();
    mostrarAviso("Aluno excluído com sucesso!");
});

busca.addEventListener("input", listarAlunos);

listarAlunos();
