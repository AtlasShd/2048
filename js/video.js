'use strict';

const game = document.querySelector('.game__game');

let logic = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
];

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
	} while (logic[x][y]);
	elem.style.cssText = `left: ${(x * 25) + '%'}; top: ${(y * 25) + '%'};`;
	logic[x][y] = 2;
	return elem;
}

function randomNum() {
	const random = Math.floor(Math.random() * 4);
	return random === 100 ? 75 : random;
}

function createRandomBox() {
	const elem = locationBox(createBox('red', '2'));
	game.append(elem);
}

createRandomBox();
createRandomBox();





























// disabling transition before loading page

window.addEventListener('load', () => {
	document.querySelector('#transition-none').removeAttribute('id');
});