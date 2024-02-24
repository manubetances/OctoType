const words = 'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.'.split(' ');
const wordCount = words.length;

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

	// Cursor Poss
	const cursor = document.getElementById('cursor');
	cursor.style.left = game.getBoundingClientRect().left + 2 + 'px';

}

document.getElementById('game').addEventListener('keyup', e => {
	const key = e.key;
	//
	const currentLetter = document.querySelector('.letter.current');
	//
	const currentWord = document.querySelector('.word.current');
	//
	const expected = currentLetter?.innerHTML || ' ';
	//
	const isLetter = key.length === 1 & key !== ' ';
	//
	const isSpace = key === ' ';
	//
	const isBackspace = key === 'Backspace';
	//
	const isFirstLetter = currentLetter === currentWord.firstChild;

	if (isLetter) {
		if (currentLetter) {
			addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
			removeClass(currentLetter, 'current');
			if (currentLetter.nextSibling) {
				addClass(currentLetter.nextSibling, 'current');
			}
		}
		//
		else {
			const incorrectLetter = document.createElement('span');
			incorrectLetter.innerHTML = key;
			incorrectLetter.className = 'letter incorrect extra';
			currentWord.appendChild(incorrectLetter);
		}
	}

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

	// Move Cursor
	const nextLetter = document.querySelector('.letter.current');
	const nextWord = document.querySelector('.word.current');
	const cursor = document.getElementById('cursor');
	//
	cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
	//
	cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';

});

newGame();