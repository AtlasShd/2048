'use strict';

const game = document.querySelector('.game__game');

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
	game.append(elem);
}

createRandomBox();
createRandomBox();

function moveLeft() {
	isPossibleToLeft = false;
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
	isPossibleToRight = false;
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
	isPossibleToUp = false;
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
	isPossibleToDown = false;
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

document.addEventListener('keydown', (e) => {
	if (!isPossible) {
		return;
	} else {
		isPossible = false;
	}

	if (e.key == 'ArrowLeft') {
		new Promise((res) => {
			if (isPossibleToLeft) {
				moveLeft();
				res();
			}
		}).then(() => {
			createRandomBox();
			createRandomBox();
			isPossible = true;
		});
	} else if (e.key == 'ArrowRight') {
		new Promise((res) => {
			if (isPossibleToRight) {
				moveRight();
				res();
			}
		}).then(() => {
			createRandomBox();
			createRandomBox();
			isPossible = true;
		});
	} else if (e.key == 'ArrowUp') {
		new Promise((res) => {
			if (isPossibleToUp) {
				moveUp();
				res();
			}
		}).then(() => {
			createRandomBox();
			createRandomBox();
			isPossible = true;
		});
	} else if (e.key == 'ArrowDown') {
		new Promise((res) => {
			if (isPossibleToDown) {
				moveDown();
				res();
			}
		}).then(() => {
			createRandomBox();
			createRandomBox();
			isPossible = true;
		});
	}
	if (!isPossibleToLeft && !isPossibleToRight && !isPossibleToUp && !isPossibleToUp) {
		alert('game over');
	}

	console.log(logic);
});





























// disabling transition before loading page

window.addEventListener('load', () => {
	document.querySelector('#transition-none').removeAttribute('id');
});