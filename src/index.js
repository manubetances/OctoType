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

});

newGame();