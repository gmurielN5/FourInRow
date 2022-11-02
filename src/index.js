import "./style.css"
import Game from "./javascript/Game.js"
import logo from "./images/connect4.png"

const logoImg = document.getElementById("logoImg")
logoImg.src = logo

const game = new Game()

/**
 * Listens for click on `#begin-game` and calls startGame() on game object
 */
document.getElementById("begin-game").addEventListener("click", function () {
  game.startGame()
  this.style.display = "none"
})

/**
 * Listen for keyboard presses
 */
document.addEventListener("keydown", function (event) {
  game.handleKeydown(event)
})
