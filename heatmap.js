


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
            calculateScore(cells, cell.x, cell.y, gameState.you.health)
        })
    })
    blurScores(cells)



    return cells
}

export function getNeighbors(cells, x, y) {
    let left = cells[y][x - 1] ?? { wall: true }
    left.dir = "left"
    let right = cells[y][x + 1] ?? { wall: true }
    right.dir = "right"
    let up = y < cells.length - 1 ? (cells[y + 1][x]) : { wall: true }
    up.dir = "up"
    let down = y > 0 ? (cells[y - 1][x]) : { wall: true }
    down.dir = "down"
    return [up, right, down, left]
}

function calculateScore(cells, x, y, hp) {
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
    if (cell.score == 0.25) {
        cell.score = 0.1
    }

    //modulate base score based on factors

    //prioritize food scaled by lack of hp

    if (cell.food) {
        let deadness = 100 - hp
        cell.score *= (1 + (deadness / 100) * 0.5)
    }

    //penalty for space being next to other snake, lower risk the further along it is
    let worstNeighbor = neighbors.filter(space => space.snake && !space.snake.you).sort((a, b) => a.snake.position - b.snake.position)[0]
    if (worstNeighbor) {
        let percentOfLength = (worstNeighbor.snake.position + 1) / worstNeighbor.snake.length
        cell.score *= percentOfLength
        //TODO invert if longer than opponent

    }

    //TODO heavy penalty for dead end ajacency



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
            let avg = neighbors.filter(space => !space.wall && !space.snake && space.score < cell.score).reduce((acc, cur, i, arr) => acc + cur.score / arr.length, 0)
            cell.blurredScore = avg ? cell.score + (avg - cell.score) * 0.5 : cell.score
        })
    })
}