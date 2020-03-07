import DOMManager from './DOMManager.js'

export default class Character
{
    constructor(type, name, level, maxHp, data)
    {
        this.type = type
        this.name = name
        this.level = level
        this.maxHp = maxHp
        this.data = data

        this.currentHp = this.maxHp
        this.attackList = this.data.attackList
        this.attackFactor = 1
        this.defenseFactor = 1
        this.dodgeFactor = 1
    }

    get name()
    {
        return this._name
    }
    set name(value)
    {
        // In case the user hasn't entered their username for some reason
        this._name = value === undefined ? 'Mighty Dev' : value
    }

    get currentHp()
    {
        return this._currentHp
    }
    set currentHp(value)
    {
        // If the character takes damage, make sure it doesn't go below 0, else verify it doesn't exceed the max HP
        this._currentHp = value < this.currentHp ? Math.max(value, 0) : Math.min(value, this.maxHp)
    }

    get attackList()
    {
        return this._attackList
    }
    set attackList(value)
    {
        // Set the attack list depending of the type of character (player or ennemy)
        this._attackList = this.type === 'player' ? value : this.data.ennemyAttackList
    }

    // Used to determine ennemy's attack each turn
    randomAttack()
    {
        const randomId = Math.floor(this.attackList.length * Math.random())
        return this.attackList[randomId]
    }

    takeDamage(amount)
    {
        this.currentHp -= amount
        DOMManager.updateHp(this, amount)
    }
}
