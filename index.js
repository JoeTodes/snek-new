// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com
import express from 'express';
import move from './moveLogic.js'
import fs from "fs"
import { generateCells, getNeighbors } from "./heatmap.js"
import path from 'path';

let samples = []
const app = express();
app.use(express.json());
app.use(express.static("static"))
const config = {
  apiversion: "1",
  author: "",       // TODO: Your Battlesnake Username
  color: "#cb82ff", // TODO: Choose color
  head: "default",  // TODO: Choose head, see https://play.battlesnake.com/customizations/ for options unlocked in your account
  tail: "default",  // TODO: Choose tail, see https://play.battlesnake.com/customizations/ for options unlocked in your account
}

//TODO: respond to GET requests on "/" with the config object above
app.get("/", (req, res) => {
  res.send(config)
})

//TODO: respond to POST requests on "/start". Your response itself is ignored, but must have status code "200"
//      the request body will contain objects representing the game instance, game board state, and your snake
//      https://docs.battlesnake.com/api/requests/start
app.post("/start", (req, res) => {
  console.log("new game");
  res.send("ok")
})

//TODO: respond to POST requests on "/move". Your response should be an object with a "move" property and optionally
//      a "shout" property. The request body again contains objects representing the game state
//      https://docs.battlesnake.com/api/requests/move
app.post("/move", (req, res) => {

  samples.push({ board: req.body.board, you: req.body.you })
  // res.send(move(req.body))
  let board = generateCells(req.body)
  let moves = getNeighbors(board, req.body.you.head.x, req.body.you.head.y)

})

//TODO: respond to POST requests on "/end", which signals the end of a game. Your response itself is ignored, 
//      but must have status code "200" the request body will contain objects representing the game
//      https://docs.battlesnake.com/api/requests/end
app.post("/end", (req, res) => {
  fs.writeFileSync("./static/samples.json", JSON.stringify(samples))
  console.log("game over");
  res.send("ok")
})

const host = '0.0.0.0';
const port = process.env.PORT || 8000;

app.listen(port, host, () => {
  console.log(`Running Battlesnake at http://${host}:${port}...`)
});