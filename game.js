
function shuffle(arr) {
    var arrCopy = arr.slice();
    var arrResult = [];

    while (arrCopy.length > 0) {
        var lastIndex = arrCopy.length - 1;
        var randomIndex = parseInt(Math.random() * lastIndex)
        var removedItem = arrCopy.splice(randomIndex, 1)
        arrResult.push(removedItem[0]);
    }

    return arrResult;
}

var colors = ['blue', 'black', 'green', 'white', 'red', 'pink', 'purple', 'orange'];
var allColors = shuffle(colors.concat(colors))
var game = {
    locked: false,
    lostMoves: 0,
    maxLostMoves: 10,
    moves: [],
}
var cells, tableGameContainer, wonGameContainer, lostGameContainer;

function gameWon() {
    for (var i = 0; i < cells.length; i++) {
        if (!cells[i].hasAttribute('data-locked')) {
            return false;
        }
    }

    return true;
}

function onTimesUp() {
    var move2 = game.moves.pop(),
        move1 = game.moves.pop(),
        color1 = move1.getAttribute('data-color'),
        color2 = move2.getAttribute('data-color');

    if (color1 === color2) {
        move1.style.backgroundColor = color1;
        move2.style.backgroundColor = color2;
        move1.setAttribute('data-locked', true);
        move2.setAttribute('data-locked', true);
    } else {
        move1.style.backgroundColor = 'silver';
        move2.style.backgroundColor = 'silver';
        game.lostMoves++;
    }
    game.locked = false;

    if (gameWon()) {
        tableGameContainer.style.display = 'none';
        wonGameContainer.style.display = 'block';
    } else if (game.lostMoves >= game.maxLostMoves) {
        tableGameContainer.style.display = 'none';
        lostGameContainer.style.display = 'block';
    }
}

function onCellClick() {
    var self = this,
        col = parseInt(self.getAttribute('data-col')),
        row = parseInt(self.getAttribute('data-row')),
        color = self.getAttribute('data-color'),
        dataLocked = self.hasAttribute('data-locked');

    if (!game.locked && !dataLocked) {
        self.style.backgroundColor = color;
        game.moves.push(self);

        if (game.moves.length === 2) {
            game.locked = true;
            setTimeout(onTimesUp, 500)
        }

    }
}

window.onload = function () {
    cells = document.getElementsByClassName('cell');
    tableGameContainer = document.getElementById('table-game');
    wonGameContainer = document.getElementById('won-game');
    lostGameContainer = document.getElementById('lost-game');

    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        cell.onclick = onCellClick;
        cell.setAttribute('data-color', allColors[i])
    }
}
