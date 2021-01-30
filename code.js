//global
"use strict";
let gameBoard = []
let scoreBoard = []
let firstColor
let secoundColor
let falling
let activeRow = 0
let activeCell = 0
let state = "horizontal"
let fastFalling
let goFast = true
let mapBoard

let lastKey

const elements = {

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

        function createScoreArray() {

            for (let y = 0; y < 16; y++) {
                let row = []

                scoreBoard.push(row)

                for (let x = 0; x < 8; x++) {
                    row.push(0)
                }
            }

            let row = []
            scoreBoard.push(row)

            for (let x = 0; x < 8; x++) {
                row.push(9)
            }

            // console.log(scoreBoard)
        }

        createScoreArray()
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

                //odpowanienie kolorwanie
                if (gameBoard[y][x] == 1 || scoreBoard[y][x] == 1) {
                    td.classList.add("salmon")

                } else if (gameBoard[y][x] == 2 || scoreBoard[y][x] == 2) {
                    td.classList.add("blue")

                } else if (gameBoard[y][x] == 3 || scoreBoard[y][x] == 3) {
                    td.classList.add("yellow")
                }


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

        firstColor = Math.floor(Math.random() * 3) + 1
        secoundColor = Math.floor(Math.random() * 3) + 1

        gameBoard[0][3] = firstColor
        gameBoard[0][4] = secoundColor

        elements.pillInterval()
    },

    pillInterval: function () {

        falling = setInterval(() => {

            let last = gameBoard.pop()
            gameBoard.unshift(last)

            elements.renderGameboard()

            activeRow++

            // console.log("rząd: " + activeRow + ", item: " + activeCell)

            setTimeout(() => {
                elements.gameMechanic()
            }, 475);

        }, 500);

        elements.renderGameboard()

    },

    movePill: function () {

        addEventListener("keydown", checkKey)
        addEventListener("keyup", backKey)

        function backKey(e) {
            if (e.keyCode == lastKey) {
                addEventListener("keydown", checkKey)
                // console.log("puszczono: " + e.keyCode)
            }
        }
        function checkKey(e) {
            // console.log("wcisnieto: " + e.keyCode)
            removeEventListener("keydown", checkKey)
            lastKey = e.keyCode
            if (e.keyCode == '38' || e.keyCode == '87') {
                //góra
                if (scoreBoard[activeRow - 1][activeCell] != 0 && state == "horizontal" || scoreBoard[activeRow][activeCell + 1] != 0 && state == "vertical") {

                    if (gameBoard[activeRow][7] != 0 && gameBoard[activeRow - 1][7] != 0 && state == "vertical") {

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
            else if (e.keyCode == '16') {
                // shift

                if (scoreBoard[activeRow - 1][activeCell] != 0 && state == "horizontal" || scoreBoard[activeRow][activeCell + 1] != 0 && state == "vertical") {

                    if (gameBoard[activeRow][7] != 0 && gameBoard[activeRow - 1][7] != 0 && state == "vertical") {

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
            else if (e.keyCode == '40' || e.keyCode == '83') {
                //dół
                clearInterval(falling)
                if (goFast == true) {
                    fastFalling = setInterval(() => {

                        removeEventListener("keydown", checkKey)
                        removeEventListener("keyup", backKey)
                        goFast = false

                        let last = gameBoard.pop()
                        gameBoard.unshift(last)

                        elements.renderGameboard()
                        activeRow++
                        elements.gameMechanic()

                    }, 50);
                }
            }
            else if (e.keyCode == '37' || e.keyCode == '65') {
                //lewo

                if (gameBoard[activeRow][0] != 0 || scoreBoard[activeRow][activeCell - 1] != 0) {
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

                } else if (gameBoard[activeRow][7] != 0 && state == "vertical") {

                } else {

                    for (let y = 0; y < 16; y++) {
                        let lastColumn = gameBoard[y].pop()
                        gameBoard[y].unshift(lastColumn)
                    }
                }
            }

            elements.renderGameboard()
        }
    },

    gameMechanic: function () {

        function fallingValidation() {

            if (scoreBoard[activeRow + 1][activeCell] != 0 || scoreBoard[activeRow + 1][activeCell + 1] != 0 && state == "horizontal") {

                function saveData() {

                    for (let y = 0; y < 16; y++) {
                        for (let x = 0; x < 8; x++) {

                            if (gameBoard[y][x] != 0) {
                                // console.log(gameBoard)
                                scoreBoard[y][x] = gameBoard[y][x]
                            }
                        }
                    }

                    hitValidation(1)
                    hitValidation(2)
                    hitValidation(3)

                    //resetowanie

                    if (goFast == false) {
                        elements.movePill()
                    }

                    clearInterval(falling)
                    activeRow = 0
                    activeCell = 0
                    state = "horizontal"
                    clearInterval(fastFalling)
                    goFast = true
                    elements.createArray()
                    elements.getRandomPill()
                }
                saveData()
            }
        }

        function hitValidation(number) {

            mapBoard = scoreBoard

            for (let y = 0; y < 16; y++) {
                for (let x = 0; x < 8; x++) {

                    if (scoreBoard[y][x] == number && scoreBoard[y][x + 1] == number && scoreBoard[y][x + 2] == number && scoreBoard[y][x + 3] == number) {

                        let count = 1
                        for (let i = 0; i < count; i++) {
                            if (scoreBoard[y][x + i] == number) {
                                mapBoard[y][x + i] = 0
                                count++
                            }
                        }
                        console.log("hor yea")
                    }

                    if (scoreBoard[y][x] == number && scoreBoard[y + 1][x] == number && scoreBoard[y + 2][x] == number && scoreBoard[y + 3][x] == number) {

                        let count = 1
                        for (let i = 0; i < count; i++) {
                            if (scoreBoard[y + i][x] == number) {
                                mapBoard[y + i][x] = 0
                                count++
                            }
                        }
                        console.log("ver yea")
                    }
                }
            }
            scoreBoard = mapBoard

        }

        fallingValidation()
    }
}

elements.createArray()
elements.createGameStateArray()
elements.getRandomPill()
elements.movePill()
