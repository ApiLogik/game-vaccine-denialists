const onLoadGlobal = () => {
	const gameScreen = document.querySelector('.game-screen');
	const btnIniciar = document.querySelector('#btn-ini');
	const startOptions = document.querySelector('.start-options');
	const countHits = document.querySelector('.panel span');
	const resultScreen = document.querySelector('.result');
	const clock = document.querySelector('#timer');
	let counter = 0;
	let gameOn = false;

	if(window.innerHeight > window.innerWidth) {
		startOptions.style.display = 'none';
		document.querySelector('.panel').style.display = 'none';
		document.querySelector('.orient').style.display = 'block';
	}

	window.addEventListener('orientationchange', () => location.reload());

	const addZeroLeft = number => number >= 10 ? number : `0${number}`;

	const printTimer = (min, sec) => clock.innerHTML = `${addZeroLeft(min)}:${addZeroLeft(sec)}`;
	
	const clearTimer = () => printTimer(1, 0);

	const showResult = (counter, level) => {
		let pointsSpan = document.querySelector('#points');
		let showLevel = document.querySelector('#end-level');
		pointsSpan.innerHTML = counter;
		showLevel.innerHTML = level;
		resultScreen.style.display = 'block';
	}

	const resetGame = () => {
		gameOn = false;
		clearTimer();
		location.reload();
	}

	const startTimer = () => {
		let min = 1;
		let sec = 60;

		const changeTimer = () => {
			min = 0;
			sec--;
			printTimer(min, sec);
		}
		
		return new Promise((resolve, reject) => {
			const timerInterval = setInterval(() => {
				changeTimer();
				if (min === 0 && sec === 0) {
					clearInterval(timerInterval);
					resolve(true);
				}
			}, 1000)
		})
	}

	//target--------------------------------------
	const createTarget = num => {
		let target = document.createElement('div');
		target.className = `target ini${num.toString()}`;
		gameScreen.appendChild(target);
		let maxLeft = target.parentElement.offsetWidth - 100;
		let maxTop = target.parentElement.offsetHeight - 100;
		let randomLeftPos = Math.floor(Math.random() * (maxLeft - 5) + 5);
		let randomTopPos = Math.floor(Math.random() * (maxTop - 5) + 5);
		let randomWidth = Math.floor(Math.random() * (100 - 50) + 50);
		target.style.left = randomLeftPos + 'px';
		target.style.top = randomTopPos + 'px';
		target.style.width = randomWidth + 'px';
		target.style.height = randomWidth + 'px';

		return target;
	}

	const createCloroqText = () => {
		let cloroqTxt = gameScreen.appendChild(document.createElement('h1'));
		cloroqTxt.style.color = 'rgb(211, 53, 53)';
		cloroqTxt.style.fontSize = '60px';
		cloroqTxt.innerHTML = 'CLOROQUINA!';

		return cloroqTxt;
	}

	const createCloroq = (leftPos, topPos) => {
		let cloroqTxt = createCloroqText();
		let target2 = document.createElement('div');

		target2.className = 'target cloroq';
		gameScreen.appendChild(target2);
		target2.style.left = leftPos;
		target2.style.top = topPos;
		target2.style.width = 15 + '%';
		target2.style.height = 15 + '%';
		target2.className += ' animate';

		setTimeout(() => { target2.remove() }, 750);
		setTimeout(() => { cloroqTxt.remove() }, 1100);
	}

	const createSerynge = (leftPos, topPos) => {
		let serynge = document.createElement('div');
		let left = leftPos - 10;
		let top = topPos + 30;
		
		serynge.className = 'serynge';
		gameScreen.appendChild(serynge);
		serynge.style.left = left + 'px'
		serynge.style.top = top + 'px';
		serynge.style.width = 20 + '%';
		serynge.style.height = 20 + '%';

		setTimeout(() => { serynge.remove() }, 200);
	}

	const endGame = async () => await startTimer();

	const runGame = level => {
		let targetClicked = false;
		gameOn = true;
		let speed;
		if (level === 'Pazuello') speed = 1300;
		if (level === 'Normal') speed = 1000;
		if (level === 'Difícil') speed = 800;

		const gameInterval = setInterval(() => {
			let num = Math.floor(Math.random() * (4 - 1) + 1);
			let target = createTarget(num);
			target.addEventListener('click', e => {
				if(navigator.maxTouchPoints !== 0){
					createSerynge(target.offsetLeft, target.offsetTop);
				}

				if (targetClicked === false) {
					e.target.className = `target hit${num.toString()}`;
					counter += 1;
					targetClicked = true;
					if (counter > 1 && counter % 10 === 0) {
						createCloroq(target.style.left, target.style.top);
					}
					
					setTimeout(() => {
						target.remove();
						targetClicked = false;
					}, speed * 0.8)
				}
			})

			setTimeout(() => target.remove(), speed);
			countHits.innerHTML = counter;
			
		}, speed)

		endGame().then(resolve => {
			if (resolve) {
				clearInterval(gameInterval);
				setTimeout(() => { showResult(counter, level); }, 1000);
			}
		})
	}

	const newGame = () => {
		const alert = document.querySelector('.alert');
		alert.style.display = 'block';
		document.querySelector('#yes').addEventListener('click', () => resetGame());
		document.querySelector('#no').addEventListener('click', () => alert.style.display = 'none');
	}

	const checkLevel = () => {
		let level;
		const radios = document.querySelectorAll('.level');
		radios.forEach(thisRadio => {
			if (thisRadio.checked) level = thisRadio.value;
		})
		return level;
	}

	btnIniciar.addEventListener('click', e => {
		let level = checkLevel();

		resultScreen.style.display = 'none';
		counter = 0;

		if (level !== undefined) {
			startOptions.style.display = 'none';
			gameOn ? newGame() : runGame(level);
		} else {
			e.preventDefault();
			document.querySelector('#choose-level').innerHTML = 'Escolha o nível!';
		}
	})

	clearTimer();
}

onLoadGlobal();
