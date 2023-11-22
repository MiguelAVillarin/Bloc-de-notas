let main = document.getElementById("main");
let botonAdd = document.getElementById("add");
let botonRemove = document.getElementById("remove");

import { DatabaseManager } from "./indexDB.js";
const dbManager = DatabaseManager.getInstance();

botonRemove.addEventListener("click", removeNotas);
botonAdd.addEventListener("click", createNote);

function createNote() {
    let numNotas = createID();
    let nota = document.createElement("div");
    nota.innerHTML = `
        <div class="headerNota" id="headerNota${numNotas}">
        <div class="buttomDelete">
        <label for="colorPicker${numNotas}"><img src="src/img/colores.png" class="basuraIcon">
        </label>
        <input type="color" value="#9198e5" id="colorPicker${numNotas}" class="colorPicker">
      </div>
            <button id="delete${numNotas}" class="buttomDelete"><img src="src/img/cancelar.png" class="basuraIcon"></button>
        </div>
        <div class="texto">
            <textarea placeholder="Introduce el texto..." id="texto${numNotas}"></textarea>
        </div>`;
    nota.classList.add("nota");
    nota.id = `nota${numNotas}`;
    main.appendChild(nota);
    document.getElementById(`delete${numNotas}`).addEventListener("click", function () {
        nota.remove();
        removeNota(numNotas);
    }, false);
    document.getElementById(`texto${numNotas}`).addEventListener("focusout", function () {
        updateDatos(numNotas);
    }, false);
    let colorPicker = document.getElementById(`colorPicker${numNotas}`);
    let header = document.getElementById(`headerNota${numNotas}`);
    header.style.backgroundColor = colorPicker.value;
    colorPicker.addEventListener("input", function () {
        header.style.backgroundColor = colorPicker.value;
        updateDatos(numNotas);
    }, false);
    let notaCreada = {
        id: `${numNotas}`,
        color: `${colorPicker.value}`,
        texto: `${document.getElementById(`texto${numNotas}`).value}`
    }
    dbManager.open().then(() => {
        dbManager.addData(notaCreada)
            .then(() => {
                dbManager.counter++;
            })
            .catch((error) => {
                console.error("Error addData: " + error);
            });
    })
        .catch((error) => {
            console.error("Error open: " + error);
        });
}

function removeNotas() {
    let notas = document.querySelectorAll('[id^="nota"]');
    notas.forEach(element => {
        removeNota(element.id.substring(4));
        element.remove();
    });
}

function createID() {
    return Math.random().toString(16).slice(2);
}

function updateDatos(id){
    let texto=document.getElementById(`texto${id}`).value;
    let color=document.getElementById(`colorPicker${id}`).value;
    let notaUpdate={
        id: `${id}`,
        color: `${color}`,
        texto: `${texto}`
    }

    dbManager.open().then(() => {
        dbManager.addData(notaUpdate)
            .then(() => {
                dbManager.counter++;
            })
            .catch((error) => {
                console.error("Error addData: " + error);
            });
    })
        .catch((error) => {
            console.error("Error open: " + error);
        });
}

function createNotaParams(notaParams){
    let numNotas = notaParams.id;
    let nota = document.createElement("div");
    nota.innerHTML = `
        <div class="headerNota" id="headerNota${numNotas}">
        <div class="buttomDelete">
        <label for="colorPicker${numNotas}"><img src="src/img/colores.png" class="basuraIcon">
        </label>
        <input type="color" value="${notaParams.color}" id="colorPicker${numNotas}" class="colorPicker">
      </div>
            <button id="delete${numNotas}" class="buttomDelete"><img src="src/img/cancelar.png" class="basuraIcon"></button>
        </div>
        <div class="texto">
            <textarea placeholder="Introduce el texto..." id="texto${numNotas}">${notaParams.texto}</textarea>
        </div>`;
    nota.classList.add("nota");
    nota.id = `nota${numNotas}`;
    main.appendChild(nota);
    document.getElementById(`delete${numNotas}`).addEventListener("click", function () {
        nota.remove();
        removeNota(numNotas);
    }, false);
    document.getElementById(`texto${numNotas}`).addEventListener("focusout", function () {
        updateDatos(numNotas);
    }, false);
    let colorPicker = document.getElementById(`colorPicker${numNotas}`);
    let header = document.getElementById(`headerNota${numNotas}`);
    header.style.backgroundColor = colorPicker.value;
    colorPicker.addEventListener("input", function () {
        header.style.backgroundColor = colorPicker.value;
        updateDatos(numNotas);
    }, false);
}

function removeNota(id){
    dbManager.open().then(() => {
        dbManager.delete(id)
            .then(() => {
            })
            .catch((error) => {
                console.error("Error addData: " + error);
            });
    })
        .catch((error) => {
            console.error("Error open: " + error);
        });
}

dbManager.open().then(() => {
    dbManager.getAll()
        .then((e) => {
            e.forEach(element => {
                createNotaParams(element);
            });
        })
        .catch((error) => {
            console.error("Error addData: " + error);
        });
})
    .catch((error) => {
        console.error("Error open: " + error);
    });
