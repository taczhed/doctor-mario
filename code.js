//global
"use strict";
let level = 3
let score = 0
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
let time
let waiting = false
let keysActive = true
let hittingTime = false
let pressInterval
let changeImgInterval
let loopInterval
let blue
let red
let yellow

const elements = {

    menu: function () {

        elements.startGame()
    },

    startGame: function () {

        let game = document.querySelector("#game")
        game.style.display = "block"
        game.style.backgroundImage = "url('img/pf.png')"

        if (localStorage.score == undefined) {
            localStorage.clear()
            localStorage.setItem("score", score)
        }

        elements.dancingAnimation()
        elements.createArray()
        elements.createGameStateArray()
        elements.spawnCoronaVirus()
        elements.renderGameboard()
        elements.getRandomPill()
        elements.createThrowArray()
        elements.movePill()
        elements.numberOfViruses()
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

    spawnPill: function () {

        activeRow = 0
        activeCell = 0

        gameBoard[0][3] = firstColor
        gameBoard[0][4] = secoundColor
        elements.renderGameboard()
    },

    getRandomPill: function () {

        firstColor = Math.floor(Math.random() * 3) + 1
        secoundColor = Math.floor(Math.random() * 3) + 1
        pillNumber++

    },

    pillInterval: function () {

        // setTimeout(() => {

        if (scoreBoard[0][3] != 0 || scoreBoard[0][4] != 0) {

            let gameInfo = document.querySelector("#game-info")
            let mario = document.querySelector("#mario")
            gameInfo.style.display = "block"
            mario.style.display = "block"
            gameInfo.style.backgroundImage = "url('img/go.png')"
            clearInterval(falling)
            clearTimeout(time)
            clearInterval(loopInterval)
            clearInterval(changeImgInterval)

            let gr = 2
            setInterval(() => {
                blue.setAttribute("src", "img/lupa/bl/" + gr + ".png")
                red.setAttribute("src", "img/lupa/br/" + gr + ".png")
                yellow.setAttribute("src", "img/lupa/yl/" + gr + ".png")
                if (gr == 4) {
                    gr = 0
                }
                gr += 2
            }, 300);
        } else {

            falling = setInterval(() => {

                elements.gameMechanic()
                activeRow++
                let last = gameBoard.pop()
                gameBoard.unshift(last)
                elements.renderGameboard()

                // console.log("rząd: " + activeRow + ", item: " + activeCell)
            }, 500);

        }
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
                    press()
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

    numberOfViruses: function () {

        let virusNumber = 0
        let text = ""
        let textTop = ""
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 8; x++) {
                if (scoreBoard[y][x] != 0 && pairsBoard[y][x] == 0) {
                    virusNumber++
                }
            }
        }
        //wincheck
        score = (level * 100) - (virusNumber * 100)
        let topScore = localStorage.score.toString()
        let tc = topScore
        let sc = score.toString()
        let len = sc
        for (let r = 0; r < 7 - len.length; r++) {
            sc = "0" + sc
        }
        for (let r = 0; r < 7 - tc.length; r++) {
            topScore = "0" + topScore
        }
        for (let i = 0; i < 7; i++) {
            text = text + '<img class="sc" src="img/cyfry/' + sc[i] + '.png"></img>'
            textTop = textTop + '<img class="sc" src="img/cyfry/' + topScore[i] + '.png"></img>'
        }
        let scoreDiv = document.querySelector("#score")
        scoreDiv.innerHTML = text
        let topDiv = document.querySelector("#top")
        topDiv.innerHTML = textTop
        // console.log(localStorage.score)
        if (localStorage.score < score) {
            localStorage.setItem("score", score)
        }

        if (virusNumber == 0) {

            let gameInfo = document.querySelector("#game-info")
            gameInfo.style.display = "block"
            gameInfo.style.backgroundImage = "url('img/sc.png')"
            gameInfo.style.width = "350px"
            gameInfo.style.left = "calc(50% - 350px / 2)"
            blue.setAttribute("src", "img/lupa/bl/2.png")
            red.setAttribute("src", "img/lupa/br/2.png")
            yellow.setAttribute("src", "img/lupa/yl/2.png")
            clearInterval(falling)
            clearTimeout(time)
            clearInterval(loopInterval)
            clearInterval(changeImgInterval)
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
                        elements.numberOfViruses()
                    }, 50);

                    //resetowanie

                    clearInterval(falling)
                    clearInterval(fastFalling)
                    clearInterval(pressInterval)

                    keysActive = false
                    state = "horizontal"
                    gameBoard = []
                    elements.createArray()

                    time = setTimeout(() => {
                        clearInterval(grav)
                        elements.createThrowArray()
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
    },

    dancingAnimation: function () {

        blue = document.querySelector(".blue")
        red = document.querySelector(".red")
        yellow = document.querySelector(".yellow")
        let num = 1

        var radius = 48
        var ib = 0
        var ir = 120
        var iy = 240

        function loop() {

            var xb = radius * Math.cos((ib / 180) * Math.PI)
            var yb = radius * Math.sin((ib / 180) * Math.PI)

            var xr = radius * Math.cos((ir / 180) * Math.PI)
            var yr = radius * Math.sin((ir / 180) * Math.PI)

            var xy = radius * Math.cos((iy / 180) * Math.PI)
            var yy = radius * Math.sin((iy / 180) * Math.PI)

            blue.style.left = 55 + xb + "px"
            blue.style.top = 68 + yb + "px"

            red.style.left = 55 + xr + "px"
            red.style.top = 68 + yr + "px"

            yellow.style.left = 55 + xy + "px"
            yellow.style.top = 68 + yy + "px"

            ib -= 20
            ir -= 20
            iy -= 20
        }
        loop()
        setTimeout(() => {
            loopInterval = setInterval(loop, 1200)
        }, 600);
        function changeImg() {
            blue.setAttribute("src", "img/lupa/bl/" + num + ".png")
            red.setAttribute("src", "img/lupa/br/" + num + ".png")
            yellow.setAttribute("src", "img/lupa/yl/" + num + ".png")
            if (num == 3) {
                num = 0
            }
            num++
        }
        changeImg()
        changeImgInterval = setInterval(changeImg, 400)
    },

    createThrowArray: function () {

        let multipler = 25

        function pillThrow() {

            throwArray = []

            for (let y = 0; y < 8; y++) {

                let row = []
                throwArray.push(row)

                for (let x = 0; x < 12; x++) {
                    row.push([0, "none"])
                }
            }

            throwArray[3][10] = [firstColor, "left"]
            throwArray[3][11] = [secoundColor, "right"]
            throwArray[4][11] = [4, "top"]
            throwArray[5][11] = [4, "cen"]
            throwArray[6][11] = [4, "bot"]
        }
        pillThrow()

        function pillRot() {

            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 12; x++) {

                    if (throwArray[y][x][1] == "left") {
                        throwArray[y][x][1] = "down"
                    } else if (throwArray[y][x][1] == "down") {
                        throwArray[y][x][1] = "right"
                    } else if (throwArray[y][x][1] == "right") {
                        throwArray[y][x][1] = "up"
                    } else if (throwArray[y][x][1] == "up") {
                        throwArray[y][x][1] = "left"
                    }
                }
            }
            renderAnimation()
        }

        function renderAnimation() {
            let animation = document.getElementById("animation")
            animation.innerHTML = ""
            for (let y = 0; y < 8; y++) {

                let tr = document.createElement("tr")
                animation.appendChild(tr)

                for (let x = 0; x < 12; x++) {
                    let td = document.createElement("td")
                    tr.appendChild(td)

                    if (throwArray[y][x][0] == 4 || throwArray[y][x][0] == 5 || throwArray[y][x][0] == 6) {
                        td.style.backgroundImage = "url('img/hands/" + throwArray[y][x][0] + "" + throwArray[y][x][1] + ".png')"
                    } else if (throwArray[y][x][0] != 0 && throwArray[y][x][0] != 4 && throwArray[y][x][1] != "none") {
                        td.style.backgroundImage = "url('img/" + throwArray[y][x][0] + "/" + throwArray[y][x][0] + "_" + throwArray[y][x][1] + ".png')"

                    }
                }
            }
        }
        renderAnimation()

        //animacja 

        setTimeout(() => {
            throwArray[2][10] = throwArray[3][11]
            throwArray[3][11] = throwArray[0][0]
            pillRot()
        }, 1 * multipler);
        setTimeout(() => {
            throwArray[2][9] = throwArray[2][10]
            throwArray[2][10] = throwArray[3][10]
            throwArray[3][10] = throwArray[0][0]
            pillRot()
        }, 2 * multipler);
        setTimeout(() => {
            throwArray[1][9] = throwArray[2][10]
            throwArray[2][10] = throwArray[0][0]
            pillRot()
        }, 3 * multipler);
        setTimeout(() => {
            throwArray[1][8] = throwArray[1][9]
            throwArray[1][9] = throwArray[2][9]
            throwArray[2][9] = throwArray[0][0]

            throwArray[4][11] = throwArray[0][0]
            throwArray[5][11] = [5, "topright"]
            throwArray[6][11] = [5, "botright"]
            throwArray[5][10] = [5, "topleft"]
            throwArray[6][10] = [5, "botleft"]
            pillRot()
        }, 4 * multipler);
        setTimeout(() => {
            throwArray[0][8] = throwArray[1][9]
            throwArray[1][9] = throwArray[0][0]
            pillRot()
        }, 5 * multipler);
        setTimeout(() => {
            throwArray[1][7] = throwArray[0][8]
            throwArray[0][8] = throwArray[0][0]
            pillRot()
        }, 6 * multipler);
        setTimeout(() => {
            throwArray[0][7] = throwArray[1][8]
            throwArray[1][8] = throwArray[0][0]
            throwArray[5][11] = throwArray[0][0]
            throwArray[5][10] = throwArray[0][0]
            throwArray[6][10] = throwArray[0][0]
            throwArray[7][11] = [6, "bot"]
            throwArray[6][11] = [6, "top"]

            pillRot()
        }, 7 * multipler);
        setTimeout(() => {
            throwArray[1][6] = throwArray[0][7]
            throwArray[0][7] = throwArray[0][0]
            pillRot()
        }, 8 * multipler);
        setTimeout(() => {
            throwArray[0][6] = throwArray[1][7]
            throwArray[1][7] = throwArray[0][0]
            pillRot()
        }, 9 * multipler);
        setTimeout(() => {
            throwArray[1][5] = throwArray[0][6]
            throwArray[0][6] = throwArray[0][0]
            pillRot()
        }, 10 * multipler);
        setTimeout(() => {
            throwArray[0][5] = throwArray[1][6]
            throwArray[1][6] = throwArray[0][0]
            pillRot()
        }, 11 * multipler);
        setTimeout(() => {
            throwArray[1][4] = throwArray[0][5]
            throwArray[0][5] = throwArray[0][0]
            pillRot()
        }, 12 * multipler);
        setTimeout(() => {
            throwArray[0][4] = throwArray[1][5]
            throwArray[1][5] = throwArray[0][0]
            pillRot()
        }, 13 * multipler);
        setTimeout(() => {
            throwArray[1][3] = throwArray[0][4]
            throwArray[0][4] = throwArray[0][0]
            pillRot()

        }, 14 * multipler);
        setTimeout(() => {
            throwArray[0][3] = throwArray[1][4]
            throwArray[1][4] = throwArray[0][0]
            pillRot()
        }, 15 * multipler);
        setTimeout(() => {
            throwArray[1][2] = throwArray[0][3]
            throwArray[0][3] = throwArray[0][0]
            pillRot()
        }, 16 * multipler);
        setTimeout(() => {
            throwArray[0][2] = throwArray[1][3]
            throwArray[1][3] = throwArray[0][0]
            pillRot()
        }, 17 * multipler);
        setTimeout(() => {
            throwArray[2][1] = throwArray[0][2]
            throwArray[2][2] = throwArray[1][2]
            throwArray[0][2] = throwArray[0][0]
            throwArray[1][2] = throwArray[0][0]
            pillRot()
        }, 18 * multipler);
        setTimeout(() => {
            throwArray[1][1] = throwArray[2][2]
            throwArray[2][2] = throwArray[0][0]
            pillRot()
        }, 19 * multipler);
        setTimeout(() => {
            throwArray[2][0] = throwArray[1][1]
            throwArray[1][1] = throwArray[0][0]
            pillRot()
        }, 20 * multipler);
        setTimeout(() => {
            throwArray[3][0] = throwArray[2][0]
            throwArray[3][1] = throwArray[2][1]
            throwArray[2][1] = throwArray[0][0]
            throwArray[2][0] = throwArray[0][0]
            renderAnimation()
        }, 21 * multipler);
        setTimeout(() => {
            throwArray[4][0] = throwArray[3][0]
            throwArray[4][1] = throwArray[3][1]
            throwArray[3][1] = throwArray[0][0]
            throwArray[3][0] = throwArray[0][0]
            renderAnimation()
        }, 22 * multipler);
        setTimeout(() => {
            throwArray[5][0] = throwArray[4][0]
            throwArray[5][1] = throwArray[4][1]
            throwArray[4][1] = throwArray[0][0]
            throwArray[4][0] = throwArray[0][0]
            renderAnimation()
        }, 23 * multipler);
        setTimeout(() => {
            throwArray[5][0] = throwArray[0][0]
            throwArray[5][1] = throwArray[0][0]
            throwArray[4][1] = throwArray[0][0]
            throwArray[4][0] = throwArray[0][0]
            throwArray[7][11] = throwArray[0][0]
            throwArray[6][11] = throwArray[0][0]

            throwArray[4][11] = [4, "top"]
            throwArray[5][11] = [4, "cen"]
            throwArray[6][11] = [4, "bot"]

            elements.spawnPill()
            elements.getRandomPill()
            elements.gameMechanic()
            elements.pillInterval()
            throwArray[3][10] = [firstColor, "left"]
            throwArray[3][11] = [secoundColor, "right"]
            renderAnimation()
        }, 24 * multipler);
    }
}
elements.menu()