/* ==========================================================
   MÍMICA SANTA
   app.js
========================================================== */

let scenes = [];

let usedScenes = [];

let currentScene = null;

let scoreA = 0;
let scoreB = 0;


/* ==========================================================
   STORAGE KEYS
========================================================== */

const STORAGE_SCENES = "mimica-scenes";

const STORAGE_SCORE_A = "mimica-score-a";

const STORAGE_SCORE_B = "mimica-score-b";

const STORAGE_USED = "mimica-used";


/* ==========================================================
   START
========================================================== */

window.onload = () => {

    loadScenes();

    loadScores();

    loadUsedScenes();

    updateScoreBoard();

    updateAvailable();

}


/* ==========================================================
   LOAD SCENES
========================================================== */

function loadScenes(){

    const json =
        localStorage.getItem(STORAGE_SCENES);

    if(json){

        scenes = JSON.parse(json);

    }
    else{

        scenes =
            structuredClone(defaultScenes);

    }

}


/* ==========================================================
   SAVE SCENES
========================================================== */

function persistScenes(){

    localStorage.setItem(

        STORAGE_SCENES,

        JSON.stringify(scenes)

    );

}


/* ==========================================================
   RESTORE DEFAULT
========================================================== */

function restoreDefaultScenes(){

    if(!confirm("Restaurar todas as mímicas padrão?")){
        return;
    }

    scenes = structuredClone(defaultScenes);

    persistScenes();

    usedScenes = [];
    saveUsedScenes();

    fillEditor();

    updateAvailable();

}


/* ==========================================================
   SCORES
========================================================== */

function loadScores(){

    scoreA = Number(

        localStorage.getItem(STORAGE_SCORE_A)

    ) || 0;

    scoreB = Number(

        localStorage.getItem(STORAGE_SCORE_B)

    ) || 0;

    updateScoreBoard();

}


function saveScores(){

    localStorage.setItem(

        STORAGE_SCORE_A,

        scoreA

    );

    localStorage.setItem(

        STORAGE_SCORE_B,

        scoreB

    );

}


function updateScoreBoard(){

    document
        .getElementById("scoreA")
        .innerText = scoreA;

    document
        .getElementById("scoreB")
        .innerText = scoreB;

}


/* ==========================================================
   USED SCENES
========================================================== */

function loadUsedScenes(){

    const json =
        localStorage.getItem(STORAGE_USED);

    if(json){

        usedScenes =
            JSON.parse(json);

    }

}


function saveUsedScenes(){

    localStorage.setItem(

        STORAGE_USED,

        JSON.stringify(

            usedScenes

        )

    );

}


/* ==========================================================
   NEW GAME
========================================================== */

function resetGame(){

    if(

        !confirm(

            "Iniciar nova partida?"

        )

    ){

        return;

    }

    usedScenes = [];

    scoreA = 0;

    scoreB = 0;

    saveScores();

    saveUsedScenes();

    updateScoreBoard();

    updateAvailable();

}

/* ==========================================================
   EDITOR
========================================================== */

function openEditor(){

    fillEditor();

    document
        .getElementById("editorModal")
        .classList
        .remove("hidden");

}

function closeEditor(){

    document
        .getElementById("editorModal")
        .classList
        .add("hidden");

}


/* ==========================================================
   FILL EDITOR
========================================================== */

function fillEditor(){

    fillField("catolicos","facil");
    fillField("catolicos","medio");
    fillField("catolicos","dificil");

    fillField("biblicos","facil");
    fillField("biblicos","medio");
    fillField("biblicos","dificil");

    fillField("passagens","facil");
    fillField("passagens","medio");
    fillField("passagens","dificil");

    fillField("personagens","facil");
    fillField("personagens","medio");
    fillField("personagens","dificil");

}


function fillField(category,difficulty){

    const textarea = document.getElementById(

        `${category}-${difficulty}`

    );

    textarea.value = scenes

        .filter(scene =>

            scene.category === category &&
            scene.difficulty === difficulty

        )

        .map(scene => scene.text)

        .join("\n");

}


/* ==========================================================
   SAVE
========================================================== */

function saveScenes(){

    scenes = [];

    readField("catolicos","facil",1);
    readField("catolicos","medio",3);
    readField("catolicos","dificil",5);

    readField("biblicos","facil",1);
    readField("biblicos","medio",3);
    readField("biblicos","dificil",5);

    readField("passagens","facil",1);
    readField("passagens","medio",3);
    readField("passagens","dificil",5);

    readField("personagens","facil",1);
    readField("personagens","medio",3);
    readField("personagens","dificil",5);

    persistScenes();

    usedScenes = [];
    saveUsedScenes();

    updateAvailable();

    alert("Mímicas salvas com sucesso!");

    closeEditor();

}


