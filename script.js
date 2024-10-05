// Variables globales para almacenar la cuadrícula y los puntos de inicio/fin
let cuadricula = [];
let inicio = null;
let fin = null;
let columnas = 10;
let filas = 10;

// Crear la cuadrícula y añadir celdas al DOM
function crearCuadricula() {
    let contenedorCuadricula = document.getElementById('cuadricula');
    contenedorCuadricula.innerHTML = '';

    for (let i = 0; i < filas; i++) {
        cuadricula[i] = [];
        for (let j = 0; j < columnas; j++) {
            let celda = document.createElement('div');
            celda.className = 'celda';
            celda.onclick = () => seleccionarCelda(i, j);
            contenedorCuadricula.appendChild(celda);
            cuadricula[i][j] = {
                elemento: celda,
                distancia: Infinity,
                visitado: false,
                x: i,
                y: j,
                vecinos: []
            };
        }
    }
}

// Seleccionar puntos de inicio y fin en la cuadrícula
function seleccionarCelda(x, y) {
    if (!inicio) {
        cuadricula[x][y].elemento.classList.add('inicio');
        cuadricula[x][y].distancia = 0;
        inicio = cuadricula[x][y];
    } else if (!fin && cuadricula[x][y] !== inicio) {
        cuadricula[x][y].elemento.classList.add('fin');
        fin = cuadricula[x][y];
    }
}

// Iniciar el algoritmo de Dijkstra
async function iniciarDijkstra() {
    if (!inicio || !fin) {
        document.getElementById('estadoJuego').innerText = 'Selecciona los puntos de inicio y fin.';
        return;
    }

    let abiertos = [inicio];

    while (abiertos.length > 0) {
        // Ordenar los nodos abiertos por distancia
        abiertos.sort((a, b) => a.distancia - b.distancia);
        let actual = abiertos.shift();

        // Si llegamos al punto final, terminamos
        if (actual === fin) {
            mostrarCamino();
            document.getElementById('estadoJuego').innerText = '¡Camino encontrado!';
            return;
        }

        // Marcar el nodo como visitado
        actual.visitado = true;
        await expandirVecinos(actual, abiertos);
    }
    document.getElementById('estadoJuego').innerText = 'No se encontró un camino.';
}

// Expandir los vecinos del nodo actual
async function expandirVecinos(nodo, abiertos) {
    let vecinos = obtenerVecinos(nodo);
    for (let vecino of vecinos) {
        if (!vecino.visitado && !abiertos.includes(vecino)) {
            vecino.distancia = nodo.distancia + 1;
            abiertos.push(vecino);
            vecino.elemento.style.backgroundColor = 'lightblue';
            await sleep(100); // Pausa para visualización
        }
    }
}

// Obtener los vecinos de un nodo
function obtenerVecinos(nodo) {
    let vecinos = [];
    let { x, y } = nodo;

    if (x > 0) vecinos.push(cuadricula[x - 1][y]);
    if (x < filas - 1) vecinos.push(cuadricula[x + 1][y]);
    if (y > 0) vecinos.push(cuadricula[x][y - 1]);
    if (y < columnas - 1) vecinos.push(cuadricula[x][y + 1]);

    return vecinos;
}

// Mostrar el camino mínimo encontrado
function mostrarCamino() {
    let actual = fin;
    while (actual !== inicio) {
        actual.elemento.classList.add('camino');
        actual = obtenerVecinos(actual).find(v => v.distancia === actual.distancia - 1);
    }
    inicio.elemento.classList.add('camino');
}

// Función para pausar la ejecución y visualizar el proceso
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Reiniciar la simulación
function reiniciar() {
    inicio = null;
    fin = null;
    document.getElementById('estadoJuego').innerText = '';
    crearCuadricula();
}

// Inicializamos la cuadrícula al cargar la página
window.onload = crearCuadricula;

