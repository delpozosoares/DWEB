var TURMAS = ["Basic 1 - Noite", "Intermediate 2", "Advanced 1", "Kids 3"];

function lerLista(chave) {
    var dados = localStorage.getItem(chave);
    if (dados) {
        return JSON.parse(dados);
    }
    return null;
}

function pegarAlunos() {
    var lista = lerLista("alunos");
    if (lista === null) {
        lista = [
            { id: 1, nome: "Lucas Pereira", email: "lucas@email.com", telefone: "(11) 91111-1111", nascimento: "2005-03-14", turma: "Basic 1 - Noite" },
            { id: 2, nome: "Mariana Souza", email: "mariana@email.com", telefone: "(11) 92222-2222", nascimento: "2002-07-22", turma: "Basic 1 - Noite" },
            { id: 3, nome: "Pedro Alves", email: "pedro@email.com", telefone: "(11) 93333-3333", nascimento: "1998-11-05", turma: "Intermediate 2" },
            { id: 4, nome: "Camila Rocha", email: "camila@email.com", telefone: "(11) 94444-4444", nascimento: "2000-01-30", turma: "Intermediate 2" },
            { id: 5, nome: "Gabriel Costa", email: "gabriel@email.com", telefone: "(11) 95555-5555", nascimento: "2013-09-09", turma: "Kids 3" },
            { id: 6, nome: "Beatriz Nunes", email: "beatriz@email.com", telefone: "(11) 96666-6666", nascimento: "1995-05-18", turma: "Advanced 1" }
        ];
        salvarAlunos(lista);
    }
    return lista;
}

function salvarAlunos(lista) {
    localStorage.setItem("alunos", JSON.stringify(lista));
}

function pegarFrequencias() {
    var lista = lerLista("frequencias");
    if (lista === null) {
        lista = [];
        var alunos = pegarAlunos();
        var datas = ["2026-10-19", "2026-10-26", "2026-11-02"];
        var id = 1;
        for (var i = 0; i < alunos.length; i++) {
            for (var j = 0; j < datas.length; j++) {
                lista.push({
                    id: id,
                    idAluno: alunos[i].id,
                    turma: alunos[i].turma,
                    data: datas[j],
                    presente: (alunos[i].id + j) % 4 !== 0,
                    justificativa: ""
                });
                id++;
            }
        }
        salvarFrequencias(lista);
    }
    return lista;
}

function salvarFrequencias(lista) {
    localStorage.setItem("frequencias", JSON.stringify(lista));
}

function proximoIdLista(lista) {
    var maior = 0;
    for (var i = 0; i < lista.length; i++) {
        if (lista[i].id > maior) {
            maior = lista[i].id;
        }
    }
    return maior + 1;
}

function formatarData(iso) {
    var partes = iso.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function dataDeHoje() {
    var hoje = new Date();
    var mes = String(hoje.getMonth() + 1);
    var dia = String(hoje.getDate());
    if (mes.length === 1) {
        mes = "0" + mes;
    }
    if (dia.length === 1) {
        dia = "0" + dia;
    }
    return hoje.getFullYear() + "-" + mes + "-" + dia;
}

function mostrarAviso(texto) {
    var aviso = document.getElementById("aviso");
    aviso.textContent = texto;
    aviso.className = "aviso mostrar";
    setTimeout(function () {
        aviso.className = "aviso";
    }, 2500);
}
