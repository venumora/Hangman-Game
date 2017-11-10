(function($) { 
	let states = [
	{ id:'US-AK', name: 'Alaska' },
	{ id:'US-AL', name: 'Alabama' },
	{ id:'US-AR', name: 'Arkansas' },
	{ id:'US-AZ', name: 'Arizona' },
	{ id:'US-CA', name: 'California' },
	{ id:'US-CO', name: 'Colorado' },
	{ id:'US-CT', name: 'Connecticut' },
	{ id:'US-DC', name: 'District Of Columbia' },
	{ id:'US-DE', name: 'Delaware' },
	{ id:'US-FL', name: 'Florida' },
	{ id:'US-GA', name: 'Georgia' },
	{ id:'US-HI', name: 'Hawaii' },
	{ id:'US-IA', name: 'Iowa' },
	{ id:'US-ID', name: 'Idaho' },
	{ id:'US-IL', name: 'Illinois' },
	{ id:'US-IN', name: 'Indiana' },
	{ id:'US-KS', name: 'Kansas' },
	{ id:'US-KY', name: 'Kentucky' },
	{ id:'US-LA', name: 'Louisiana' },
	{ id:'US-MA', name: 'Massachusetts' },
	{ id:'US-MD', name: 'Maryland' },
	{ id:'US-ME', name: 'Maine' },
	{ id:'US-MI', name: 'Michigan' },
	{ id:'US-MN', name: 'Minnesota' },
	{ id:'US-MO', name: 'Missouri' },
	{ id:'US-MS', name: 'Mississippi' },
	{ id:'US-MT', name: 'Montana' },
	{ id:'US-NC', name: 'North Carolina' },
	{ id:'US-ND', name: 'North Dakota' },
	{ id:'US-NE', name: 'Nebraska' },
	{ id:'US-NH', name: 'New Hampshire' },
	{ id:'US-NJ', name: 'New Jersey' },
	{ id:'US-NM', name: 'New Mexico' },
	{ id:'US-NV', name: 'Nevada' },
	{ id:'US-NY', name: 'New York' },
	{ id:'US-OH', name: 'Ohio' },
	{ id:'US-OK', name: 'Oklahoma' },
	{ id:'US-OR', name: 'Oregon' },
	{ id:'US-PA', name: 'Pennsylvania' },
	{ id:'US-RI', name: 'Rhode Island' },
	{ id:'US-SC', name: 'South Carolina' },
	{ id:'US-SD', name: 'South Dakota' },
	{ id:'US-TN', name: 'Tennessee' },
	{ id:'US-TX', name: 'Texas' },
	{ id:'US-UT', name: 'Utah' },
	{ id:'US-VA', name: 'Virginia' },
	{ id:'US-VT', name: 'Vermont' },
	{ id:'US-WA', name: 'Washington' },
	{ id:'US-WI', name: 'Wisconsin' },
	{ id:'US-WV', name: 'West Virginia' },
	{ id:'US-WY', name: 'Wyoming' }
	],
	currentState = {},
	playerName = '',
	animateFill = null,
	gameStarted = false,
	hangmanText = '',
	lives = 6,
	previousGuesses = [];

	const lands = document.querySelectorAll('.land'),
	hangmanTextElement = document.getElementById('hangman'),
	takeaway = document.getElementById('takeaway'),
	livesElement = document.getElementById('lives');

	String.prototype.replaceAt = function(index, replacement) {
    	return this.substr(0, index) + replacement + this.substr(index + replacement.length);
	}

	// playerName = prompt('Who are you?');

	function getRandomState(id) {
		if(id) {
			return states[id];
		}
		return states[Math.floor(Math.random()*states.length)];
	}

	function fillLand() {
		lands.forEach(function(path){
			path.classList.remove('fill');
		});
		document.getElementById(getRandomState().id).classList.add('fill');
	}

	function startGame() {
		gameStarted = true;
		animateFill = setInterval(function() {
				fillLand();
		}, 1000);
		hangmanTextElement.classList.remove('lost');
		hangmanTextElement.classList.remove('won');
		currentState = {};
		hangmanText = '';
		lives = 6;
		previousGuesses = [];
		currentState = getRandomState(7);
		livesElement.innerHTML = lives;
		takeaway.innerHTML = `Let\'s play Hangman!! ${playerName || 'Anonymous'}. Guess the state of the USA`;
		hangmanText = currentState.name.replace(/[\s]/g, '  ').replace(/[a-z]/gi, '_ ');
		hangmanTextElement.innerHTML = hangmanText.replace(/\s\s/g, '&nbsp;&nbsp;');
		document.getElementById('sofarContainer').innerHTML = '<p>Letters guessed so far: <span id="sofar"></span></p>';
	}

	function endGame(isWin) {
		document.getElementById(currentState.id).classList.add(isWin ? 'won' : 'lost');
		lands.forEach(function(path){
			path.classList.remove('fill');
		});
		hangmanTextElement.innerHTML = currentState.name;
		if(isWin) {
			takeaway.innerHTML = `You got it right!<p>Enter any key to restart the Game</p>`;
			hangmanTextElement.classList.add('won');
		} else {
			takeaway.innerHTML = `Never mind try again!<p>Enter any key to restart the Game</p>`;
			hangmanTextElement.classList.add('lost');
		}

		if(animateFill) {
			clearInterval(animateFill);
			animateFill = null;
		}

		gameStarted = false;
	}

	document.addEventListener('keyup', (event) => {
		if(!gameStarted) {
			startGame();
			return;
		}
		// Determines which key was pressed.
		let userGuess = event.key;
		if(userGuess.match(/^[a-z]$/i)) {
			if(previousGuesses.indexOf(userGuess) === -1) {
				let isWin = false, regEx = null, counter = 0;
				regEx = (new RegExp(userGuess,'gi'));

				while ((match = regEx.exec(currentState.name))) {
					counter++;
					const actualIndex = 2 * match.index;
					hangmanText = hangmanText.replaceAt(actualIndex, match[0]);
				}

				hangmanTextElement.innerHTML = hangmanText.replace(/\s\s/g, '&nbsp;&nbsp;');
				takeaway.innerHTML = `<strong>${counter}</strong> match(es)${counter ? ' Sweet!!' : ''}`;

				if(!counter) {
					lives--;
					livesElement.innerHTML = lives;
				}

				previousGuesses.push(userGuess);
				document.getElementById('sofar').innerHTML = previousGuesses.join(', ');

				isWin = !hangmanText.match(/[_]/g);

				if(!lives || isWin) {
					endGame(isWin);
		  		}

		  		return;
	  		}

	  		takeaway.innerHTML = `<strong>${userGuess}</strong> is already entered!!`;
		  	return;
	  	}

	  	takeaway.innerHTML = `<strong>${userGuess === ' ' ? 'Space' : userGuess}</strong> is not valid, Google "How to play hangman?" !!`;
		return;
	});

})(jQuery);
