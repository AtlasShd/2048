'use strict';

const game = document.querySelector('.game__game'),
	gameCount = document.querySelector('.game__count'),
	gameOver = document.querySelector('.game__game-over'),
	win = document.querySelector('.game__game-win'),
	scoreTable = document.querySelector('.score-table__body');

let logic = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
];

let isPossibleToLeft = true,
	isPossibleToRight = true,
	isPossibleToUp = true,
	isPossibleToDown = true,
	isPossible = true;

let result = 0;

let scoreForWin = 2048;

function changeResult(num) {
	result += num;
	gameCount.innerHTML = result;
}

function randomNum() {
	const random = Math.floor(Math.random() * 4);
	return random === 100 ? 75 : random;
}

function createBox(color, num) {
	const elem = document.createElement('div');
	elem.classList.add(`game__box`);
	elem.classList.add('animate-showbox');
	elem.textContent = num;

	return elem;
}

function locationBox(elem) {
	let x;
	let y;
	let count = 0;
	do {
		x = randomNum();
		y = randomNum();
		if (++count === 50) {
			//this limiter needed at the end
			return;
		}
	} while (logic[y][x]);
	setXY(elem, x, y);
	logic[y][x] = 2;
	return elem;
}

function setXY(elem, x, y) {
	const extraBox = document.querySelector(`#x${y}y${x}`);
	if (extraBox) {
		extraBox.id = 'deleted';
		extraBox.classList.add('animate-hidebox');
		extraBox.addEventListener('animationend', () => {
			extraBox.remove();
		});
		elem.classList.remove('animate-showbox');
		elem.classList.add('animate-stackbox');
		elem.addEventListener('animationend', () => {
			elem.classList.remove('animate-stackbox');
		});
		elem.textContent = +elem.textContent * 2;
		elem.classList.add(`box-color${elem.textContent}`);
		changeResult(+elem.textContent);
		if (+elem.textContent === scoreForWin) {
			showTheEnd(win);
		}
	}
	elem.style.cssText = `left: ${x * 25 + '%'}; top: ${y * 25 + '%'};`;
	elem.id = `x${y}y${x}`;
	isPossibleToLeft = true;
	isPossibleToRight = true;
	isPossibleToUp = true;
	isPossibleToDown = true;
}

function createRandomBox() {
	const elem = locationBox(createBox('red', '2'));
	if (!elem) {
		return;
	}
	changeResult(2);
	game.append(elem);
}

function showTheEnd(element) {
	element.classList.add('game_show');
	isPossible = false;
	if (scoreForWin === 8192) {
		document.querySelector('.game__resume-game').remove();
	}
}

document.querySelector('.game__try-again').addEventListener('click', startNewGame);
document.querySelector('.game__new-game').addEventListener('click', startNewGame);
document.querySelector('.game__resume-game').addEventListener('click', resumeGame);

function startNewGame(e) {
	logic = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	];

	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			const elem = document.querySelector(`#x${i}y${j}`);
			if (elem) {
				elem.remove();
			}
		}
	}
	gameOver.classList.remove('game_show');
	win.classList.remove('game_show');

	result = 0;
	changeResult(0);

	createRandomBox();
	createRandomBox();

	isPossible = true;

	e.preventDefault();
}

function resumeGame(e) {
	win.classList.remove('game_show');
	scoreForWin = 8192;
	isPossible = true;
}

createRandomBox();
createRandomBox();

function checkToLose() {
	if (!isPossibleToLeft && !isPossibleToRight && !isPossibleToUp && !isPossibleToDown && isPossible) {
		isPossible = false;

		pushLocalStorage();

		showTheEnd(gameOver);

		createScorePlace();
	}
}

function moveLeft() {
	for (let i = 0; i < 4; i++) {
		for (let j = 1; j < 4; j++) {
			if (logic[i][j]) {
				let k = j;
				while (k != 0) {
					if (logic[i][k - 1] === logic[i][k]) {
						logic[i][k - 1] = logic[i][k - 1] + logic[i][k];
						logic[i][k] = 0;
						setXY(document.querySelector(`#x${i}y${k}`), k - 1, i);
					} else if (logic[i][k - 1] === 0) {
						logic[i][k - 1] = logic[i][k];
						logic[i][k] = 0;
						setXY(document.querySelector(`#x${i}y${k}`), k - 1, i);
					}
					k--;
				}
			}
		}
	}
}

function moveRight() {
	for (let i = 3; i >= 0; i--) {
		for (let j = 2; j >= 0; j--) {
			if (logic[i][j]) {
				let k = j;
				while (k != 3) {
					if (logic[i][k + 1] === logic[i][k]) {
						logic[i][k + 1] = logic[i][k + 1] + logic[i][k];
						logic[i][k] = 0;
						setXY(document.querySelector(`#x${i}y${k}`), k + 1, i);
					} else if (logic[i][k + 1] === 0) {
						logic[i][k + 1] = logic[i][k];
						logic[i][k] = 0;
						setXY(document.querySelector(`#x${i}y${k}`), k + 1, i);
					}
					k++;
				}
			}
		}
	}
}

function moveUp() {
	for (let i = 0; i < 4; i++) {
		for (let j = 1; j < 4; j++) {
			if (logic[j][i]) {
				let k = j;
				while (k != 0) {
					if (logic[k - 1][i] === logic[k][i]) {
						logic[k - 1][i] = logic[k - 1][i] + logic[k][i];
						logic[k][i] = 0;
						setXY(document.querySelector(`#x${k}y${i}`), i, k - 1);
					} else if (logic[k - 1][i] === 0) {
						logic[k - 1][i] = logic[k][i];
						logic[k][i] = 0;
						setXY(document.querySelector(`#x${k}y${i}`), i, k - 1);
					}
					k--;
				}
			}
		}
	}
}

