let usedScenes = [];
let currentScene = null;

let scoreA = 0;
let scoreB = 0;

function updateAvailable() {

    const categories = [...document.querySelectorAll('input[type=checkbox]:checked')]
        .map(c => c.value);

    const difficulty =
        document.querySelector('input[name=difficulty]:checked').value;

    const available = scenes.filter(scene =>
        categories.includes(scene.category) &&
        scene.difficulty === difficulty &&
        !usedScenes.includes(scene)
    );

    document.getElementById("availableLabel").innerText =
        "Disponíveis: " + available.length;

}

function drawScene() {

    const categories = [...document.querySelectorAll('input[type=checkbox]:checked')]
        .map(c => c.value);

    if (categories.length === 0) {
        alert("Selecione ao menos uma categoria.");
        return;
    }

    const difficulty =
        document.querySelector('input[name=difficulty]:checked').value;

    const available = scenes.filter(scene =>
        categories.includes(scene.category) &&
        scene.difficulty === difficulty &&
        !usedScenes.includes(scene)
    );

    if (available.length === 0) {
        alert("Não existem mais mímicas disponíveis.");
        return;
    }

    currentScene =
        available[Math.floor(Math.random() * available.length)];

    usedScenes.push(currentScene);

    document.getElementById("configScreen").classList.add("hidden");
    document.getElementById("sceneScreen").classList.remove("hidden");

    document.getElementById("sceneText").innerText =
        currentScene.text;

    document.getElementById("scenePoints").innerText =
        currentScene.points + " ponto" +
        (currentScene.points > 1 ? "s" : "");

    let stars = "";

    switch (difficulty) {

        case "facil":
            stars = "⭐ Fácil";
            break;

        case "medio":
            stars = "⭐⭐ Médio";
            break;

        case "dificil":
            stars = "⭐⭐⭐ Difícil";
            break;

    }

    document.getElementById("difficultyStars").innerText =
        stars;

    updateAvailable();

}

function finishScene(correct) {

    if (correct) {

        const team =
            document.querySelector('input[name=team]:checked').value;

        if (team === "A") {

            scoreA += currentScene.points;

            document.getElementById("scoreA").innerText =
                scoreA;

        } else {

            scoreB += currentScene.points;

            document.getElementById("scoreB").innerText =
                scoreB;

        }

    }

    backToMenu();

}

function skipScene() {

    backToMenu();

}

function backToMenu() {

    currentScene = null;

    document.getElementById("sceneScreen")
        .classList.add("hidden");

    document.getElementById("configScreen")
        .classList.remove("hidden");

    updateAvailable();

}

function resetGame() {

    if (!confirm("Iniciar uma nova partida?"))
        return;

    usedScenes = [];

    scoreA = 0;
    scoreB = 0;

    document.getElementById("scoreA").innerText = "0";
    document.getElementById("scoreB").innerText = "0";

    updateAvailable();

}

updateAvailable();
