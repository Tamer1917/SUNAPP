"use strict";

// تعريف المتغيرات الأساسية
const board = document.getElementById('board');
const turnIndicator = document.getElementById('turnIndicator');
const whiteTimer = document.getElementById('whiteTimer');
const blackTimer = document.getElementById('blackTimer');

let initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

const pieces = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

let currentPlayer = 'white';
let selectedSquare = null;
let whiteTimeLeft = 40;
let blackTimeLeft = 40;
let whiteTimerInterval = null;
let blackTimerInterval = null;
let gameEnded = false; // متغيّر لتحديد انتهاء اللعبة

// معرف المستخدم الحالي (يجب تهيئته وفقاً لطريقة تسجيل الدخول في مشروعك)
const currentUserId = "USER_ID_HERE";

// دوال إنشاء اللوحة والتعامل مع النقرات
function createBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = row;
            square.dataset.col = col;

            if (initialBoard[row][col]) {
                const piece = document.createElement('span');
                piece.classList.add('piece');
                piece.textContent = pieces[initialBoard[row][col]];
                square.appendChild(piece);
            }

            square.addEventListener('click', () => onSquareClick(row, col));
            board.appendChild(square);
        }
    }
}

function onSquareClick(row, col) {
    if (gameEnded) return;

    if (currentPlayer === 'black') return; // حركة الذكاء الاصطناعي تتحكم باللاعب الأسود

    const piece = initialBoard[row][col];
    if (selectedSquare) {
        const [prevRow, prevCol] = selectedSquare;
        if (isValidMove(prevRow, prevCol, row, col)) {
            movePiece(prevRow, prevCol, row, col);
            if (!gameEnded) {
                changeTurn();
                if (currentPlayer === 'black') {
                    makeAIMove();
                }
            }
        }
        deselectSquare();
    } else if (piece && isPieceOfCurrentPlayer(piece)) {
        selectSquare(row, col);
    }
}

function selectSquare(row, col) {
    if (selectedSquare) deselectSquare();
    selectedSquare = [row, col];
    const square = getSquareElement(row, col);
    square.classList.add('selected');
}

function deselectSquare() {
    if (selectedSquare) {
        const [row, col] = selectedSquare;
        const square = getSquareElement(row, col);
        square.classList.remove('selected');
        selectedSquare = null;
    }
}

function getSquareElement(row, col) {
    return document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
}

function isPieceOfCurrentPlayer(piece) {
    if (currentPlayer === 'white' && piece === piece.toUpperCase()) return true;
    if (currentPlayer === 'black' && piece === piece.toLowerCase()) return true;
    return false;
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    const currentPiece = initialBoard[fromRow][fromCol];
    const targetPiece = initialBoard[toRow][toCol];

    // مثال: التحقق من حركة البيدق (Pawn)
    if (currentPiece.toLowerCase() === 'p') {
        const direction = currentPiece === 'P' ? -1 : 1;
        if (toRow === fromRow + direction && toCol === fromCol && targetPiece === '') {
            return true;
        }
        return false;
    }
    // هنا يمكنك إضافة منطق التحقق لباقي القطع (الرخ، الحصان، الفيل، الوزير، الملك)

    // مثال لحركة الرخ (Rook)
    if (currentPiece.toLowerCase() === 'r') {
        if (fromRow === toRow) {
            const step = toCol > fromCol ? 1 : -1;
            for (let col = fromCol + step; col !== toCol; col += step) {
                if (initialBoard[fromRow][col] !== '') return false;
            }
        } else if (fromCol === toCol) {
            const step = toRow > fromRow ? 1 : -1;
            for (let row = fromRow + step; row !== toRow; row += step) {
                if (initialBoard[row][fromCol] !== '') return false;
            }
        } else {
            return false;
        }
        return targetPiece === '' || isOpponentPiece(targetPiece);
    }

    // يمكنك متابعة منطق القطع الأخرى بنفس الطريقة...
    return false;
}

function isOpponentPiece(piece) {
    if (currentPlayer === 'white' && piece === piece.toLowerCase()) return true;
    if (currentPlayer === 'black' && piece === piece.toUpperCase()) return true;
    return false;
}

function movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = initialBoard[fromRow][fromCol];
    const capturedPiece = initialBoard[toRow][toCol];
    initialBoard[toRow][toCol] = piece;
    initialBoard[fromRow][fromCol] = '';
    renderBoard();

    // التحقق من قتل الملكة وإنهاء اللعبة
    if (capturedPiece === 'Q' || capturedPiece === 'q') {
        if (capturedPiece === 'Q') {
            endGame('black');
        } else {
            endGame('white');
        }
    }
}

function changeTurn() {
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    turnIndicator.textContent = `دور اللاعب: ${currentPlayer === 'white' ? 'الأبيض' : 'الأسود'}`;
    resetTimers();
}

function renderBoard() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        const row = square.dataset.row;
        const col = square.dataset.col;
        const piece = initialBoard[row][col];
        square.innerHTML = '';
        if (piece) {
            const pieceElement = document.createElement('span');
            pieceElement.classList.add('piece');
            pieceElement.textContent = pieces[piece];
            square.appendChild(pieceElement);
        }
    });
}

function startTimer() {
    if (currentPlayer === 'white') {
        whiteTimerInterval = setInterval(() => {
            whiteTimeLeft--;
            whiteTimer.textContent = `الوقت المتبقي للأبيض: ${whiteTimeLeft}`;
            if (whiteTimeLeft === 0) {
                clearInterval(whiteTimerInterval);
                changeTurn();
            }
        }, 1000);
    } else {
        blackTimerInterval = setInterval(() => {
            blackTimeLeft--;
            blackTimer.textContent = `الوقت المتبقي للأسود: ${blackTimeLeft}`;
            if (blackTimeLeft === 0) {
                clearInterval(blackTimerInterval);
                changeTurn();
            }
        }, 1000);
    }
}

function resetTimers() {
    if (currentPlayer === 'white') {
        clearInterval(blackTimerInterval);
        blackTimeLeft = 40;
        blackTimer.textContent = `الوقت المتبقي للأسود: ${blackTimeLeft}`;
        startTimer();
    } else {
        clearInterval(whiteTimerInterval);
        whiteTimeLeft = 40;
        whiteTimer.textContent = `الوقت المتبقي للأبيض: ${whiteTimeLeft}`;
        startTimer();
    }
}

function makeAIMove() {
    if (gameEnded) return;

    let moved = false;
    for (let row = 7; row >= 0; row--) {
        for (let col = 7; col >= 0; col--) {
            if (initialBoard[row][col] !== '' && isPieceOfCurrentPlayer(initialBoard[row][col])) {
                for (let toRow = 7; toRow >= 0; toRow--) {
                    for (let toCol = 7; toCol >= 0; toCol--) {
                        if (isValidMove(row, col, toRow, toCol)) {
                            movePiece(row, col, toRow, toCol);
                            if (!gameEnded) {
                                changeTurn();
                            }
                            moved = true;
                            break;
                        }
                    }
                    if (moved) break;
                }
            }
            if (moved) break;
        }
        if (moved) break;
    }
}

function endGame(winner) {
    gameEnded = true;
    alert(`انتهت اللعبة. فاز ${winner === 'white' ? 'الأبيض' : 'الأسود'}.`);

    // تحديث رصيد المستخدم عبر Firebase
    var userRef = firebase.database().ref("users/" + currentUserId);
    userRef.once("value")
        .then(function(snapshot) {
            let currentScore = snapshot.val() && snapshot.val().score ? snapshot.val().score : 0;
            let newScore = winner === "white" ? currentScore + 2 : currentScore - 2;
            return userRef.update({ score: newScore });
        })
        .then(function() {
            console.log("تم تحديث رصيد المستخدم.");
        })
        .catch(function(error) {
            console.error("خطأ في تحديث رصيد المستخدم:", error);
            alert("حدث خطأ أثناء تحديث الرصيد.");
        });

    clearInterval(whiteTimerInterval);
    clearInterval(blackTimerInterval);
}

// بدء اللعبة
createBoard();
startTimer();
