import DOMManager from './DOMManager.js'

export default class ActionMenu
{
    constructor(battleManager, cursorPosition)
    {
        this.battleManager = battleManager
        this.cursorPosition = cursorPosition === undefined ? { x: 0, y: 0 } : cursorPosition

        this.currentBtn = this.getCurrentBtn()

        // Keeps track of event listener added with bind()
        this.listener = this.checkKey.bind(this)

        DOMManager.updateBtnClass('ActionMenu', 'current', this.currentBtn)
    }

    checkKey(event)
    {
        switch(event.keyCode) {
            case 37:                                    // left arrow
            case 65:                                    // letter A (qwerty)
            case 81:                                    // letter Q (azerty)
                    this.moveCursor({ x: -1, y: 0 })    // go LEFT
                break
            case 38:                                    // up arrow
            case 87:                                    // letter W (qwerty)
            case 90:                                    // letter Z (azerty)
                    this.moveCursor({ x: 0, y: -1 })    // go UP
                break
            case 39:                                    // right arrow
            case 68:                                    // letter D
                    this.moveCursor({ x: 1, y: 0 })     // go RIGHT
                break
            case 40:                                    // down arrow
            case 83:                                    // letter S
                    event.preventDefault()              // prevents unwanted scroll (down arrow)
                    this.moveCursor({ x: 0, y: 1 })     // go DOWN
                break
            case 13:                                    // enter
            case 32:                                    // spacebar
                    event.preventDefault()              // prevents unwanted scroll (spacebar)
                    DOMManager.updateBtnClass('ActionMenu', 'active', this.currentBtn)
                    this.requestAction(this.currentBtn)  // activate selected action
                break
            default: return
        }
    }

    moveCursor(direction)
    {
        const sum = { x: this.cursorPosition.x + direction.x, y: this.cursorPosition.y + direction.y }

        if (!this.checkDirection(sum))
        {
            // add soft error sound?
            return
        }
        this.cursorPosition = { x: sum.x, y: sum.y }
        this.currentBtn = this.getCurrentBtn()
        
        DOMManager.updateBtnClass('ActionMenu', 'current', this.currentBtn)
    }

    checkDirection(sum)
    {
        if (sum.x < 0 || sum.x > 1 || sum.y < 0 || sum.y > 1) return false
        return true
    }

    getCurrentBtn()
    {
        if ( this.cursorPosition.x === 0 && this.cursorPosition.y === 0 ) return 0
        else if ( this.cursorPosition.x === 0 && this.cursorPosition.y === 1 ) return 1
        else if ( this.cursorPosition.x === 1 && this.cursorPosition.y === 0 ) return 2
        else return 3
    }

    requestAction(currentBtn)
    {
        this.battleManager.launchAction(this, currentBtn)
    }
}