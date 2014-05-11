/*
 * Checkers Game
 *
 * https://github.com/gneutzling/checkers-game
 *
 * Authored by Gabriel Neutzling
 * http://www.gneutzling.com
 * @gneutzling
 *
 * Copyright 2014, Gabriel Neutzling
 * Released under the MIT license
 *
 */

(function () {

	/**
	 * Set namespace and options default.
	 */
	var app = {},
		settings = {
			scope: 'game-stage',
			board: 'board',
			score: 'score'
		};


	/**
	 * Init is like a summary of process.
	 */
	app.init = function () {
		app.setup();
		app.build();
		app.attach();
		app.bind();  
	};


	/**
	 * Get elements from DOM and initialize some objects.
	 */
	app.setup = function () {
		app.scope = document.getElementById(settings.scope),
		app.board = app.scope.getElementsByClassName(settings.board)[0],
		app.score = app.scope.getElementsByClassName(settings.score)[0];
		app.squares = null;

		app.currentPiece = null;
		app.currentSquare = null;

		app.points = {
			playerOne: 0,
			playerTwo: 0
		};
	};


	/**
	 * Create HTML for board and pieces.
	 */
	app.build = function () {
		var html = [];

		for (var y = 0; y < 8; y++) {
			html.push('<div class="row">');

			for (var x = 0; x < 8; x++) {
				var squareType = ((y + x) % 2) ? 'dark' : 'light';

				html.push('<span class="board__square ' + squareType + '" data-position="' + y + '-' + x + '">');

				if (squareType === 'dark' && y > 4) {
					html.push('<span class="board__piece player-one" data-piece-type="player-one">' + y + '-' + x + '</span>');
				}

				if (squareType === 'dark' && y < 3) {
					html.push('<span class="board__piece player-two" data-piece-type="player-two">' + y + '-' + x + '</span>');
				}

				html.push('</span>');
			}

			html.push('</div>');
		}

		app.board.innerHTML = html.join('');
	};


	/**
	 * Setup after the game built.
	 */
	app.attach = function () {
		app.squares = document.getElementsByClassName('board__square dark');
	};


	/**
	 * General listeners.
	 */
	app.bind = function () {
		for (var i = 0, len = app.squares.length; i < len; i++) {
			app.squares[i].addEventListener('click', function () {
				app.move(this);
			}, false);
		}
	};


	/**
	 * Get the square's position in the board.
	 * @param  {object} element A DOM element.
	 * @return {object}         Position x and y of the element.
	 */
	app.getPosition = function (element) {
		var dataPos = element.getAttribute('data-position').split('-');

		return {
			x: dataPos[0],
			y: dataPos[1]
		};
	};


	/**
	 * Get the piece's type.
	 * @param  {object} element A DOM element.
	 * @return {String}         Type of the piece.
	 */
	app.getPieceType = function (element) {
		return element.getAttribute('data-piece-type');
	};









	/**
	 * @TODO: refactoring is needed.
	 */
	app.move = function (target) {
		var prevPiece = null,
			prevSquare = null,
			position = {
				prev: { x: null, y: null },
				curr: { x: null, y: null },
				diff: { x: null, y: null }
			};

		if (app.currentPiece != null) {
			// console.log('set position')

			position.prev.y = parseInt(app.currentSquare.getAttribute('data-position').split('-')[0]);
			position.prev.x = parseInt(app.currentSquare.getAttribute('data-position').split('-')[1]);

			position.curr.y = parseInt(target.getAttribute('data-position').split('-')[0]);
			position.curr.x = parseInt(target.getAttribute('data-position').split('-')[1]);

			position.diff.y = (position.prev.y - position.curr.y) < 0 ? (position.prev.y - position.curr.y) * -1 : position.prev.y - position.curr.y;
			position.diff.x = (position.prev.x - position.curr.x) < 0 ? (position.prev.x - position.curr.x) * -1 : position.prev.x - position.curr.x;
		}

		if (app.currentSquare != null) {
			app.currentSquare.classList.remove('selected');
		}

		prevPiece = app.currentPiece;
		prevSquare = app.currentSquare;

		app.currentSquare = target;
		app.currentPiece = target.getElementsByClassName('board__piece')[0];

		app.currentSquare.classList.add('selected');

		// ve se n tem nenhuma peça na casa, se tá em branco.
		if (app.currentPiece == null) {
			// console.log('casa disponível.');

			if (prevPiece != null) {
				// console.log('tem uma peça selecionada.');

				var pieceType = app.getPieceType(prevPiece);

				if (pieceType === 'player-one' && (position.curr.y < position.prev.y) || pieceType === 'player-two' && (position.curr.y > position.prev.y)) {

					if (position.diff.y === 1 && position.diff.x === 1) {
						// console.log('andou para frente.');
						app.currentSquare.appendChild(prevPiece);
					}
					else {
						if (position.diff.y === 2 && position.diff.x === 2) {
							var capturedPiece = null,
								capturedSquare = null,
								dataValue = null;

							if (pieceType === 'player-one') {
								if (position.curr.x > position.prev.x) {
									dataValue = (position.curr.y + 1) + '-' + (position.curr.x - 1);
								}
								else {
									dataValue = (position.curr.y + 1) + '-' + (position.curr.x + 1);
								}
								
								capturedSquare = app.board.querySelectorAll('[data-position="' + dataValue + '"]')[0];
								capturedPiece = capturedSquare.getElementsByClassName('board__piece')[0];

								if (capturedPiece && app.getPieceType(capturedPiece) === 'player-two') {
									capturedPiece.remove();									
									app.currentSquare.appendChild(prevPiece);
									app.points.playerOne++;

									// console.log('player-one comeu uma peça. score: ', app.points.playerOne);
								}
							}
							else {
								if (position.curr.x > position.prev.x) {
									dataValue = (position.curr.y - 1) + '-' + (position.curr.x - 1);
								}
								else {
									dataValue = (position.curr.y - 1) + '-' + (position.curr.x + 1);
								}
								
								capturedSquare = app.board.querySelectorAll('[data-position="' + dataValue + '"]')[0];
								capturedPiece = capturedSquare.getElementsByClassName('board__piece')[0];

								if (capturedPiece && app.getPieceType(capturedPiece) === 'player-one') {
									capturedPiece.remove();									
									app.currentSquare.appendChild(prevPiece);
									app.points.playerTwo++;

									// console.log('player-two comeu uma peça. score: ', app.points.playerTwo);
								}
							}
						}
					}
				}
			}
		}

	};



	/**
	 * Let's go =]
	 */
	app.init();

})();
