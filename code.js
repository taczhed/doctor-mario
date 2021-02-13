//global
"use strict";
let level = 4
let gameBoard = []
let scoreBoard = []
let pairsBoard = []
let throwArray = []
let firstColor
let secoundColor
let falling
let activeRow = 0
let activeCell = 0
let state = "horizontal"
let fastFalling
let pillNumber = 0
let lastKey
let waiting = false
let keysActive = true
let hittingTime = false
let pressInterval
let stillPressing
let checkAfterInterval

const elements = {

    menu: function () {

        elements.startGame()
    },

    startGame: function () {

        let game = document.querySelector("#game")
        game.style.display = "block"
        game.style.backgroundImage = "url('img/pf.png')"

        elements.createArray()
        elements.createGameStateArray()
        elements.spawnCoronaVirus()
        elements.getRandomPill()
        elements.pillInterval()
        elements.movePill()
    },

    createThrowArray: function () {

        function pillThrow() {

            throwArray = []

            for (let y = 0; y < 8; y++) {

                let row = []
                throwArray.push(row)

                for (let x = 0; x < 12; x++) {
                    row.push(0)
                }
            }

            throwArray[3][9] = [firstColor, "left"]
            throwArray[3][10] = [secoundColor, "right"]

            // console.log(throwArray)
        }
        pillThrow()

    },

    animations: function () {

        function renderAnimation() {
            let animation = document.getElementById("animation")
            animation.innerHTML = ""
            for (let y = 0; y < 7; y++) {

                let tr = document.createElement("tr")
                animation.appendChild(tr)

                for (let x = 0; x < 11; x++) {
                    let td = document.createElement("td")
                    tr.appendChild(td)

                    if (throwArray[y][x][0] == 1) {
                        td.style.backgroundImage = "url('img/1/1_dot.png')"
                    } else if (throwArray[y][x][0] == 2) {
                        td.style.backgroundImage = "url('img/2/2_dot.png')"
                    } else if (throwArray[y][x][0] == 3) {
                        td.style.backgroundImage = "url('img/3/3_dot.png')"
                    }
                }
            }
        }
        renderAnimation()
    },

    createArray: function () {

        function createPillArray() {

            gameBoard = []

            for (let y = 0; y < 16; y++) {
                let row = []
                gameBoard.push(row)

                for (let x = 0; x < 8; x++) {
                    row.push(0)
                }
            }
            // console.log(gameBoard)
        }

        createPillArray()
    },

    createGameStateArray: function () {

        function createArray(name) {

            for (let y = 0; y < 16; y++) {
                let row = []

                name.push(row)

                for (let x = 0; x < 8; x++) {
                    row.push(0)
                }
            }

            if (name == scoreBoard) {
                let row = []
                name.push(row)

                for (let x = 0; x < 8; x++) {
                    row.push(9)
                }
            }

            // console.log(name)
        }

        createArray(scoreBoard)
        createArray(pairsBoard)
    },

    renderGameboard: function () {

        let board = document.getElementById("board")
        board.innerHTML = ""
        for (let y = 0; y < 16; y++) {

            let tr = document.createElement("tr")
            tr.classList.add("row")
            tr.setAttribute("row", y)
            board.appendChild(tr)

            for (let x = 0; x < 8; x++) {
                let td = document.createElement("td")
                td.classList.add("item")
                td.setAttribute("item", x)
                tr.appendChild(td)

                function renderPill() {
                    let sibling
                    if (y != 0) {
                        if (gameBoard[y - 1][x] != 0) {
                            sibling = "down"
                        }
                    }
                    if (y != 15) {
                        if (gameBoard[y + 1][x] != 0) {
                            sibling = "up"
                        }
                    }
                    if (gameBoard[y][x + 1] == 1 || gameBoard[y][x + 1] == 2 || gameBoard[y][x + 1] == 3) {
                        sibling = "left"
                    } else if (gameBoard[y][x - 1] == 1 || gameBoard[y][x - 1] == 2 || gameBoard[y][x - 1] == 3) {
                        sibling = "right"
                    }
                    if (gameBoard[y][x] == 1 || gameBoard[y][x] == 2 || gameBoard[y][x] == 3) {
                        td.style.backgroundImage = "url('img/" + gameBoard[y][x] + "/" + gameBoard[y][x] + "_" + sibling + ".png')"
                    }
                }

                function renderPillBoard() {
                    let sibling
                    let canBeDot = true
                    if (y != 0) {
                        if (pairsBoard[y - 1][x] == pairsBoard[y][x]) {
                            sibling = "down"
                            canBeDot = false
                        }
                    }
                    if (y != 15) {
                        if (pairsBoard[y + 1][x] == pairsBoard[y][x]) {
                            sibling = "up"
                            canBeDot = false
                        }
                    }
                    if (pairsBoard[y][x + 1] == pairsBoard[y][x]) {
                        sibling = "left"
                        canBeDot = false
                    } else if (pairsBoard[y][x - 1] == pairsBoard[y][x]) {
                        sibling = "right"
                        canBeDot = false
                    }
                    if (canBeDot == true) {
                        sibling = "dot"
                    }
                    if (scoreBoard[y][x] == 1 || scoreBoard[y][x] == 2 || scoreBoard[y][x] == 3) {
                        td.style.backgroundImage = "url('img/" + scoreBoard[y][x] + "/" + scoreBoard[y][x] + "_" + sibling + ".png')"
                    }
                }

                function renderVirus() {
                    if (scoreBoard[y][x] == 1 && pairsBoard[y][x] == 0) {
                        td.style.backgroundImage = "url('img/" + 1 + "/covid_brown.png')"
                    } else if (scoreBoard[y][x] == 2 && pairsBoard[y][x] == 0) {
                        td.style.backgroundImage = "url('img/" + 2 + "/covid_blue.png')"
                    } else if (scoreBoard[y][x] == 3 && pairsBoard[y][x] == 0) {
                        td.style.backgroundImage = "url('img/" + 3 + "/covid_yellow.png')"
                    }
                }

                function renderHit() {
                    if (pairsBoard[y][x] != 0 && scoreBoard[y][x] == 4) {
                        td.style.backgroundImage = "url('img/1/1_o.png')"

                    } else if (pairsBoard[y][x] != 0 && scoreBoard[y][x] == 5) {
                        td.style.backgroundImage = "url('img/2/2_o.png')"

                    } else if (pairsBoard[y][x] != 0 && scoreBoard[y][x] == 6) {
                        td.style.backgroundImage = "url('img/3/3_o.png')"

                    } else if (pairsBoard[y][x] == 0 && scoreBoard[y][x] == 4) {
                        td.style.backgroundImage = "url('img/1/1_x.png')"

                    } else if (pairsBoard[y][x] == 0 && scoreBoard[y][x] == 5) {
                        td.style.backgroundImage = "url('img/2/2_x.png')"

                    } else if (pairsBoard[y][x] == 0 && scoreBoard[y][x] == 6) {
                        td.style.backgroundImage = "url('img/3/3_x.png')"

                    }
                }
                renderPill()
                renderPillBoard()
                renderVirus()
                renderHit()
            }
        }


        //sprawdzenie activeCell
        for (let i = 0; i < 8; i++) {

            if (gameBoard[activeRow][i] != 0) {
                activeCell = i
                break
            }
        }
    },

    getRandomPill: function () {

        if (scoreBoard[0][3] != 0 || scoreBoard[0][4] != 0) {
            let gameInfo = document.querySelector("#game-info")
            gameInfo.style.display = "block"
            gameInfo.style.backgroundImage = "url('img/go.png')"
            clearInterval(falling)

        } else {

            firstColor = Math.floor(Math.random() * 3) + 1
            secoundColor = Math.floor(Math.random() * 3) + 1

            elements.createThrowArray()
            elements.animations()

            gameBoard[0][3] = firstColor
            gameBoard[0][4] = secoundColor

            pillNumber++
            // console.log("Tabletka nr: " + pillNumber)

            elements.renderGameboard()
        }
    },

    pillInterval: function () {

        elements.gameMechanic()

        falling = setInterval(() => {

            stillPressing = true
            keysActive = true

            let last = gameBoard.pop()
            gameBoard.unshift(last)

            elements.renderGameboard()

            checkAfterInterval = setTimeout(() => {
                elements.gameMechanic()
                stillPressing = false
                keysActive = false
            }, 475);

            activeRow++

            // console.log("rząd: " + activeRow + ", item: " + activeCell)
        }, 500);
    },

    spawnCoronaVirus: function () {

        let viruses = []
        let pos = []
        let count = 3

        for (let v = 0; v < count; v++) {
            let virus = Math.floor(Math.random() * 3) + 1

            if (viruses.includes(virus)) {
                count++
            } else {
                viruses.push(virus)
            }
        }

        for (let v = 0; v < level - 3; v++) {
            let lastVirus = viruses[v]
            viruses.push(lastVirus)
        }
        count = viruses.length
        for (let v = 0; v < count; v++) {

            let y = Math.floor(Math.random() * (15 - 5 + 1) + 5)
            let x = Math.floor(Math.random() * (7 - 0 + 1) + 0)
            if (pos.includes(x + "_" + y)) {
                v -= 1
            } else {
                pos.push(x + "_" + y)
                scoreBoard[y][x] = viruses[v]
            }
        }
    },


    movePill: function () {

        addEventListener("keydown", checkKey)
        addEventListener("keyup", backKey)

        function backKey(e) {
            if (e.keyCode == lastKey) {
                addEventListener("keydown", checkKey)
                // console.log("puszczono: " + e.keyCode)
                clearInterval(pressInterval)
            }
        }

        function checkKey(e) {

            if (keysActive == true) {

                // console.log("wcisnieto: " + e.keyCode)
                removeEventListener("keydown", checkKey)
                lastKey = e.keyCode

                pressInterval = setInterval(function () {
                    if (stillPressing == true) {
                        press()
                    }
                }, 200)

                press()

                function press() {

                    if (e.keyCode == '38' || e.keyCode == '87') {
                        //góra

                        if (activeRow != 0) {

                            if (scoreBoard[activeRow - 1][activeCell] != 0 && state == "horizontal" || scoreBoard[activeRow][activeCell + 1] != 0 && state == "vertical") {

                                if (gameBoard[activeRow][7] != 0 && gameBoard[activeRow - 1][7] != 0 && state == "vertical" && scoreBoard[activeRow][6] == 0) {

                                    gameBoard[activeRow][activeCell - 1] = gameBoard[activeRow - 1][activeCell]
                                    gameBoard[activeRow - 1][activeCell] = 0
                                    state = "horizontal"
                                }

                            } else if (state == "horizontal") {

                                gameBoard[activeRow - 1][activeCell] = gameBoard[activeRow][activeCell + 1]
                                gameBoard[activeRow][activeCell + 1] = 0
                                state = "vertical"

                            } else {

                                gameBoard[activeRow][activeCell + 1] = gameBoard[activeRow][activeCell]
                                gameBoard[activeRow][activeCell] = gameBoard[activeRow - 1][activeCell]
                                gameBoard[activeRow - 1][activeCell] = 0
                                state = "horizontal"
                            }
                            // console.log(state)

                        }
                    }
                    else if (e.keyCode == '16') {
                        // shift
                        if (activeRow != 0) {

                            if (scoreBoard[activeRow - 1][activeCell] != 0 && state == "horizontal" || scoreBoard[activeRow][activeCell + 1] != 0 && state == "vertical") {

                                if (gameBoard[activeRow][7] != 0 && gameBoard[activeRow - 1][7] != 0 && state == "vertical" && scoreBoard[activeRow][6] == 0) {

                                    gameBoard[activeRow][activeCell - 1] = gameBoard[activeRow][activeCell]
                                    gameBoard[activeRow][activeCell] = gameBoard[activeRow - 1][activeCell]
                                    gameBoard[activeRow - 1][activeCell] = 0
                                    state = "horizontal"
                                }

                            } else if (state == "horizontal") {

                                gameBoard[activeRow - 1][activeCell] = gameBoard[activeRow][activeCell]
                                gameBoard[activeRow][activeCell] = gameBoard[activeRow][activeCell + 1]
                                gameBoard[activeRow][activeCell + 1] = 0
                                state = "vertical"

                            } else {

                                gameBoard[activeRow][activeCell + 1] = gameBoard[activeRow - 1][activeCell]
                                gameBoard[activeRow - 1][activeCell] = 0
                                state = "horizontal"
                            }
                        }
                    }
                    else if (e.keyCode == '40' || e.keyCode == '83') {
                        //dół

                        if (scoreBoard[activeRow + 1][activeCell] == 0 && scoreBoard[activeRow + 1][activeCell + 1] == 0 && state == "horizontal" || scoreBoard[activeRow + 1][activeCell] == 0 && state == "vertical") {
                            clearInterval(falling)
                            clearInterval(pressInterval)
                            clearTimeout(checkAfterInterval)
                            keysActive = false

                            fastFalling = setInterval(() => {

                                let last = gameBoard.pop()
                                gameBoard.unshift(last)

                                elements.renderGameboard()
                                activeRow++
                                elements.gameMechanic()

                            }, 20);
                        }
                    }
                    else if (e.keyCode == '37' || e.keyCode == '65') {
                        //lewo


                        if (gameBoard[activeRow][0] != 0 || scoreBoard[activeRow][activeCell - 1] != 0 && state == "horizontal") {
                        } else if (state == "vertical" && scoreBoard[activeRow][activeCell - 1] != 0 || state == "vertical" && scoreBoard[activeRow - 1][activeCell - 1] != 0) {

                        } else {

                            for (let y = 0; y < 16; y++) {
                                let firstColumn = gameBoard[y].shift()
                                gameBoard[y].push(firstColumn)
                            }
                        }

                    }
                    else if (e.keyCode == '39' || e.keyCode == '68') {
                        //prawo

                        if (gameBoard[activeRow][7] != 0 || scoreBoard[activeRow][activeCell + 2] != 0 && state == "horizontal") {
                        } else if (state == "vertical" && scoreBoard[activeRow][activeCell + 1] != 0 || state == "vertical" && scoreBoard[activeRow - 1][activeCell + 1] != 0) {

                        } else {

                            for (let y = 0; y < 16; y++) {
                                let lastColumn = gameBoard[y].pop()
                                gameBoard[y].unshift(lastColumn)
                            }
                        }
                    }
                    elements.renderGameboard()
                }
            }
        }
    },

    gameMechanic: function () {

        function fallingValidation() {

            if (scoreBoard[activeRow + 1][activeCell] != 0 || scoreBoard[activeRow + 1][activeCell + 1] != 0 && state == "horizontal") {

                function saveData() {

                    for (let y = 0; y < 16; y++) {
                        for (let x = 0; x < 8; x++) {

                            if (gameBoard[y][x] != 0) {
                                scoreBoard[y][x] = gameBoard[y][x]
                                pairsBoard[y][x] = pillNumber
                            }
                        }
                    }

                    let grav = setInterval(() => {

                        hitValidation(1)
                        hitValidation(2)
                        hitValidation(3)
                        gravity()
                        elements.renderGameboard()

                    }, 50);

                    //resetowanie

                    clearInterval(falling)
                    keysActive = false
                    activeRow = 0
                    activeCell = 0
                    state = "horizontal"
                    clearInterval(fastFalling)
                    gameBoard = []
                    elements.createArray()

                    elements.getRandomPill() //Ważne
                    clearInterval(pressInterval) //!!!!

                    setTimeout(() => {
                        clearInterval(grav)
                        elements.pillInterval()
                        keysActive = true

                    }, 2000);
                }
                saveData()
            }
        }

        function hitValidation(number) {

            let posiitonsToDelete = []

            for (let y = 0; y < 16; y++) {
                for (let x = 0; x < 8; x++) {

                    if (scoreBoard[y][x] == number && scoreBoard[y][x + 1] == number && scoreBoard[y][x + 2] == number && scoreBoard[y][x + 3] == number) {

                        let count = 1
                        for (let i = 0; i < count; i++) {
                            if (scoreBoard[y][x + i] == number) {
                                posiitonsToDelete.push([y, x + i])
                                count++
                            }
                        }
                    }

                    if (scoreBoard[y][x] == number && scoreBoard[y + 1][x] == number && scoreBoard[y + 2][x] == number && scoreBoard[y + 3][x] == number) {

                        let count = 1
                        for (let i = 0; i < count; i++) {
                            if (scoreBoard[y + i][x] == number) {
                                posiitonsToDelete.push([y + i, x])
                                count++
                            }
                        }
                    }
                }
            }

            for (let i = 0; i < posiitonsToDelete.length; i++) {
                let y = posiitonsToDelete[i][0]
                let x = posiitonsToDelete[i][1]

                if (scoreBoard[y][x] == 1) {
                    scoreBoard[y][x] = 4
                } else if (scoreBoard[y][x] == 2) {
                    scoreBoard[y][x] = 5
                } else if (scoreBoard[y][x] == 3) {
                    scoreBoard[y][x] = 6
                }

                elements.renderGameboard()
                // console.log(scoreBoard)

                setTimeout(() => {
                    scoreBoard[y][x] = 0
                    pairsBoard[y][x] = 0
                    elements.renderGameboard()

                }, 200);
            }
        }

        function gravity() {

            for (let y = 15; y >= 0; y--) {
                for (let x = 7; x >= 0; x--) {

                    if (scoreBoard[y][x] != 0 && pairsBoard[y][x] != 0) {
                        //wykluczyć wirusy!

                        if (pairsBoard[y][x] == pairsBoard[y][x + 1] && scoreBoard[y + 1][x] == 0 && scoreBoard[y + 1][x + 1] == 0) {
                            //zrzucaj pare w dół

                            pairsBoard[y + 1][x] = pairsBoard[y][x]
                            pairsBoard[y][x] = 0

                            pairsBoard[y + 1][x + 1] = pairsBoard[y][x + 1]
                            pairsBoard[y][x + 1] = 0

                            scoreBoard[y + 1][x] = scoreBoard[y][x]
                            scoreBoard[y][x] = 0

                            scoreBoard[y + 1][x + 1] = scoreBoard[y][x + 1]
                            scoreBoard[y][x + 1] = 0

                        } else if (pairsBoard[y][x] == pairsBoard[y][x - 1] && scoreBoard[y + 1][x] == 0 && scoreBoard[y + 1][x - 1] == 0) {
                            //zrzucaj pare w dół

                            pairsBoard[y + 1][x] = pairsBoard[y][x]
                            pairsBoard[y][x] = 0

                            pairsBoard[y + 1][x - 1] = pairsBoard[y][x - 1]
                            pairsBoard[y][x - 1] = 0

                            scoreBoard[y + 1][x] = scoreBoard[y][x]
                            scoreBoard[y][x] = 0

                            scoreBoard[y + 1][x - 1] = scoreBoard[y][x - 1]
                            scoreBoard[y][x - 1] = 0

                        } else if (pairsBoard[y][x - 1] != pairsBoard[y][x] && pairsBoard[y][x + 1] != pairsBoard[y][x] && scoreBoard[y + 1][x] == 0) { //?
                            //zrzucaj w dół

                            pairsBoard[y + 1][x] = pairsBoard[y][x]
                            pairsBoard[y][x] = 0

                            scoreBoard[y + 1][x] = scoreBoard[y][x]
                            scoreBoard[y][x] = 0
                        }
                    }
                }
            }
        }
        fallingValidation()
    }
}
elements.menu()