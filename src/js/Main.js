
(function () {
	
	console.log('checkers game running...');

	var settings = {
		scope: 'game-stage',
		board: 'board',
		pieces: 'pieces'
	};

	var scope = document.getElementById(settings.scope),
		board = document.getElementsByClassName(settings.board)[0],
		pieces = document.getElementsByClassName(settings.pieces)[0];


	init = function () {
		create();
		attach();
		bind();
	};

	create = function () {
		var html = [];

		for (var i = 0; i < 8; i++) {
			html.push('<div class="row">');

			for (var j = 0; j < 8; j++) {
				var squareType = ((i + j) % 2) ? 'dark' : 'light';

				html.push('<span class="board__square ' + squareType + '">');

				if (squareType === 'dark' && i < 3) {
					html.push('<span class="board__piece" draggable="true">' + i + '-' + j + '</span>');
				}

				if (squareType === 'dark' && i > (8-4)) {
					html.push('<span class="board__piece" draggable="true">' + i + '-' + j + '</span>');
				}

				html.push('</span>');
			}

			html.push('</div>');
		}

		board.innerHTML = html.join('');
	};

	attach = function () {
		
	};

	bind = function () {
		
	};



	init();

})();
