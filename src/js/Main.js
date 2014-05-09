
(function () {
	console.log('checkers game running...');

	var app = {},
		settings = {
			scope: 'game-stage',
			board: 'board',
			pieces: 'pieces'
		};

	app.init = function () {
		app.setup();
		app.build();
		app.attach();
		app.bind();  
	};

	app.setup = function () {
		app.scope = document.getElementById(settings.scope),
		app.board = app.scope.getElementsByClassName(settings.board)[0],
		app.pieces = app.scope.getElementsByClassName(settings.pieces)[0];
		app.squares = null;

		app.currentPiece = null;
		app.currentSquare = null;

		app.points = {
			playerOne: 0,
			playerTwo: 0
		};
	};

	app.build = function () {
		var html = [];

		for (var i = 0; i < 8; i++) {
			html.push('<div class="row">');

			for (var j = 0; j < 8; j++) {
				var squareType = ((i + j) % 2) ? 'dark' : 'light';

				html.push('<span class="board__square ' + squareType + '" data-position="' + i + '-' + j + '">');

				// coloca as peças no quadrado preto para o player one.
				// o player one é usuário, que possui as peçar brancas.
				// o usuário possui as peças brancas pq ele é o primeiro a jogar (peças brancas começam).
				if (squareType === 'dark' && i > 4) {
					html.push('<span class="board__piece player-one" data-piece-type="player-one">' + i + '-' + j + '</span>');
				}

				if (squareType === 'dark' && i < 3) {
					html.push('<span class="board__piece player-two" data-piece-type="player-two">' + i + '-' + j + '</span>');
				}

				html.push('</span>');
			}

			html.push('</div>');
		}

		app.board.innerHTML = html.join('');
	};

	app.attach = function () {
		app.squares = document.getElementsByClassName('board__square dark');
	};

	app.bind = function () {
		for (var i = 0, len = app.squares.length; i < len; i++) {
			app.squares[i].addEventListener('click', function () {
				app.move(this);
			}, false);
		}
	};

	app.move = function (target) {
		var prevPiece = null,
			prevSquare = null,
			position = {
				prev: { x: null, y: null },
				curr: { x: null, y: null },
				diff: { x: null, y: null }
			};

		if (app.currentPiece != null) {
			console.log('set position')

			position.prev.x = app.currentSquare.getAttribute('data-position').split('-')[0];
			position.prev.y = app.currentSquare.getAttribute('data-position').split('-')[1];

			position.curr.x = target.getAttribute('data-position').split('-')[0];
			position.curr.y = target.getAttribute('data-position').split('-')[1];

			position.diff.x = (position.prev.x - position.curr.x) < 0 ? (position.prev.x - position.curr.x) * -1 : position.prev.x - position.curr.x;
			position.diff.y = (position.prev.y - position.curr.y) < 0 ? (position.prev.y - position.curr.y) * -1 : position.prev.y - position.curr.y;
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
			console.log('casa disponível.');

			if (prevPiece != null) {
				console.log('tem uma peça selecionada.');

				var pieceType = prevPiece.getAttribute('data-piece-type');

				if (pieceType == 'player-one' && (position.curr.x < position.prev.x) || pieceType == 'player-two' && (position.curr.x > position.prev.x)) {
					console.log(pieceType + ' ta andando pra frente.');

					if (position.diff.x === 1 && position.diff.y === 1) {
						console.log('andou para frente.');
						app.currentSquare.appendChild(prevPiece);
					}
					else {
						if (position.diff.x === 2 && position.diff.y === 2) {
							console.log('comeu alguém.');
						}
					}
				}
			}
		}

	};

	app.getPosition = function (element) {
		var dataPos = element.getAttribute('data-position').split('-');

		return {
			x: dataPos[0],
			y: dataPos[1]
		};
	};



	app.init();

})();
