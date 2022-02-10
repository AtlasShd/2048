'use strict';

const game = document.querySelector('.game__game'),
	gameCount = document.querySelector('.game__count'),
	gameOver = document.querySelector('.game__game-over');

let logic = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
];

let isPossibleToLeft = true,
	isPossibleToRight = true,
	isPossibleToUp = true,
	isPossibleToDown = true;

let result = 0;

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
	elem.classList.add(`game__box_${color}${num}`);
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
		if (++count === 50) { //this limiter needed at the end
			return;
		}
	} while (logic[y][x]);
	setXY(elem, x, y);
	logic[y][x] = 2;
	return elem;
}

function setXY(elem, x, y) {
	if (document.querySelector(`#x${y}y${x}`)) {
		document.querySelector(`#x${y}y${x}`).remove();
		elem.textContent = +elem.textContent * 2;
		changeResult(+elem.textContent);
	}
	elem.style.cssText = `left: ${(x * 25) + '%'}; top: ${(y * 25) + '%'};`;
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

function showGameOver() {
	gameOver.classList.add('game__game-over_show');
}

document.querySelector('.game__try-again').addEventListener('click', (e) => {
	logic = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	];

	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			document.querySelector(`#x${i}y${j}`).remove();
		}
	}
	gameOver.classList.remove('game__game-over_show');

	result = 0;
	changeResult(0);

	createRandomBox();
	createRandomBox();

	e.preventDefault();
});

createRandomBox();
createRandomBox();

function checkToLose() {
	if (!isPossibleToLeft && !isPossibleToRight && !isPossibleToUp && !isPossibleToUp) {
		showGameOver();
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
	new Promise((res) => {
		if (isPossibleToLeft) {
			isPossibleToLeft = false;
			moveLeft();
			res();
		}
	}).then(() => {
		createRandomBox();
		createRandomBox();
	});
}

function toRight() {
	new Promise((res) => {
		if (isPossibleToRight) {
			isPossibleToRight = false;
			moveRight();
			res();
		}
	}).then(() => {
		createRandomBox();
		createRandomBox();
	});
}

function toUp() {
	new Promise((res) => {
		if (isPossibleToUp) {
			isPossibleToUp = false;
			moveUp();
			res();
		}
	}).then(() => {
		createRandomBox();
		createRandomBox();
	});
}

function toDown() {
	new Promise((res) => {
		if (isPossibleToDown) {
			isPossibleToDown = false;
			moveDown();
			res();
		}
	}).then(() => {
		createRandomBox();
		createRandomBox();
	});
}

document.addEventListener('keydown', (e) => {

	if (e.key == 'ArrowLeft') {
		toLeft();
	} else if (e.key == 'ArrowRight') {
		toRight();
	} else if (e.key == 'ArrowUp') {
		toUp();
	} else if (e.key == 'ArrowDown') {
		toDown();
	}
	checkToLose();

	e.preventDefault();
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


// disabling transition before loading page

window.addEventListener('load', () => {
	document.querySelector('#transition-none').removeAttribute('id');
});