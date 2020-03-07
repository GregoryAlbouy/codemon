import DOMManager from './DOMManager.js'

export default class ActionSubmenu
{
    constructor(battleManager, currentAction, data)
    {
        this.battleManager = battleManager
        this.currentAction = currentAction
        this.data = data

        this.cursorPosition = 0
        this.itemList = this.getItemList(currentAction)
        this.listener = this.checkKey.bind(this)
        
        this.displayContent(currentAction)
        DOMManager.updateBtnClass('ActionSubmenu', 'current', this.cursorPosition)
    }

    displayContent(currentAction)
    {
        const itemList = this.getItemList(currentAction)
        DOMManager.generateActionSubmenu(currentAction, itemList)
    }

    getItemList(currentAction) {
        switch(currentAction)
        {
            case 0: return this.data.attackList
            case 1: return this.data.objectList
            case 2: return this.data.settingList
            case 3: return this.data.runList
        }
    }

    checkKey(event)
    {
        switch(event.keyCode) {
            case 38:                            // up arrow
            case 87:                            // letter W (qwerty)
            case 90:                            // letter Q (azerty)
                this.moveCursor(-1)
                break
            case 40:                            // down arrow
            case 83:                            // letter S
                this.moveCursor(+1)
                break
            case 13:                            // enter
            case 32:                            // spacebar
            case 65:                            // letter A
                    event.preventDefault()      // prevents unwanted scroll
                    this.requestAction()
                break
            case 8:                             // backspace
            case 27:                            // escape
            case 66:                            // letter B
                this.close()
            default: return
        }
    }

    moveCursor(direction)
    {
        if (!this.checkDirection(this.cursorPosition, direction))
        {
            // play a soft sound error?
            return
        }
        this.cursorPosition += direction
        DOMManager.updateBtnClass('ActionSubmenu', 'current', this.cursorPosition)
    }

    checkDirection(cursorPosition, direction)
    {
        if (cursorPosition + direction < 0 ||
            cursorPosition + direction >= this.itemList.length)
        {
            return false
        }
        return true
    }

    close()
    {
        this.battleManager.disableMenu(this)
    }

    requestAction()
    {
        this.battleManager.launchAction(this)
    }
}