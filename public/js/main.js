import Data from './Data.js'
import Battle from './Battle.js'
import DOMManager from './DOMManager.js'

window.addEventListener('DOMContentLoaded', () =>
{
    const data = new Data
    let userName

    function launchBattle()
    {
        new Battle(data, userName)
    }

    // All functions and events related to the login page
    (function desktopEvents()
    {
        const
            desktop             = document.querySelector('.desktop'),
            desktopLogin        = desktop.querySelector('.desktop__login'),
            desktopMain         = desktop.querySelector('.desktop__main'),
            desktopAppContainer = desktop.querySelector('.desktop__app-container'),
            profilePicture      = desktopLogin.querySelector('.profile-picture'),
            usernameInput       = desktopLogin.querySelector('.username-input'),
            submitBtn           = desktopLogin.querySelector('.submit-btn'),
            menuBarAppName      = desktopMain.querySelector('.js-app-name'),
            fileList            = desktopMain.querySelectorAll('.file'),
            fileVSC             = desktopMain.querySelector('.file--vsc'),
            appVSC              = desktopAppContainer.querySelector('.app--vsc'),
            appBrowser          = desktopAppContainer.querySelector('.app--browser'),
            userCodeInput       = appVSC.querySelector('.code-input'),
            testCodeBtn         = appVSC.querySelector('.test-code-btn')

        // EVENT LISTENERS

        // Login events
        profilePicture.addEventListener('click', toggleLogin)
        usernameInput.addEventListener('input', toggleSubmitBtn)
        window.addEventListener('keydown', logUser)
        submitBtn.addEventListener('click', logUser)

        // Main desktop events
        window.addEventListener('click', selectItem, true)
        for (const file of fileList)
        {
            const fileName = file.querySelector('.name')

            file.addEventListener('click', (event) => event.currentTarget.classList.add('selected'))

            fileName.addEventListener('click', makeEditable)
        }

        // App events
        fileVSC.addEventListener('dblclick', openVSC)
        userCodeInput.addEventListener('input', revealTestCodeBtn)
        testCodeBtn.addEventListener('click', highwayToHell)

        // EVENT FUNCTIONS

        // Activate/deactivate input mode
        function toggleLogin()
        {
            desktopLogin.classList.toggle('on')
            // Reset on turn off
            if (!desktopLogin.classList.contains('on'))
            {
                usernameInput.value = ''
                submitBtn.classList.remove('on')
                return
            }
            // Auto focus
            usernameInput.focus()
        }

        // Show/hide submit button depending on input's content
        function toggleSubmitBtn()
        {
            if (!submitBtn.classList.contains('on')) { submitBtn.classList.add('on') }
            if (submitBtn.classList.contains('on') && usernameInput.value.length < 1) { submitBtn.classList.remove('on') }
        }

        // Logs the user after validating the username
        function logUser(event)
        {
            // In the case of a key event, only continue on Enter press
            if  (event.type === 'keydown'
            &&  (event.keyCode !== 13 || document.activeElement !== usernameInput))
            {
                return
            }

            // Prevents page reload on click or pressing Enter
            event.preventDefault()

            // Check input value (1-20 characters)
            if (usernameInput.value.length <= 0 || usernameInput.value.length > 20)
            {
                // Didn't pass the check? Let's shake instead!
                usernameInput.classList.add('animation', 'animation--shakeX')
                setTimeout(() => usernameInput.classList.remove('animation', 'animation--shakeX'), 500)
                return
            }

            // Store the username value and go to the main desktop
            userName = usernameInput.value === undefined ? 'Mighty Dev' : usernameInput.value
            desktopLogin.classList.add('fade-out')
            setTimeout(() =>
            {
                desktopLogin.classList.add('hidden')
                desktopMain.classList.add('on')
                document.querySelector('.username').textContent = userName
                document.querySelector('.app--vsc .breadcrumb-item--js-username').textContent = userName
            }, 1100)
        }

        // MAIN DESKTOP FUNCTIONS

        function selectItem(event)
        {
            const selectedFile = document.querySelector('.selected')
            if (event.target !== selectedFile)
            {
                for (const file of fileList)
                {
                    file.classList.remove('selected')
                }
            }
        }

        // Some useless feature
        function makeEditable()
        {
            event.stopPropagation()
            event.target.setAttribute('contentEditable', 'true')
        }

        function openVSC()
        {
            desktopAppContainer.classList.add('open')
            setTimeout(() => appVSC.classList.add('open'), 100)
            updateCurrentAppDisplay('Code')
        }

        // Display app name in the top menu bar
        function updateCurrentAppDisplay(value)
        {
            menuBarAppName.textContent = value
        }

        // Reveal the test-code button progressively as the user writes code
        function revealTestCodeBtn()
        {
            const
                maxLength = 30,
                opacityValue = Math.min(userCodeInput.value.length, maxLength)

            testCodeBtn.style.opacity = opacityValue / maxLength
        }

        // Final animations before battle begins
        function highwayToHell()
        {
            desktopAppContainer.classList.add('switched')
            setTimeout(() => updateCurrentAppDisplay('Netscape Navigator'), 1000)
            setTimeout(() => appBrowser.classList.remove('loading'), 2000)

            setTimeout(showErrors, 5000)
            // setTimeout(() => document.querySelector('.battle-music').play(), 5000)
            setTimeout(() => desktop.classList.add('transition'), 8000)
            setTimeout(() => 
            {
                desktop.classList.add('removed')
                launchBattle()
            }, 10000)

            function showErrors()
            {
                appBrowser.classList.add('error')
                const errorSound = document.querySelector('.error-sound')
                errorSound.play()
            }
        }
    })()

    // DATE
    const dateElement = document.querySelector('.datetime')
    setInterval(() => dateElement.textContent = DOMManager.getDatetime(), 1000)

    // Shortcut to battle
    function koko()
    {
        let
            koko = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
            sequence = []
    
        window.addEventListener('keydown', updateSequence)

        function updateSequence(event)
        {
            if (sequence.length === 10) sequence.shift()
            sequence.push(event.keyCode)
            if (checkSequence()) launchBattle()
        }
    
        function checkSequence()
        {
            if (koko.length !== sequence.length) return false
    
            for (let i=0; i<koko.length; i++) { if (koko[i] !== sequence[i]) return false }

            return true
        }
    }
    koko()

    // test 3D drag
    const rotateBox = document.querySelector('.animation--js-room')
    window.addEventListener('mousedown', startDrag)
    window.addEventListener('mouseup', stopDrag)
    let startPos

    function startDrag(event)
    {
        setStartPos({ x: event.clientX, y: event.clientY })
        window.addEventListener('mousemove', listenMousemove)
    }

    function stopDrag()
    {
        window.removeEventListener('mousemove', listenMousemove)
        resetPov()
    }

    function resetPov()
    {
        rotateBox.setAttribute('style', 'transition: transform 1s')
        setTimeout(() => rotateBox.removeAttribute('style'), 1000)
    }  

    function setStartPos(coords) { startPos = coords }

    function listenMousemove(event)
    {
        let
            throttle = false,
            offsetX = event.clientX - startPos.x,
            offsetY = event.clientY - startPos.y

        if (!throttle)
        {
            refreshRoomPov(offsetX, offsetY)
            throttle = true
            setTimeout(() => throttle = false, 100)
        }
    }

    function refreshRoomPov(x, y) { rotateBox.style.transform = `rotateX(${-y}deg) rotateY(${x}deg)` }
})