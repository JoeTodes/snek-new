


export function generateCells(gameState) {
    let cells = []
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
    blurScores(cells)

    console.log(gameState);
    console.log(cells);

    return cells
}

export function getNeighbors(cells, x, y) {
    let left = cells[y][x - 1] ?? { wall: true }
    let right = cells[y][x + 1] ?? { wall: true }
    let up = y < cells.length - 1 ? (cells[y + 1][x]) : { wall: true }
    let down = y > 0 ? (cells[y - 1][x]) : { wall: true }
    return [up, right, down, left]
}

function calculateScore(cells, x, y) {
    let cell = cells[y][x]
    cell.score = 0
    if (cell.snake) {
        return
    }
    //set base score based on safe neighbors

    let neighbors = getNeighbors(cells, x, y)

    neighbors.forEach(space => {
        if (isSafe(space)) {
            cell.score += 1 / 4
        }
    })


    //modulate base score based on factors
    let worstNeighbor = neighbors.filter(space => space.snake && !space.snake.you).sort((a, b) => a.snake.position - b.snake.position)[0]
    if (worstNeighbor) {
        percentOfLength = (worstNeighbor.snake.position + 1) / worstNeighbor.snake.length
        cell.score *= percentOfLength
    }
}

function isSafe(cell) {
    if (cell.wall) return false
    if (cell.snake) return false
    return true
}

function blurScores(cells) {
    cells.forEach(row => {
        row.forEach(cell => {
            let neighbors = getNeighbors(cells, cell.x, cell.y)
            let avg = neighbors.filter(space => !space.wall).reduce((acc, cur, i, arr) => acc + cur.score / arr.length, 0)
            cell.blurredScore = cell.score + (avg - cell.score) * 0.5
        })
    })
}