

let cellSize = 60
let states;
let current = 18
let cells

function preload() {
    states = loadJSON("samples.json")

}

function setup() {
    states = Object.keys(states).map(index => states[index])
    noLoop()
    createCanvas(cellSize * 11, cellSize * 11)
}

function draw() {
    background(255)
    generateCells(states[current])
    drawBoard()
    text("hi", 100, 100)
}

function drawBoard() {
    let red = color(255, 0, 0)
    let green = color(0, 255, 0)

    cells.forEach(row => {
        row.forEach(cell => {
            let scoreColor = lerpColor(red, green, cell.score)
            scoreColor.setAlpha(123)
            fill(scoreColor)
            if (cell.snake) {
                fill(cell.snake.color)
                if (cell.snake.position == 0) {
                    strokeWeight(3)
                }
            }
            let rectX = cellSize * cell.x
            let rectY = height - (cellSize * (cell.y + 1))
            rect(rectX, rectY, cellSize, cellSize)
            if (cell.food) {
                fill('orange')
                circle(rectX + cellSize / 2, rectY + cellSize / 2, cellSize / 2)
            }
            fill(0)
            strokeWeight(1)
            text(cell.score, rectX + 5, rectY + 15)
            fill(255)

        })
    })
}

function generateCells(gameState) {
    cells = []
    for (let y = 0; y < gameState.board.height; y++) {
        let row = []
        for (let x = 0; x < gameState.board.width; x++) {
            row.push({ x, y })
        }
        cells.push(row)
    }

    gameState.you.body.forEach((segment, i) => {
        cells[segment.y][segment.x].snake = {
            you: true,
            position: i,
            length: gameState.you.body.length,
            color: gameState.you.customizations.color
        }
    })

    gameState.board.snakes.filter(snake => snake.id != gameState.you.id).forEach(snake => {
        snake.body.forEach((segment, i) => {
            cells[segment.y][segment.x].snake = {
                you: false,
                position: i,
                length: snake.body.length,
                color: snake.customizations.color
            }
        })
    })

    gameState.board.food.forEach(food => {
        cells[food.y][food.x].food = true
    })

    cells.forEach(row => {
        row.forEach(cell => {
            calculateScore(cells, cell.x, cell.y)
        })
    })

    console.log(gameState);
    console.log(cells);


}

function calculateScore(cells, x, y) {
    let cell = cells[y][x]
    cell.score = 0
    if (cell.snake) {
        return
    }
    //set base score based on safe neighbors
    let left = cells[y][x - 1] ?? { wall: true }
    let right = cells[y][x + 1] ?? { wall: true }
    let up = y < cells.length - 1 ? (cells[y + 1][x]) : { wall: true }
    let down = y > 0 ? (cells[y - 1][x]) : { wall: true }
    let neighbors = [up, right, down, left]

    neighbors.forEach(space => {
        if (isSafe(space)) {
            cell.score += 1 / 4
        }
    })

    // console.log(cell.score);

}

function isSafe(cell) {
    if (cell.wall) return false
    if (cell.snake) return false
    return true
}