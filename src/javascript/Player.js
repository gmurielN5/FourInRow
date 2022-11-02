import Token from "./Token.js"

export default class Player {
  constructor(name, id, model, active = false) {
    this.name = name
    this.id = id
    this.model = model
    this.active = active
    this.tokens = this.createTokens(21)
  }

  /**
   * Creates token objects for player
   * @param   {integer}   num - Number of token objects to be created
   * @return  {array}     tokens - an arary of new token objects
   */
  createTokens(num) {
    const tokens = []

    for (let i = 0; i < num; i++) {
      let token = new Token(i, this)
      tokens.push(token)
    }

    return tokens
  }

  /**
   * Gets all tokens that haven't been dropped.
   * @return {array}  Array of unused tokens.
   */
  get unusedTokens() {
    return this.tokens.filter((token) => !token.dropped)
  }

  /**
   * Gets the active token by returning the first token in the array of unused tokens.
   * @return {Object} First token object in the array of unused tokens.
   */
  get activeToken() {
    return this.unusedTokens[0]
  }

  checkTokens() {
    return this.unusedTokens.lenght == 0 ? false : true
  }
}
