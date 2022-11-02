import * as THREE from "three"

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"

class Token {
  constructor(index, owner) {
    this.owner = owner
    this.id = `token-${index}-${owner.id}`
    this.dropped = false
    this.columnLocation = 0
  }

  /**
   * Gets associated Token.
   * @return  {element}   model element associated with token object.
   */
  get modelToken() {
    const token = this
    if (token.mesh !== undefined) {
      if (token.mesh.userData.id === this.id) {
        return token
      }
    }
  }

  /**
   * Draws new model token.
   */
  drawToken(game) {
    // model
    const token = this
    const loader = new FBXLoader()

    const id = this.id

    loader.load(
      `${game.assetsPath}/token/${this.owner.model}.fbx`,
      function (object) {
        object.name = "token"
        object.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })

        token.mesh = new THREE.Object3D()
        token.mesh.userData.id = id
        token.mesh.userData.name = token.owner.model
        token.mesh.add(object.children[0])
        token.mesh.scale.set(0.5, 0.5, 0.5)
        token.mesh.position.set(-150, window.innerHeight / 6, 0)
        if (token.owner.model === "Donut") {
          token.mesh.rotation.set(1.25, 0, 0)
        }

        game.scene.add(token.mesh)
      },
      undefined,
      function (error) {
        console.error(error)
      }
    )
  }

  /**
   * Rotate active token.
   */

  rotateToken(dt) {
    if (this.modelToken !== undefined) {
      this.modelToken.mesh.rotation.y += (Math.PI / 2) * dt
    }
  }

  /**
   * Moves token one column to left.
   */
  moveLeft() {
    if (this.modelToken !== undefined) {
      if (this.columnLocation > 0) {
        this.modelToken.mesh.position.x -= 50
        this.columnLocation -= 1
      }
    }
  }

  /**
   * Moves token one column to right.
   * @param   {number}    columns - number of columns on the game board
   */
  moveRight(columns) {
    if (this.modelToken !== undefined) {
      if (this.columnLocation < columns - 1) {
        this.modelToken.mesh.position.x += 50
        this.columnLocation += 1
      }
    }
  }

  /**
   * Drops html token into targeted board space.
   * @param   {Object}    Targeted space for dropped token.
   * @param   {function}  The reset function to call after the drop animation has completed.
   */
  drop(target, reset) {
    this.dropped = true
    this.modelToken.mesh.position.y = -target.y * target.diameter + 100

    reset()
  }
}

export default Token
