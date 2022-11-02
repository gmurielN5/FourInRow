import * as THREE from "three"
class Space {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.id = `space-${x}-${y}`
    this.token = null
    this.diameter = 50
    this.radius = this.diameter / 2
  }

  mark(token) {
    this.token = token
  }

  /**
   * Checks if space has an associated token to find its owner
   * @return  {(null|Object)} Returns null or the owner object of the space's associated token.
   */
  /**
   * Checks if space has an associated token to find its owner
   * @return  {(null|Object)} Returns null or the owner object of the space's associated token.
   */
  get owner() {
    if (this.token === null) {
      return null
    } else {
      return this.token.owner
    }
  }
}

export default Space
