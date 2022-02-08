'use strict';

const game = document.querySelector('.game__game');

let logic = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
];

let isMove = true;


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
	do {
		x = randomNum();
		y = randomNum();
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
	isMove = true;
}

function createRandomBox() {
	const elem = locationBox(createBox('red', '2'));
	game.append(elem);

	console.log(logic);
}

createRandomBox();
createRandomBox();

function moveLeft() {
	isMove = false;
	for (let i = 0; i < 4; i++) {
		for (let j = 1; j < 4; j++) {
			if (logic[i][j]) {
				let k = j;
				while (k != 0) {
					if (logic[i][k - 1] === logic[i][k]) {
						logic[i][k - 1] = logic[i][k - 1] + logic[i][k];
						logic[i][k] = 0;
						setXY(document.querySelector(`#x${i}y${k}`), k - 1, i);
					}
					if (logic[i][k - 1] === 0) {
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

document.addEventListener('keydown', (e) => {
	if (e.key == 'ArrowLeft') {
		moveLeft();

		if (isMove) {
			createRandomBox();
			createRandomBox();
		}

		console.log(logic);
	}
});





























// disabling transition before loading page

window.addEventListener('load', () => {
	document.querySelector('#transition-none').removeAttribute('id');
});