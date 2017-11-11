(function($) {
	'use strict';
	
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
	];

	//	Gets random or specific state object.
	function getRandomState(id) {
		if(id) {
			return states[id];
		}
		return states[Math.floor(Math.random()*states.length)];
	}

	// Removes state object from states array.
	function removeState(state) {
		states.splice(states.indexOf(state), 1);
	}

	// Extend strings to replace character at index.
	String.prototype.replaceAt = function(index, replacement) {
		return this.substr(0, index) + replacement + this.substr(index + replacement.length);
	}

	
	var hangmanGame = function() {
		this.currentState = {},
		this.playerName = '',
		this.animateFill = null,
		this.gameStarted = false,
		this.hangmanText = '',
		this.lives = 6,
		this.previousGuesses = [];

		this.lands = document.querySelectorAll('.land');
		this.hangmanTextElement = document.getElementById('hangman');
		this.takeaway = document.getElementById('takeaway');
		this.livesElement = document.getElementById('lives');

		this.playerName = prompt('Hello!! What should I call you?');
		this.playerName = this.playerName || 'Anonymous';
		this.takeaway.innerHTML = `Hi <strong>${this.playerName}</strong> Press any key to Start!! <i class="fa fa-play" aria-hidden="true"></i>`;

		// Fills color to random states on svg.
		hangmanGame.prototype.fillLand = () => {
			this.lands.forEach(function(path){
				path.classList.remove('fill');
			});
			document.getElementById(getRandomState().id).classList.add('fill');
		}

		hangmanGame.prototype.startGame = () => {
			this.gameStarted = true;
			this.currentState = getRandomState();
			if(this.currentState) {
				// Remove selected state so that a state is not repeated in single game.
				removeState(this.currentState);
				this.animateFill = setInterval(function() {
					this.fillLand();
				}.bind(this), 1000);

				this.hangmanTextElement.classList.remove('lost');
				this.hangmanTextElement.classList.remove('won');
				this.hangmanText = '';
				this.lives = 6;
				this.previousGuesses = [];
				this.livesElement.innerHTML = this.lives;
				this.takeaway.innerHTML = `Let\'s play Hangman!! <strong>${this.playerName}</strong>, Start typing letters. Guess the state of the USA`;
				this.hangmanText = this.currentState.name.replace(/[\s]/g, '  ').replace(/[a-z]/gi, '_ ');
				this.hangmanTextElement.innerHTML = this.hangmanText.replace(/\s\s/g, '&nbsp;&nbsp;');
				document.getElementById('sofarContainer').innerHTML = '<p>Letters guessed so far: <span id="sofar"></span></p>';
				return;
			}
			this.takeaway.innerHTML = `<strong>${this.playerName}</strong> You completed guessing all the states.`;
			this.hangmanText = 'Game Over';
			this.hangmanTextElement.innerHTML = this.hangmanText;
		}

		hangmanGame.prototype.registerGame = () => {
			document.addEventListener('keyup', this.handleKeyUp.bind(this));
		}

		hangmanGame.prototype.endGame = (isWin) => {
			document.getElementById(this.currentState.id).classList.add(isWin ? 'won' : 'lost');
			document.getElementById(this.currentState.id).classList.remove(isWin ? 'lost' : 'won');
			this.gameStarted = false;

			this.lands.forEach(function(path){
				path.classList.remove('fill');
			});
			this.hangmanTextElement.innerHTML = this.currentState.name;
			if(isWin) {
				this.takeaway.innerHTML = `${this.playerName} you are Awesome!<p>Enter any key to restart the Game</p>`;
				this.hangmanTextElement.classList.add('won');
				this.hangmanTextElement.classList.remove('lost');
			} else {
				this.takeaway.innerHTML = `Never mind try again!<p>Enter any key to restart the Game</p>`;
				this.hangmanTextElement.classList.add('lost');
				this.hangmanTextElement.classList.remove('won');
			}

			if(this.animateFill) {
				clearInterval(this.animateFill);
				this.animateFill = null;
			}
		}

		hangmanGame.prototype.handleKeyUp = (event) => {
			event.preventDefault();
			if(!this.gameStarted) {
				this.startGame();
				return;
			}
			// Determines which key was pressed.
			let userGuess = event.key;

			// When user guess is an alphabet
			if(userGuess.match(/^[a-z]$/i)) {
				// When user input is not already given.
				if(this.previousGuesses.indexOf(userGuess) === -1) {
					let isWin = false, regEx = null, counter = 0;
					regEx = (new RegExp(userGuess,'gi'));

					// Replace _ with actual letter in each occurance.
					let match = '';
					while ((match = regEx.exec(this.currentState.name))) {
						counter++;
						const actualIndex = 2 * match.index;
						this.hangmanText = this.hangmanText.replaceAt(actualIndex, match[0]);
					}

					this.hangmanTextElement.innerHTML = this.hangmanText.replace(/\s\s/g, '&nbsp;&nbsp;');
					this.takeaway.innerHTML = `<strong>${counter}</strong> match(es)${counter ? ' Sweet!!' : ''}`;

					// When there is no match
					// reduce lives
					if(!counter) {
						this.lives--;
						this.livesElement.innerHTML = this.lives;
					}

					this.previousGuesses.push(userGuess);
					document.getElementById('sofar').innerHTML = this.previousGuesses.join(', ');

					isWin = !this.hangmanText.match(/[_]/g);

					// When lives are 0 or user won the game
					// call end procedure
					if(!this.lives || isWin) {
						this.endGame(isWin);
					}	

					return;
				}

				this.takeaway.innerHTML = `<strong>${userGuess}</strong> is already entered!!`;
				return;
			}

			this.takeaway.innerHTML = `<strong>${userGuess === ' ' ? 'Space' : userGuess}</strong> is not valid, Google "How to play hangman?" !!`;
			return;
		}
	}


	var game = new hangmanGame();
	game.registerGame();

})(jQuery);
