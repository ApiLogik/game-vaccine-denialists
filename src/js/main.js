const onLoadGlobal = () => {
	const gameScreen = document.querySelector('.game-screen');
	const btnIniciar = document.querySelector('#btn-ini');
	const startOptions = document.querySelector('.start-options');
	const countHits = document.querySelector('.panel span');
	const resultScreen = document.querySelector('.result');
	const clock = document.querySelector('#timer');
	let counter = 0;
	let gameOn = false;
	let paused = false;

	//Mobile orientation------------
	if (window.innerHeight > window.innerWidth) {
		startOptions.style.display = 'none';
		document.querySelector('.panel').style.display = 'none';
		document.querySelector('.orient').style.display = 'block';
	}

	window.addEventListener('orientationchange', () => location.reload());

	//Auxiliary functions---------------
	const preLoadImages = () => {
		const target1 = new Image();
		const target2 = new Image();
		const target3 = new Image();
		const targetHit1 = new Image();
		const targetHit2 = new Image();
		const targetHit3 = new Image();
		const cloroqImg = new Image();
		const serynge = new Image();
		const loadedImages = [[target1, target2, target3], [targetHit1, targetHit2, targetHit3], cloroqImg, serynge];

		cloroqImg.src = 'assets/media/cloroq_alt.png';
		serynge.src = 'assets/media/seringa_icone.png';
		
		for (let i = 0; i <= 2; i++) {
			loadedImages[0][i].src = `assets/media/negac${i+1}.png`;
			loadedImages[1][i].src = `assets/media/negac${i+1}_hit.png`;
		}

		return loadedImages;
	}

	const loadedImages = preLoadImages();//Array w/ pre-loaded imgs

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

	//MAIN FUNCTIONS------------------
	const startTimer = () => {
		let min = 0;
		let sec = 60;

		const changeTimer = () => {
			min = 0;
			sec--;
			printTimer(min, sec);
		}

		return new Promise((resolve, reject) => {
			const timerInterval = setInterval(() => {
				if (paused) return;
				changeTimer();
				if (min === 0 && sec === 0) {
					clearInterval(timerInterval);
					resolve(true);
				}
			}, 1000)
		})
	}
	
	//target--------------------------------------
	const createTargets = () => {
		document.querySelectorAll('.target').forEach(thisImg => thisImg.remove());
		let randomNum = Math.floor(Math.random() * 3);
		let target = loadedImages[0][randomNum];
		let targetHit = loadedImages[1][randomNum];

		gameScreen.appendChild(target);
		gameScreen.appendChild(targetHit);
		target.style.display = 'block';
		targetHit.style.display = 'none';

		let maxLeft = target.parentElement.offsetWidth - 100;
		let maxTop = target.parentElement.offsetHeight - 100;
		let randomLeftPos = Math.floor(Math.random() * (maxLeft - 5) + 5);
		let randomTopPos = Math.floor(Math.random() * (maxTop - 5) + 5);
		let randomHeight = Math.floor(Math.random() * (90 - 50) + 50);
		let targets = [target, targetHit];

		targets.forEach(thisTarget => {
			thisTarget.className = 'target';
			thisTarget.style.left = randomLeftPos + 'px';
			thisTarget.style.top = randomTopPos + 'px';
			thisTarget.style.width = (randomHeight * 0.8) + 'px';
			thisTarget.style.height = randomHeight + 'px';
		})

		return targets;
	}

	const createCloroqText = () => {
		let cloroqTxt = gameScreen.appendChild(document.createElement('h1'));
		cloroqTxt.style.color = 'rgb(218, 52, 52)';
		cloroqTxt.style.fontSize = '60px';
		cloroqTxt.innerHTML = 'CLOROQUINA!';

		return cloroqTxt;
	}

	const createCloroq = (leftPos, topPos) => {
		let cloroqTxt = createCloroqText();
		let cloroq = loadedImages[2];

		cloroq.className = 'target cloroq';
		gameScreen.appendChild(cloroq);
		cloroq.style.left = leftPos;
		cloroq.style.top = topPos;
		cloroq.style.width = 51 + 'px';
		cloroq.style.height = 100 + 'px';
		cloroq.className += ' animate';

		setTimeout(() => { cloroq.remove() }, 850);
		setTimeout(() => { cloroqTxt.remove() }, 1100);
	}

	//Cursor---------------------
	const createSerynge = (leftPos, topPos) => {
		let serynge = loadedImages[3];
		let left = leftPos + 35;
		let top = topPos + 30;

		serynge.className = 'serynge';
		gameScreen.appendChild(serynge);
		serynge.style.left = left + 'px'
		serynge.style.top = top + 'px';
		serynge.style.width = 38 + 'px';
		serynge.style.height = 55 + 'px';

		setTimeout(() => { serynge.remove() }, 300);
	}

	//Start / End-----------------------------
	const endGame = async () => await startTimer();

	const runGame = level => {
		let targetClicked = false;
		let speed;
		gameOn = true;

		if (level === 'Fácil') speed = 1300;
		if (level === 'Normal') speed = 1000;
		if (level === 'Difícil') speed = 800;

		const gameInterval = setInterval(() => {
			if (paused) return;

			const targets = createTargets();

			targets[0].addEventListener('click', e => {
				if (targetClicked === false) {
					targets[0].style.display = 'none';
					targets[1].style.display = 'block';
					counter += 1;
					targetClicked = true;

					if (navigator.maxTouchPoints !== 0) {
						createSerynge(targets[1].offsetLeft, targets[1].offsetTop);
					}

					if (counter > 1 && counter % 10 === 0) {
						createCloroq(targets[1].style.left, targets[1].style.top);
					}

					setTimeout(() => {
						targets[1].style.display = 'none';
						targetClicked = false;
					}, speed * 0.8);
				}
			})
			
			countHits.innerHTML = counter;
		}, speed)

		endGame().then(resolve => {
			if (resolve) {
				clearInterval(gameInterval);
				document.querySelector('.target').remove();
				setTimeout(() => { showResult(counter, level); }, speed);
			}
		})
	}

	const newGame = () => {
		paused = true
		const alert = document.querySelector('.alert');
		alert.style.display = 'block';
		document.querySelector('#yes').addEventListener('click', () => resetGame());
		document.querySelector('#no').addEventListener('click', () => {
			alert.style.display = 'none';
			paused = false;
		})
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
