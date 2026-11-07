const nomes = { 1: "Pedra", 2: "Papel", 3: "Tesoura" };

let pontosUsuario = 0;
let pontosComputador = 0;
let empates = 0;

function jogar(userChoice) {
    const computerChoice = Math.floor(Math.random() * 3) + 1;

    let result;
    let classe;

    if (userChoice === computerChoice) {
        result = "Empate!";
        classe = "empate";
        empates++;
    } else if (
        (userChoice === 1 && computerChoice === 3) ||
        (userChoice === 2 && computerChoice === 1) ||
        (userChoice === 3 && computerChoice === 2)
    ) {
        result = "Você ganhou!";
        classe = "vitoria";
        pontosUsuario++;
    } else {
        result = "O computador ganhou!";
        classe = "derrota";
        pontosComputador++;
    }

    const resultado = document.getElementById("resultado");
    resultado.textContent = `${nomes[userChoice]} x ${nomes[computerChoice]} — ${result}`;
    resultado.className = "resultado " + classe;

    atualizarPlacar();
}

function atualizarPlacar() {
    document.getElementById("pontos-usuario").textContent = pontosUsuario;
    document.getElementById("pontos-computador").textContent = pontosComputador;
    document.getElementById("pontos-empate").textContent = empates;
}

function reiniciar() {
    pontosUsuario = 0;
    pontosComputador = 0;
    empates = 0;
    atualizarPlacar();
    const resultado = document.getElementById("resultado");
    resultado.textContent = "Faça sua jogada!";
    resultado.className = "resultado";
}
