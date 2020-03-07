export default class Data
{
    constructor() {

        this.actionList = 
        [
            {
                name: 'Attack',
                // action: ''
            },
            {
                name: 'Bag',
                // action: ''
            },
            {
                name: 'Settings',
                // action: ''
            },
            {
                name: 'Run',
                // action: ''
            }
        ]

        this.attackList = 
        [
            {
                id: 0,
                name: 'Refresh page repeatedly',
                target: 'opponent',
                sideEffect: null,
                power: 0,
                currentQty: 10,
                maxQty: 10,
                comment: 'It doesn\'t seem to affect the ennemy...'
            },
            {
                id: 1,
                name: 'console.log()',
                target: 'opponent',
                sideEffect: null,
                power: 20,
                currentQty: 10,
                maxQty: 10,
                comment: 'It doesn\'t seem to affect the ennemy...'
            },
            {
                id: 2,
                name: 'flamethrower',
                target: 'both',
                sideEffect: null,
                power: 60,
                currentQty: 10,
                maxQty: 10,
                comment: 'A flamethrower sounds a bit overkill for the situation but it seemed to work...'
            },
            {
                id: 3,
                name: '???',
                target: 'self',
                sideEffect: null,
                power: 100,
                currentQty: 10,
                maxQty: 10,
                comment: 'That\'s super effective!'
            }
        ]

        this.objectList = 
        [
            {
                id: 0,
                name: 'Fresh water',
                target: 'self',
                power: -50,
                sideEffect: null,
                currentQty: 1,
                maxQty: 1,
                comment: 'Your energy is restored!'
            },
            {
                id: 1,
                name: 'Stackoverflow',
                target: 'self',
                power: -100,
                sideEffect: null,
                currentQty: 1,
                maxQty: 1,
                comment: 'You feel stronger now. Your next move will be twice as powerful.'
            }
        ]

        this.ennemyAttackList =
        [
            {
                id: 0,
                name: 'Hide',
                power: 0,
                sideEffect: { type: 'attack', target: 'opponent', multiplier: 0 },
                currentQty: 10,
                maxQty: 10,
                comment: 'That makes him really hard to find. Your next move won\'t affect him.'
            },
            {
                id: 1,
                name: 'Replicate',
                power: 20,
                sideEffect: { type: 'defense', target: 'self', multiplier: 2 },
                currentQty: 10,
                maxQty: 10,
                comment: 'Oh no, there\'s two of them now! Desesperating...'
            },
            {
                id: 2,
                name: 'Dream Eater',
                power: 42,
                sideEffect: null,
                currentQty: 10,
                maxQty: 10,
                comment: 'Uh that hurts!'
            }
        ]

        this.runList =
        [
            {
                name: 'I changed my mind, I\'ll win this battle!'
            },
            {
                name: 'RUN.'
            }
        ]

        this.settingList =
        [
            {
                name: 'Oops, nothing here... for the moment!'
            }
        ]
    }
}