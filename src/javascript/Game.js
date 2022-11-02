import * as THREE from "three"
import WebGL from "../utils/WebGL"

import Player from "./Player.js"
import Board from "./Board.js"
import Environment from "./Environment"

export default class Game {
  constructor() {
    this.container = document.getElementById("webgl")
    this.camera
    this.scene
    this.renderer
    this.board = new Board()
    this.players = this.createPlayers()
    this.environment = new Environment()
    this.ready = false

    this.assetsPath = "./assets/fbx"

    this.clock = new THREE.Clock()

    window.addEventListener(
      "resize",
      function () {
        game.onWindowResize()
      },
      false
    )

    window.onError = function (error) {
      console.error(JSON.stringify(error))
    }
  }

  /**
   * Returns active player.
   * @return  {Object}    player - The active player.
   */
  get activePlayer() {
    return this.players.find((player) => player.active)
  }

  /**
   * Creates two player objects
   * @return  {array}    An array of two player objects.
   */
  createPlayers() {
    const players = [
      new Player("Player 1", 1, `Donut`, true),
      new Player("Player 2", 2, `Apple`),
    ]

    return players
  }

  /**
   * Initializes Three Scene.
   */
  init() {
    //Set Three components
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x49baf2)

    //Camera
    this.setCamera()
    //Light
    this.setLights()
    //Render the scene
    this.setRender()
  }

  /**
   * Render.
   */
  setRender() {
    // renderer the scene
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.container,
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true

    // Check WebGL compatibilty with devices or browsers
    if (WebGL.isWebGLAvailable()) {
      this.renderer.setAnimationLoop(() => {
        this.animate()
      })
    } else {
      const warning = WebGL.getWebGLErrorMessage()
      document.getElementById("message").appendChild(warning)
    }
  }

  /**
   * Camera settings.
   */
  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.set(0, 0, 250)
    this.camera.lookAt(0, 0, 0)
  }

  /**
   * Lights.
   */
  setLights() {
    const spotlight = new THREE.SpotLight(0xf5fc5a)
    spotlight.position.set(1.75, 4, -3)
    spotlight.castShadow = true
    spotlight.intensity = 0.2
    this.scene.add(spotlight)

    const ambient = new THREE.AmbientLight(0xed9913)
    this.scene.add(ambient)

    const light = new THREE.DirectionalLight(0xfdd8ff)
    light.position.set(30, 100, 40)

    light.castShadow = true

    light.shadow.mapSize.width = 1024
    light.shadow.mapSize.height = 1024

    this.scene.add(light)
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  /**
   * Animate function.
   */
  animate() {
    let dt = Math.min(this.clock.getDelta(), 0.1)
    // animation on active Token
    if (this.activePlayer.activeToken) {
      this.activePlayer.activeToken.rotateToken(dt)
    }

    this.renderer.render(this.scene, this.camera)
  }

  /**
   * Initializes game.
   */
  startGame() {
    this.init()
    this.environment.loadEnvironment(this)
    this.activePlayer.activeToken.drawToken(this)
    this.ready = true
  }
  /**
   * Branches code, depending on what key player presses
   * @param	{Object}	e - Keydown event object
   */
  handleKeydown(e) {
    if (this.ready) {
      if (e.key === "ArrowLeft") {
        this.activePlayer.activeToken.moveLeft()
      } else if (e.key === "ArrowRight") {
        this.activePlayer.activeToken.moveRight(this.board.columns)
      } else if (e.key === "ArrowDown") {
        this.playToken()
      }
    }
  }

  /**
   * Finds Space object to drop Token into, drops Token
   */
  playToken() {
    let spaces = this.board.spaces
    let activeToken = this.activePlayer.activeToken
    let targetColumn = spaces[activeToken.columnLocation]
    let targetSpace = null

    for (let space of targetColumn) {
      if (space.token === null) {
        targetSpace = space
      }
    }

    if (targetSpace !== null) {
      const game = this
      game.ready = false

      activeToken.drop(targetSpace, function () {
        game.updateGameState(activeToken, targetSpace)
      })
    }
  }

  /**
   * Checks if there a winner on the board after each token drop.
   * @param   {Object}    Targeted space for dropped token.
   * @return  {boolean}   Boolean value indicating whether the game has been won (true) or not (false)
   */
  checkForWin(target) {
    const owner = target.token.owner
    let win = false

    // vertical
    for (let x = 0; x < this.board.columns; x++) {
      for (let y = 0; y < this.board.rows - 3; y++) {
        if (
          this.board.spaces[x][y].owner === owner &&
          this.board.spaces[x][y + 1].owner === owner &&
          this.board.spaces[x][y + 2].owner === owner &&
          this.board.spaces[x][y + 3].owner === owner
        ) {
          win = true
        }
      }
    }

    // horizontal
    for (let x = 0; x < this.board.columns - 3; x++) {
      for (let y = 0; y < this.board.rows; y++) {
        if (
          this.board.spaces[x][y].owner === owner &&
          this.board.spaces[x + 1][y].owner === owner &&
          this.board.spaces[x + 2][y].owner === owner &&
          this.board.spaces[x + 3][y].owner === owner
        ) {
          win = true
        }
      }
    }

    // diagonal
    for (let x = 3; x < this.board.columns; x++) {
      for (let y = 0; y < this.board.rows - 3; y++) {
        if (
          this.board.spaces[x][y].owner === owner &&
          this.board.spaces[x - 1][y + 1].owner === owner &&
          this.board.spaces[x - 2][y + 2].owner === owner &&
          this.board.spaces[x - 3][y + 3].owner === owner
        ) {
          win = true
        }
      }
    }

    // diagonal
    for (let x = 3; x < this.board.columns; x++) {
      for (let y = 3; y < this.board.rows; y++) {
        if (
          this.board.spaces[x][y].owner === owner &&
          this.board.spaces[x - 1][y - 1].owner === owner &&
          this.board.spaces[x - 2][y - 2].owner === owner &&
          this.board.spaces[x - 3][y - 3].owner === owner
        ) {
          win = true
        }
      }
    }

    return win
  }
  /**
   * Switches active player.
   */
  switchPlayers() {
    for (let player of this.players) {
      player.active = player.active === true ? false : true
    }
  }

  /**
   * Displays game over message.
   * @param {string} message - Game over message.
   */
  gameOver(message) {
    const gameOver = document.getElementById("game-over")
    gameOver.style.display = "block"
    gameOver.textContent = message
  }

  /**
   * Update game after each token dropped.
   * @param   {Object}    Token token to be dropped.
   * @param   {Object}    Targeted space for dropped token.
   * @return {string} message - Game over message or switchPlayers() if no win
   */
  updateGameState(token, target) {
    target.mark(token)

    if (!this.checkForWin(target)) {
      this.switchPlayers()

      if (this.activePlayer.checkTokens()) {
        this.activePlayer.activeToken.drawToken(this)
        this.ready = true
      } else {
        this.gameOver("No more tokens")
      }
    } else {
      this.gameOver(`${target.owner.name} wins!`)
    }
  }
}