function readField(category,difficulty,points){

    const textarea = document.getElementById(

        `${category}-${difficulty}`

    );

    const lines = textarea.value

        .split("\n")

        .map(item => item.trim())

        .filter(item => item.length > 0);

    lines.forEach(text => {

        scenes.push({

            category,

            difficulty,

            points,

            text

        });

    });

}

/* ==========================================================
   DISPONÍVEIS
========================================================== */

function updateAvailable(){

    const categories =

        [...document.querySelectorAll(

            'input[type=checkbox]:checked'

        )]

        .map(item => item.value);

    const difficulty =

        document.querySelector(

            'input[name=difficulty]:checked'

        ).value;

    const available = scenes.filter(scene =>

        categories.includes(scene.category)

        &&

        scene.difficulty === difficulty

        &&

        !usedScenes.includes(scene.text)

    );

    document
        .getElementById("availableLabel")
        .innerText =
            `Disponíveis: ${available.length}`;

}


/* ==========================================================
   DRAW
========================================================== */

function drawScene(){

    const categories =
        [...document.querySelectorAll(
            'input[type=checkbox]:checked'
        )].map(item=>item.value);

    if(categories.length===0){

        alert("Selecione pelo menos uma categoria.");

        return;

    }

    const difficulty =
        document.querySelector(
            'input[name=difficulty]:checked'
        ).value;

    const available = scenes.filter(scene=>

        categories.includes(scene.category)

        &&

        scene.difficulty===difficulty

        &&

        !usedScenes.includes(scene.text)

    );

    if(available.length===0){

        alert("Não existem mais mímicas disponíveis.");

        return;

    }

    currentScene =
        available[
            Math.floor(
                Math.random()*available.length
            )
        ];

    usedScenes.push(currentScene.text);

    saveUsedScenes();

    updateAvailable();

    document
        .getElementById("configPanel")
        .classList.add("hidden");

    document
        .getElementById("scenePanel")
        .classList.remove("hidden");

    document
        .getElementById("sceneText")
        .innerText =
        currentScene.text;

    document
        .getElementById("scenePoints")
        .innerText =
        `${currentScene.points} ponto${currentScene.points>1?"s":""}`;

    switch(currentScene.difficulty){

        case "facil":

            document
                .getElementById("difficultyStars")
                .innerText="⭐ Fácil";

            break;

        case "medio":

            document
                .getElementById("difficultyStars")
                .innerText="⭐⭐ Médio";

            break;

        case "dificil":

            document
                .getElementById("difficultyStars")
                .innerText="⭐⭐⭐ Difícil";

            break;

    }

}

/* ==========================================================
   FINALIZAR RODADA
========================================================== */

function finishScene(correct){

    if(correct){

        const team =

            document.querySelector(

                'input[name=team]:checked'

            ).value;

        if(team === "A"){

            scoreA += currentScene.points;

        }
        else{

            scoreB += currentScene.points;

        }

        saveScores();

        updateScoreBoard();

    }

    backToMenu();

}


function skipScene(){

    backToMenu();

}


/* ==========================================================
   VOLTAR PARA O MENU
========================================================== */

function backToMenu(){

    currentScene = null;

    document

        .getElementById("scenePanel")

        .classList.add("hidden");

    document

        .getElementById("configPanel")

        .classList.remove("hidden");

    updateAvailable();

}


/* ==========================================================
   EXPORTAR
========================================================== */

function exportScenes(){

    const json =

        JSON.stringify(

            scenes,

            null,

            2

        );

    const blob = new Blob(

        [json],

        {

            type:"application/json"

        }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "mimica-santa.json";

    a.click();

    URL.revokeObjectURL(url);

}


/* ==========================================================
   IMPORTAR
========================================================== */

function importScenes(){

    const input =
        document.getElementById("importFile");

    input.value = "";

    input.onchange = event => {

        const file = event.target.files[0];

        if(!file){
            return;
        }

        const reader = new FileReader();

        reader.onload = e => {

            try{

                const imported =
                    JSON.parse(e.target.result);

                if(!Array.isArray(imported)){
                    throw new Error();
                }

                imported.forEach(scene=>{

                    if(
                        !scene.category ||
                        !scene.difficulty ||
                        !scene.points ||
                        !scene.text
                    ){
                        throw new Error();
                    }

                });

                scenes = imported;

                persistScenes();

                usedScenes = [];
                saveUsedScenes();

                fillEditor();

                updateAvailable();

                alert("Mímicas importadas com sucesso.");

            }
            catch{

                alert("Arquivo JSON inválido.");

            }

        };

        reader.readAsText(file);

    };

    input.click();

}


/* ==========================================================
   UTILIDADES
========================================================== */

function countScenes(

    category,

    difficulty

){

    return scenes.filter(scene =>

        scene.category === category

        &&

        scene.difficulty === difficulty

    ).length;

}


/* ==========================================================
   DEBUG
========================================================== */

// console.table(scenes);


/* ==========================================================
   PRIMEIRA ATUALIZAÇÃO
========================================================== */

updateAvailable();
