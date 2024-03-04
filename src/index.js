const words = 'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.'.split(' ');
const wordCount = words.length;
const gameTime = 30 * 1000;
window.timer = null;
window.gameStart = null;

function addClass(el, name) {
	el.className += ' ' + name;
}

function removeClass(el, name) {
	el.className = el.className.replace(name, '');
}

function randomWord() {
  const randomIndex = Math.ceil(Math.random() * wordCount);
  return words[randomIndex - 1];
}

//
function formatWord(word) {
  return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

//
function newGame() {
  document.getElementById('textArea').innerHTML = '';

  for (let i = 0; i < 200; i++) {
    document.getElementById('textArea').innerHTML += formatWord(randomWord());
  }
  addClass(document.querySelector('.word'), 'current');
  addClass(document.querySelector('.letter'), 'current');
  document.getElementById('info').innerHTML = (gameTime / 1000) + '';
  window.timer = null;

	// Cursor Poss
	const cursor = document.getElementById('cursor');
	cursor.style.left = game.getBoundingClientRect().left + 2 + 'px';

}

// WPM
function getWPM() {
	const words = [...document.querySelectorAll('.word')];
	const lastTypedWord = document.querySelector('.word.current');
	const lastTypedWordIndex = words.indexOf(lastTypedWord);
	const typedWords = words.slice(0, lastTypedWordIndex);
	// Check correct words
	const correctWords = typedWords.filter(word => {
		const letters = [...word.children];
		const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
		const correctLetters = letters.filter(letter => letter.className.includes('correct'));
		return incorrectLetters.length === 0 && correctLetters.length === letters.length;
	});
	return correctWords.length / gameTime * 60000;
}

function gameOver() {
	clearInterval(window.timer);
	addClass(document.getElementById('game'), 'over');
	const result = getWPM()
	document.getElementById('info').innerHTML = `WPM: ${result}`;
}

document.getElementById('game').addEventListener('keyup', e => {
	const key = e.key;
	//	Assign currecnt letter to current letter
	const currentLetter = document.querySelector('.letter.current');
	//	Assign currecnt word to current word
	const currentWord = document.querySelector('.word.current');
	const expected = currentLetter?.innerHTML || ' ';
	const isLetter = key.length === 1 & key !== ' ';
	//	Let the game know when user inputs space (empty string)
	const isSpace = key === ' ';
	//	Let game know when user hits backspace
	const isBackspace = key === 'Backspace';
	//	Define the first letter of a word as the first child of the current word
	//	We do this since every letter is in its own div
	const isFirstLetter = currentLetter === currentWord.firstChild;

	if (document.querySelector('#game.over')) {
		return
	}

	// Game Timer
	if (!window.timer && isLetter) {
		window.timer = setInterval(() => {
			if (!window.gameStart) {
				window.gameStart = (new Date()).getTime();
			}
			const currentTime = (new Date()).getTime();
			// Miliseconds passed after timer started
			const msPassed = currentTime - window.gameStart;
			// Seconds passed (ms / 1000)
			const sPassed = Math.round(msPassed / 1000);
			// Seconds left after counter started
			const sLeft = (gameTime / 1000) - sPassed;
			// When timer is less or equal to 0, run gameOver
			if (sLeft <= 0) {
				gameOver();
				return;
			}
			// Modify timer in app
			document.getElementById('info').innerHTML = sLeft + '';
		}, 1000);
	}

	if (isLetter) {
		if (currentLetter) {
			addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
			removeClass(currentLetter, 'current');
			if (currentLetter.nextSibling) {
				addClass(currentLetter.nextSibling, 'current');
			}
		}
		//	Mark wrong letters typed and add extra letters if the user keeps typing
		else {
			const incorrectLetter = document.createElement('span');
			incorrectLetter.innerHTML = key;
			incorrectLetter.className = 'letter incorrect extra';
			currentWord.appendChild(incorrectLetter);
		}
	}

	//	Manage Space Events
	if (isSpace) {
		if (expected !== ' ') {
			const lettersInvalidated = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
			lettersInvalidated.forEach(letter => {
				addClass(letter, 'incorrect');
			})
		}
		removeClass(currentWord, 'current');
		addClass(currentWord.nextSibling, 'current');
		if (currentLetter) {
			removeClass(currentLetter, 'current');
		}
		addClass(currentWord.nextSibling.firstChild, 'current');
	}

	// Manage Backspace Events
	if (isBackspace) {
		if (currentLetter && isFirstLetter) {
			// make previous word current, last letter current
			removeClass(currentWord, 'current');
			addClass(currentWord.previousSibling, 'current');
			removeClass(currentLetter, 'current');
			addClass(currentWord.previousSibling.lastChild, 'current');
			removeClass(currentWord.previousSibling.lastChild, 'incorrect');
			removeClass(currentWord.previousSibling.lastChild, 'correct');
		}
		if (currentLetter && !isFirstLetter) {
			// move back one letter, invalidate letter
			removeClass(currentLetter, 'current');
			addClass(currentLetter.previousSibling, 'current');
			removeClass(currentLetter.previousSibling, 'incorrect');
			removeClass(currentLetter.previousSibling, 'correct');
		}
		if (!currentLetter) {
			addClass(currentWord.lastChild, 'current');
			removeClass(currentWord.lastChild, 'incorrect');
			removeClass(currentWord.lastChild, 'correct');
		}
	}

	// Scroll through the text
	if (currentWord.getBoundingClientRect().top > 250) {
		const words = document.getElementById('words');
		const margin = parseInt(words.style.marginTop || '0px');
		words.style.marginTop = (margin - 35) + 'px';
	}

	// Move Cursor
	const nextLetter = document.querySelector('.letter.current');
	const nextWord = document.querySelector('.word.current');
	const cursor = document.getElementById('cursor');
	//	Move the cursor (x axis) to the next word or letter
	cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
	//	Move the cursor (y axis) to the next word or letter
	cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';

});

document.getElementById('newGameButton').addEventListener('click', () => {
	gameOver();
	newGame();
});

newGame();