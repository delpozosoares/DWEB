var aulas = [
    { turma: "Basic 1 - Noite", professor: "Carlos Mendes", dia: "Segunda", horario: "19:00", sala: "Sala 01" },
    { turma: "Intermediate 2", professor: "Ana Paula", dia: "Terça", horario: "20:00", sala: "Sala 02" },
    { turma: "Advanced 1", professor: "Roberto Lima", dia: "Quarta", horario: "18:30", sala: "Sala 03" },
    { turma: "Kids 3", professor: "Juliana Reis", dia: "Quinta", horario: "14:00", sala: "Sala 01" }
];

function pegarSalas() {
    var dados = localStorage.getItem("salas");
    if (dados) {
        return JSON.parse(dados);
    }
    return [
        { id: 1, numero: "Sala 01", capacidade: 15 },
        { id: 2, numero: "Sala 02", capacidade: 20 },
        { id: 3, numero: "Sala 03", capacidade: 12 }
    ];
}

var salas = pegarSalas();

document.getElementById("total-alunos").textContent = pegarAlunos().length;
document.getElementById("total-professores").textContent = 6;
document.getElementById("total-turmas").textContent = 9;
document.getElementById("total-salas").textContent = salas.length;

var tabela = document.getElementById("tabela-aulas");
for (var i = 0; i < aulas.length; i++) {
    var a = aulas[i];
    var linha = document.createElement("tr");
    linha.innerHTML =
        "<td>" + a.turma + "</td>" +
        "<td>" + a.professor + "</td>" +
        "<td>" + a.dia + "</td>" +
        "<td>" + a.horario + "</td>" +
        "<td>" + a.sala + "</td>";
    tabela.appendChild(linha);
}

var graficoSalas = document.getElementById("grafico-salas");
var maiorSala = 0;
for (var j = 0; j < salas.length; j++) {
    if (salas[j].capacidade > maiorSala) {
        maiorSala = salas[j].capacidade;
    }
}

if (salas.length === 0) {
    graficoSalas.innerHTML = "<p class='vazio'>Nenhuma sala cadastrada.</p>";
}

for (var k = 0; k < salas.length; k++) {
    var largura = (salas[k].capacidade / maiorSala) * 100;
    graficoSalas.innerHTML +=
        "<div class='barra-linha'>" +
            "<div class='nome'>" + salas[k].numero + "</div>" +
            "<div class='barra-fundo'><div class='barra' style='width:" + largura + "%'></div></div>" +
            "<div class='valor'>" + salas[k].capacidade + "</div>" +
        "</div>";
}
