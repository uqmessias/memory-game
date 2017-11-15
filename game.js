var DEFAULT_TIMER = 30;
var game = {
    finished: false,
    won: null, /* null, true or false */
    level: 1,
    steps: [], /*{ index: 0, color: 'black' } */
    showingSteps: false,
    currentStepIndex: -1,
    timer: DEFAULT_TIMER,
};
var touchableBoxes, startLevel, endGame, level, timer;
var colors = ['black', 'purple', 'orange', 'blue', 'green', 'gray', 'pink', 'darkBlue'];

window.onload = function () {
    touchableBoxes = document.getElementsByClassName('touchable-box');
    startLevel = document.getElementById('start-level');
    endGame = document.getElementById('end-game');
    level = document.getElementById('level');
    timer = document.getElementById('timer');

    startLevel.onclick = onStartLevel;
    endGame.onclick = onEndGame;

    forEachTouchableBox(function (box, index) {
        box.onclick = function () {
            onTouchableClick(index);
        };

        box.style.backgroundColor = colors[index]
    });
}

function showSteps(steps) {
    if (steps && steps.length > 0) {
        var step = steps.shift();
        var item = touchableBoxes[step.index];
        item.style.opacity = 1;
        setTimeout(function () {
            item.style.opacity = 0.2;
            window.requestAnimationFrame(function () { showSteps(steps); });
        }, 1000);

        if (!game.showingSteps) {
            game.showingSteps = true;
        }
    } else {
        game.showingSteps = false;
        startTimer();
    }
}

function onStartLevel() {
    startLevel.setAttribute('disabled', 'disabled');
    endGame.removeAttribute('disabled');

    game.steps = getStepsForCurrentLevel();
    showSteps(game.steps.slice());
}

function startTimer() {
    // when the time is up call timeIsUp();
    // write the time that last in the timer.innerHTML
}

function timeIsUp() {
    endGame(false);
}

function getStepsForCurrentLevel() {
    var steps = [];

    for (var i = 0; i <= game.level; i++) {
        var randomIndex = Math.floor(Math.random() * (colors.length - 1));
        steps.push({
            index: randomIndex,
            color: colors[randomIndex]
        });
    }

    return steps;
}

function forEachTouchableBox(fnBox) {
    if (fnBox && typeof fnBox === 'function') {
        for (var i = 0; i < touchableBoxes.length; i++) {
            var box = touchableBoxes[i];
            fnBox(box, i);
        }
    }
}

function onTouchableClick(index) {
    if (!game.showingSteps && game.steps && game.steps.length > 0) {
        var currentStep = game.steps.shift();
        game.showingSteps = true;

        if (currentStep.index === index) {
            var item = touchableBoxes[index];
            item.style.opacity = 1;
            setTimeout(function () {
                item.style.opacity = 0.2;
                game.showingSteps = false;

                if (game.steps && game.steps.length === 0) {
                    game.level++;
                    level.innerHTML = game.level;
                    startLevel.removeAttribute('disabled');
                    endGame.setAttribute('disabled', 'disabled');
                }
            }, 500);
        } else {
            alert('You lose!');
            onEndGame(false);
        }
    }
}

function onEndGame(won) {
    game.level = 1;
    game.steps = [];
    game.timer = DEFAULT_TIMER;
    game.finished = true;
    game.currentStepIndex = -1;
    game.won = typeof won === 'boolean' ? won : null;
    startLevel.removeAttribute('disabled');
    endGame.setAttribute('disabled', 'disabled');
    level.innerHTML = game.level;
    timer.innerHTML = '--';
}