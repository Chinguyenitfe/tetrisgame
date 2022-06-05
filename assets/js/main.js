$(document).ready(function () {
    let squares = $('.grid div').toArray();
    const scoreDisplay = $('#score');
    const startBtn = $('#start-button');
    let level = 1;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const width = 10;
    const colors = ['orange', 'red', 'purple', 'green', 'blue'];

    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;

    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    function draw() {
        $.each(current, function (index, value) {
            $(squares[currentPosition + value]).addClass('tetromino');
            $(squares[currentPosition + value]).css('background-color', colors[random]);
            if (inVisible) {
                $(squares[currentPosition + value]).css('background-color', "transparent");
            }
        });
    }

    function undraw() {
        $.each(current, function (index, value) {
            $(squares[currentPosition + value]).removeClass('tetromino');
            $(squares[currentPosition + value]).css('background-color', '');
        });
    }

    $(window).on('keyup', function (e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38 && !nonRotate) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    });

    function freeze() {
        if (current.some(function (index) {
            return $(squares[currentPosition + index + width]).hasClass('taken');
        })) {
            $.each(current, function (index, value) { $(squares[currentPosition + value]).addClass('taken') });
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(function (index) {
            return (currentPosition + index) % width === 0;
        });
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(function (index) {
            $(squares[currentPosition + index]).hasClass('taken')
        })) {
            currentPosition += 1;
        }
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(function (index) {
            return (currentPosition + index) % width === width - 1;
        });
        if (!isAtRightEdge) currentPosition += 1
        if (current.some(function (index) {
            $(squares[currentPosition + index]).hasClass('taken');
        })) {
            currentPosition -= 1;
        }
        draw();
    }
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;

    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
        [1, displayWidth, displayWidth + 1, displayWidth + 2],
        [0, 1, displayWidth, displayWidth + 1],
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
    ]

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        })
    }
    let seconds = 0;
    function level2() {
        seconds = 0;
        const squaresRemoved = squares.splice(0, 10);
        const squaresRemoved2 = squares.splice(squares.length - 10, 10);
        squares = squares.concat(squaresRemoved).concat(squaresRemoved2);
        squares.forEach(cell => grid.appendChild(cell));
        let random = Math.floor(Math.random() * squaresRemoved.length);
        squaresRemoved.forEach(function (square, index) {
            if (index !== random) {
                square.classList.add('taken');
                square.style.backgroundColor = colors[nextRandom];
            }
        });
    }
    let nonRotate = false;
    function level3() {
        nonRotate = currentPosition >= 70;
    }
    function level4() {
        if (currentPosition >= 70 && currentPosition <= 80) {
            current = theTetrominoes[Math.floor(Math.random() * theTetrominoes.length)][currentRotation];
        }
    }
    let inVisible = false;
    function level5() {
        inVisible = currentPosition >= 70;
    }
    function game() {
        seconds += 0.5;
        undraw();
        if (seconds >= 20 && level === 2) {
            level2();
        }
        currentPosition += width;
        if (level === 3) {
            level3();
            if (seconds >= 20) {
                level2();
            }
        }
        if (level === 4) {
            level3();
            level4();
            if (seconds >= 20) {
                level2();
            }
        }

        if (level === 5) {
            level3();
            level5();
            if (seconds >= 20) {
                level2();
            }
        }
        draw();
        freeze();
    }
    startBtn.click(function () {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(game, 500);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
        }
    });


    $('#level-x').change(function () {
        if ($('#level-x').val() === 'level-two') {
            level = 2;
        } else {
            if ($('#level-x').val() === 'level-three') {
                level = 3;
            } else {
                if ($('#level-x').val() === 'level-four') {
                    level = 4;
                } else {
                    if ($('#level-x').val() === 'level-five') {
                        level = 5;
                    }
                }
            }
        }
    });
    const grid = document.querySelector('.grid');
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.text(score);
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    const end = $('.end-game');
    function endGame() {
        end.css('display', 'block');
    };
    function gameOver() {
        if (current.some(function (index) {
            return $(squares[currentPosition + index]).hasClass('taken');
        })) {
            clearInterval(timerId);
            endGame();
        }
    }
});