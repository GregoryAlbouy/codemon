// import Data from './Data.js'
import DOMManager from './DOMManager.js'
import Character from './Character.js'
import ActionMenu from './ActionMenu.js'
import ActionSubmenu from "./ActionSubmenu.js"

export default class Battle
{
    constructor(data, playerName)
    {
        this.data = data
        this.player = new Character('player', playerName, 42, 200, this.data)
        this.ennemy = new Character('ennemy', 'Wild bug', '??', 200, this.data)
        DOMManager.initiateBattle(this.player, this.ennemy, this.data.actionList)
        this.actionMenu = this.getActionMenu()
        this.actionSubmenu

        this.listenKeys(this.actionMenu, true)
    }

    getActionMenu()
    {
        return new ActionMenu(this, { x:0, y:0 })
    }

    getActionSubmenu(actionId)
    {
        return new ActionSubmenu(this, actionId, this.player.data)
    }

    listenKeys(menuInstance, isOn)
    {
        if (!isOn)
        {
            document.removeEventListener('keydown', menuInstance.listener, false)
            return
        }
        document.addEventListener('keydown', menuInstance.listener, false)
    }

    launchAction(menuInstance, actionId)
    {
        if (menuInstance === this.actionMenu)
        {
            this.listenKeys(menuInstance, false)
            this.actionSubmenu = this.getActionSubmenu(actionId)
            this.listenKeys(this.actionSubmenu, true)
        }

        if (menuInstance === this.actionSubmenu)
        {
            this.disableMenu(this.actionSubmenu)
            // Start new turn in the case of an attack or use of an object
            if (this.actionSubmenu.currentAction === 0 || this.actionSubmenu.currentAction === 1)
            {
                this.newTurn(this.actionSubmenu.currentAction, this.actionSubmenu.cursorPosition)
            }
            // Case of a run attempt
            if (this.actionSubmenu.currentAction === 3 && this.actionSubmenu.cursorPosition === 1)
            {
                DOMManager.showDialog('...Turns out you can\'t run from a Wild Bug battle!')
                setTimeout(() => DOMManager.showDialog('What should I do now?'), 3000)
            }
        }
    }

    disableMenu(menuInstance)
    {
        this.listenKeys(menuInstance, false)

        if (menuInstance === this.actionMenu)
        {
            DOMManager.updateBtnClass('ActionMenu', 'current', null)
        }
        if (menuInstance === this.actionSubmenu)
        {
            DOMManager.toggleSubmenu(false, menuInstance.currentAction)
            this.listenKeys(this.actionMenu, true)
        }
    }

    // Whole process of a new turn
    newTurn(actionType, actionId)
    {
        const timeUnit = 1500
        const ennemyAttack = this.ennemy.randomAttack()

        const getPlayerDialog = (actionType) =>
        {
            let dialog = actionType === 0 ?
                `${this.player.name} uses ${this.data.attackList[actionId].name}!` :
                `${this.player.name} uses ${this.data.objectList[actionId].name}!`
            return dialog
        }

        // Determinate whether the player will inflict damage to the ennemy (attack) or heal himself (object)
        const getPlayerAction = (actionType) =>
        {
            actionType === 0 ?
                this.ennemy.takeDamage(this.data.attackList[actionId].power) :
                this.player.takeDamage(this.data.objectList[actionId].power)
        }

        const getPlayerComment = (actionType) =>
        {
            let comment = actionType === 0 ?
                this.data.attackList[actionId].comment :
                this.data.objectList[actionId].comment
            return comment
        }

        const isBattleEnded = () =>
        {
            if (this.ennemy.currentHp > 0 && this.player.currentHp > 0) { return false }
            else
            {
                if (this.ennemy.currentHp <= 0) { this.endBattle('victory') }
                if (this.player.currentHp <= 0) { this.endBattle('defeat') }
                return true
            }
        }

        // Doesn't work as expected... The goal was to store in an array the action stack and use a for loop to increment the timeout value each iteration.
        // let stepList =
        // [
        //     DOMManager.showDialog(`${this.player.name} uses ${this.data.attackList[actionId].name}!`),
        //     DOMManager.animatePlayerAction(actionType, actionId),
        //     DOMManager.showDialog(this.data.attackList[actionId].comment),
        //     DOMManager.showDialog(`${this.ennemy.name} uses ${ennemyAttack.name}!`),
        //     DOMManager.animateEnnemyAction(ennemyAttack.id),
        //     DOMManager.showDialog(ennemyAttack.comment),
        //     DOMManager.showDialog('What should I do now?')
        // ]

        // for (let i=0; i<stepList.length; i++)
        // {
        //     setTimeout(() => stepList[i], i * timeUnit)
        // }

        // Let's do this manually until I find a better option
        this.disableMenu(this.actionMenu)
        setTimeout(() => DOMManager.showDialog(getPlayerDialog(actionType)), 0 * timeUnit)
        setTimeout(() => DOMManager.animatePlayerAction(actionType, actionId), 1 * timeUnit)
        setTimeout(() => getPlayerAction(actionType), 2 * timeUnit)
        setTimeout(() => DOMManager.showDialog(getPlayerComment(actionType)), 3 * timeUnit)
        setTimeout(() => 
        {
            if (isBattleEnded()) return
            if (!isBattleEnded()) { DOMManager.showDialog(`${this.ennemy.name} uses ${ennemyAttack.name}!`) }
        }, 4 * timeUnit)
        setTimeout(() => DOMManager.animateEnnemyAction(ennemyAttack.id), 5 * timeUnit)
        setTimeout(() => this.player.takeDamage(ennemyAttack.power), 6 * timeUnit)
        setTimeout(() => DOMManager.showDialog(ennemyAttack.comment), 7 * timeUnit)
        setTimeout(() => 
        {
            if (isBattleEnded()) return
            DOMManager.showDialog('What should I do now?')
            this.actionMenu = this.getActionMenu()
            this.listenKeys(this.actionMenu, true)
        }, 8 * timeUnit)

    }

    endBattle(status)
    {
        let message = status === 'victory' ?
            `Congratulation ${this.player.name}, you defeated the Wild Bug! You can now continue your project.` :
            `Too bad you lost... Let's hope Wild bug doesn't evolve into a Wild Feature!`

        DOMManager.showDialog(message)
        // setTimeout(() => {}, 6000) // retransition
        setTimeout(() => document.location.reload(), 8000)
    }
}
