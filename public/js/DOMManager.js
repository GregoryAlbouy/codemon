export default class DOMManager
{
    // GENERAL

    static getDatetime()
    {
        const
            datetime = new Date,
            weekday = formatDate(datetime.getDay()),
            h = formatTime(datetime.getHours()),
            m = formatTime(datetime.getMinutes())

        function formatDate(weekdayId)
        {
            const weekdayNameList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            return weekdayNameList[weekdayId]
        }

        function formatTime(int)
        {
            int = int < 10 ? '0' + int : int
            return int
        }
        
        return `${weekday}. ${h}:${m}`
    }

    // BATTLE-RELATED METHODS

    // Battle initialization after the desktop part
    static initiateBattle(player, ennemy, actionList)
    {
        const
            combatElement = document.querySelector('.combat'),
            combatInterface = combatElement.querySelector('.combat__interface'),
            interactionArea = combatInterface.querySelector('.interaction-area')

        function fadeIn()
        {
            const transitionDuration = 2000;

            combatElement.classList.add('transition')
            setTimeout(endTransition, transitionDuration)
            function endTransition()
            {
                combatElement.classList.add('on')
                combatElement.classList.remove('transition')
            }
        }

        // Activates the battle and generates the characters's information boxes
        function generateCombatInterface(player, ennemy)
        {
            const characterList = [ player, ennemy ]

            for (let i=0; i<characterList.length; i++)
            {
                // Change the variant class name depending on the current iteration
                let alt = i === 0 ? 'player' : 'ennemy'
    
                // Create element, set properties and append it
                const infobox = document.createElement('div')
                infobox.classList.add('character-infobox', `character-infobox--${alt}`)
                infobox.innerHTML =
                ` 
                    <h2 class="name-area">${characterList[i].name}
                        <span class="character-level">Lv${characterList[i].level}</span>
                    </h2>
                    <div class="hp-bar"><div class="hp-bar__progress"></div></div>
                    <p class="hp-area">
                        <span class="current-hp">${characterList[i].currentHp}</span>
                        <span class="max-hp">${characterList[i].maxHp}</span>
                    </p>
                `
                combatInterface.appendChild(infobox)
    
                // Add comment in the HTML
                infobox.insertAdjacentHTML('beforebegin', `<!-- ${alt} information box -->`)
            }
        }

        function generateActionMenu(actionList)
        {
            const actionMenu = document.createElement('ul')
    
            actionMenu.classList.add('action-menu')
    
            for (const action of actionList)
            {
                const
                    actionBtn = document.createElement('li'),
                    actionBtnContent = document.createElement('span')
    
                actionBtn.classList.add('action-btn')
                actionBtnContent.classList.add('action-btn-content')
                actionBtnContent.textContent = action.name
    
                actionBtn.appendChild(actionBtnContent)
                actionMenu.appendChild(actionBtn)
            }

            interactionArea.appendChild(actionMenu)
        }

        fadeIn()
        generateCombatInterface(player, ennemy)
        generateActionMenu(actionList)
    }

    // Generate action submenu depending on the current action
    static generateActionSubmenu(currentAction, itemList)
    {
        const
            interactionArea = document.querySelector('.interaction-area'),
            actionSubmenu = document.createElement('ul')

        actionSubmenu.classList.add('action-submenu')

        for (const item of itemList)
        {
            const
                itemElement = document.createElement('li'),
                itemName = document.createElement('span')
                // itemQty = document.createElement('span')

            itemElement.classList.add('submenu-item')
            itemName.classList.add('item-name')
            itemName.textContent = item.name
            // itemQty.textContent = `${item.currentQty}/${item.maxQty}`

            itemElement.appendChild(itemName)
            // itemElement.appendChild(itemQty)
            actionSubmenu.appendChild(itemElement)
        }

        document.querySelectorAll('.action-btn')[currentAction].classList.add('active')
        interactionArea.appendChild(actionSubmenu)
        setTimeout(() => actionSubmenu.classList.add('active'), 10)
    }

    // Shows current action / subaction by switching class
    static updateBtnClass(menuType, className, btnId)
    {
        let btnList = menuType === 'ActionMenu' ?
            document.querySelectorAll('.action-btn') :
            document.querySelectorAll('.submenu-item')

        for (const btn of btnList)
        {
            if (btn.classList.contains(className)) { btn.classList.remove(className) }
        }
        if (typeof btnId === 'number') { btnList[btnId].classList.add(className) }
    }

    static toggleSubmenu(isOn, currentAction)
    {
        const
            submenu = document.querySelector('.action-submenu'),
            actionBtnList = document.querySelectorAll('.action-btn')
            
        if (!isOn)
        {
            // Disable
            submenu.classList.remove('active')

            // Update action menu buttons state
            actionBtnList[currentAction].classList.remove('active')

            // Remove node
            setTimeout(() => 
            {
                submenu.parentNode.removeChild(submenu)
            }, 200)
            return
        }
    }
    
    // Resizes the HP bar while adapting its background color continuously, and updates dynamically the displayed amount via setInterval. Total animation duration is fixed to 2sec so the interval must be calculated upon the delta.
    static updateHp(character)
    {
        const
            hpBarElement = document.querySelector(`.character-infobox--${character.type} .hp-bar__progress`),
            hpValueElement = document.querySelector(`.character-infobox--${character.type} .current-hp`),
            scaleValue = character.currentHp / character.maxHp, // value for transform: scaleX()
            hslValue = scaleValue * 120, // value for background-color: hsl()
            lastHpValue = parseInt(hpValueElement.textContent),
            delta = character.currentHp - lastHpValue,
            animationDuration = 2000,
            refreshInterval = Math.abs(animationDuration / delta),
            refreshStep = setInterval(updateHpValue, refreshInterval)

        // Apply HP bar modifications
        hpBarElement.style.transform = `scaleX(${scaleValue})`
        hpBarElement.style.background = `hsl(${hslValue}, 50%, 40%)`

        // Dynamicly update the displayed value
        let stepValue = lastHpValue

        function updateHpValue()
        {
            // Check if stepValue has reached the current HP value: if so, stop refreshing and terminate the function
            if (stepValue === character.currentHp)
            {
                clearInterval(refreshStep)
                return
            }
            // Increment step value and display it
            incrementStepValue(stepValue)
            hpValueElement.textContent = stepValue
        }

        // Check the step direction (- or +) and increment its value accordingly
        function incrementStepValue()
        { 
            stepValue > character.currentHp ? stepValue-- : stepValue++
        }
    }

    // Updates dialog box with custom message in input
    static showDialog(message)
    {
        const dialogBox = document.querySelector('.dialog-area')
        dialogBox.textContent = message
    }

    // Contains all player animations : 
    static animatePlayerAction(actionType, actionId)
    {
        const animationContainer = document.querySelector('.missingno .animation--js-missingno')

        // Case of an Attack
        if (actionType === 0)
        {
            // if (actionId === 0) // "console.log()" attack
            // {
                animationContainer.style.animation = 'shakeX--big .01s alternate infinite linear'
                setTimeout(() => { animationContainer.style.animation = 'none' }, 1000)
            // }
        }

        // Case of an Object
        if (actionType === 1)
        {
            // Maybe later
        }
    }

    // Contains all ennemy animations
    static animateEnnemyAction(actionId)
    {
        if (actionId === 0)
        {
            // Later
        }
    }
}