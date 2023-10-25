let cellSize = 60
let states;

function preload() {
    states = loadJSON("samples.json")

}

function setup() {
    states = Object.keys(states).map(index => states[index])
    noLoop()
    createCanvas(cellSize * 11, cellSize * 11)
}

function draw() {
    background(50)
}

function drawBoard(gameState) {

}