function moveDown() {
	for (let i = 3; i >= 0; i--) {
		for (let j = 2; j >= 0; j--) {
			if (logic[j][i]) {
				let k = j;
				while (k != 3) {
					if (logic[k + 1][i] === logic[k][i]) {
						logic[k + 1][i] = logic[k + 1][i] + logic[k][i];
						logic[k][i] = 0;
						setXY(document.querySelector(`#x${k}y${i}`), i, k + 1);
					} else if (logic[k + 1][i] === 0) {
						logic[k + 1][i] = logic[k][i];
						logic[k][i] = 0;
						setXY(document.querySelector(`#x${k}y${i}`), i, k + 1);
					}
					k++;
				}
			}
		}
	}
}

function toLeft() {
	if (!isPossible) {
		return;
	}
	new Promise((res) => {
		isPossibleToLeft = false;
		moveLeft();
		res();
	}).then(() => {
		if (isPossibleToLeft) {
			createRandomBox();
			createRandomBox();
		}
	});
}

function toRight() {
	if (!isPossible) {
		return;
	}
	new Promise((res) => {
		isPossibleToRight = false;
		moveRight();
		res();
	}).then(() => {
		if (isPossibleToRight) {
			createRandomBox();
			createRandomBox();
		}
	});
}

function toUp() {
	if (!isPossible) {
		return;
	}
	new Promise((res) => {
		isPossibleToUp = false;
		moveUp();
		res();
	}).then(() => {
		if (isPossibleToUp) {
			createRandomBox();
			createRandomBox();
		}
	});
}

function toDown() {
	if (!isPossible) {
		return;
	}
	new Promise((res) => {
		isPossibleToDown = false;
		moveDown();
		res();
	}).then(() => {
		if (isPossibleToDown) {
			createRandomBox();
			createRandomBox();
		}
	});
}

document.addEventListener('keydown', (e) => {
	if (e.key == 'ArrowLeft') {
		toLeft();
		e.preventDefault();
	} else if (e.key == 'ArrowRight') {
		toRight();
		e.preventDefault();
	} else if (e.key == 'ArrowUp') {
		toUp();
		e.preventDefault();
	} else if (e.key == 'ArrowDown') {
		toDown();
		e.preventDefault();
	}
	checkToLose();
});

//swipe

const swiper = (element) => {
	const ALLOWED_TIME = 300,
		TRESHOLD = 50,
		RESTRAINT = 100;

	let surface = element;

	let startTime = 0,
		fullTime = 0;

	let startX = 0,
		startY = 0,
		distanceX = 0,
		distanceY = 0,
		distance = 0;

	surface.addEventListener('mousedown', function (e) {
		startTime = new Date().getTime();
		startX = e.pageX;
		startY = e.pageY;
		e.preventDefault();
	});

	surface.addEventListener('mouseup', function (e) {
		fullTime = new Date().getTime() - startTime;
		distanceX = e.pageX - startX;
		distanceY = e.pageY - startY;
		distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
		// calculate total distance move of mouse through Pythagorean theorem

		if (fullTime <= ALLOWED_TIME && distance >= TRESHOLD) {
			if (Math.abs(distanceY) <= RESTRAINT && Math.abs(distanceX) > Math.abs(distanceY)) {
				distanceX > 0 ? toRight() : toLeft();
			} else {
				distanceY > 0 ? toDown() : toUp();
			}
		}

		checkToLose();
		e.preventDefault();
	});

	surface.addEventListener('touchstart', function (e) {
		startTime = new Date().getTime();
		startX = e.touches[0].pageX;
		startY = e.touches[0].pageY;
		e.preventDefault();
	});

	surface.addEventListener('touchend', function (e) {
		fullTime = new Date().getTime() - startTime;
		distanceX = e.changedTouches[0].pageX - startX;
		distanceY = e.changedTouches[0].pageY - startY;
		distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
		// calculate total distance move of touch through Pythagorean theorem

		if (fullTime <= ALLOWED_TIME && distance >= TRESHOLD) {
			if (Math.abs(distanceY) <= RESTRAINT && Math.abs(distanceX) > Math.abs(distanceY)) {
				distanceX > 0 ? toRight() : toLeft();
			} else {
				distanceY > 0 ? toDown() : toUp();
			}
		}

		checkToLose();
		e.preventDefault();
	});
};

swiper(document.querySelector('.game__game'));

function pushLocalStorage() {
	const local = window.localStorage.getItem('score-table');
	if (local) {
		window.localStorage.setItem('score-table', `${local}, ${result}`);
	} else {
		window.localStorage.setItem('score-table', result);
	}
}

function createScorePlace() {
	if (window.localStorage.getItem('score-table')) {
		scoreTable.innerHTML = '';
		const places = window.localStorage.getItem('score-table').split(',');
		places.sort((a, b) => b - a);
		const placesLength = places.length < 10 ? places.length : 10;

		for (let i = 0; i < placesLength; i++) {
			const span = document.createElement('span');

			span.textContent = `${i + 1} place: ${places[i]} points`;
			span.classList.add('score-table__value');

			scoreTable.append(span);
		}
	}
}

// localstorage

window.addEventListener('load', createScorePlace);

//show score place

document.querySelector('.score-table__title').addEventListener('click', () => {
	scoreTable.classList.toggle('score-table__body_show');
});

// disabling transition before loading page

window.addEventListener('load', () => {
	document.querySelector('#transition-none').removeAttribute('id');
});
