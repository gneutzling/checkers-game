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
(function() {
    /**
	 * Set namespace and options default.
	 */
    var app = {}, settings = {
        scope: "game-stage",
        board: "board",
        score: {
            element: "score",
            playerOne: "score__player-one",
            playerTwo: "score__player-two"
        },
        player: {
            one: {
                name: "Player One"
            },
            two: {
                name: "Player Two"
            }
        }
    };
    /**
	 * Init is like a summary of process.
	 */
    app.init = function() {
        app.setup();
        app.build();
        app.attach();
        // app.updatePlayer();
        // app.updateScore();
        app.bind();
    };
    /**
	 * Get elements from DOM and initialize some objects.
	 */
    app.setup = function() {
        app.scope = document.getElementById(settings.scope), app.board = app.scope.getElementsByClassName(settings.board)[0];
    };
    /**
	 * Create HTML for board and pieces.
	 */
    app.build = function() {
        var html = [];
        for (var y = 0; y < 8; y++) {
            html.push('<div class="row">');
            for (var x = 0; x < 8; x++) {
                var squareType = (y + x) % 2 ? "dark" : "light";
                html.push('<span class="board__square ' + squareType + '" data-position="' + y + "-" + x + '">');
                if (squareType === "dark" && y > 4) {
                    html.push('<span class="board__piece player-one" data-piece-type="player-one"></span>');
                }
                if (squareType === "dark" && y < 3) {
                    html.push('<span class="board__piece player-two" data-piece-type="player-two"></span>');
                }
                html.push("</span>");
            }
            html.push("</div>");
        }
        app.board.innerHTML = html.join("");
    };
    /**
	 * Setup after the game built.
	 */
    app.attach = function() {
        app.squares = document.getElementsByClassName("board__square dark");
        app.score = app.scope.getElementsByClassName(settings.score.element)[0];
        app.selectedPiece = null;
        app.selectedSquare = null;
        app.selectedDestiny = null;
        app.possibilities = [];
        app.player = {
            one: {
                score: 0
            },
            two: {
                score: 0
            }
        };
        app.isPlayerOne = true;
    };
    /**
	 * General listeners.
	 */
    app.bind = function() {
        for (var i = 0, len = app.squares.length; i < len; i++) {
            app.squares[i].addEventListener("click", function() {
                app.move(this);
            }, false);
        }
    };
    /**
	 * Setup the process of current match.
	 * @param  {object} target DOM element clicked.
	 */
    app.move = function(target) {
        if (app.selectedPiece == null) {
            app.choosePiece(target);
            app.originPosition = app.getPosition(target);
        } else {
            if (!app.getPiece(target)) {
                app.selectedDestiny = target;
                app.destinyPosition = app.getPosition(target);
                app.jump();
                app.resetVars();
                return false;
            } else {
                app.showMessage("Você deve escolher um destino válido.");
                app.resetVars();
            }
        }
    };
    /**
	 * Select a piece to the match.
	 * @param  {object} target The selected square.
	 */
    app.choosePiece = function(square) {
        var pieceType = null, piece = app.getPiece(square);
        if (piece) {
            app.selectedPiece = piece;
            pieceType = app.getPieceType(piece);
            if (app.isValidPiece(pieceType)) {
                app.selectedSquare = square;
                app.selectedPiece.classList.add("selected");
            } else {
                app.selectedPiece = null;
                app.showMessage("Você não pode jogar com uma peça do adversário.");
                return false;
            }
        } else {
            app.showMessage("Você deve escolher uma peça antes do destino.");
        }
    };
    /**
	 * Check if there is piece in the square.
	 * @param  {object}  square DOM element
	 * @return {Boolean}        true if there is piece or false if not.
	 */
    app.hasPiece = function(square) {
        app.getPiece(square);
    };
    // pega a peça e retorna a mesma ou false.
    app.getPiece = function(square) {
        return square.getElementsByClassName("board__piece")[0] || false;
    };
    // verifica se a peça selecionada é do jogador.
    app.isValidPiece = function(pieceType, isToCapture) {
        var captureFlag = isToCapture || false;
        if (captureFlag) {
            return app.isPlayerOne && pieceType === "player-two" || !app.isPlayerOne && pieceType === "player-one" ? true : false;
        } else {
            return app.isPlayerOne && pieceType === "player-one" || !app.isPlayerOne && pieceType === "player-two" ? true : false;
        }
    };
    /**
	 * Check if selected piece is king.
	 * @param  {object}  piece DOM element.
	 * @return {Boolean}       True if is king or false if not.
	 */
    app.isKing = function(piece) {
        return piece.classList.contains("king");
    };
    /**
	 * Set piece like king.
	 * @param {object} piece DOM element.
	 */
    app.setKing = function(piece) {
        piece.classList.add("king");
    };
    // configura cordenadas possiveis
    app.setupPosibilities = function() {
        var position = app.getPosition(app.selectedDestiny);
        if (app.isKing(app.selectedPiece)) {
            app.possibilities = [ {
                y: position.y - 1,
                x: position.x + 1
            }, {
                y: position.y - 1,
                x: position.x - 1
            }, {
                y: position.y + 1,
                x: position.x + 1
            }, {
                y: position.y + 1,
                x: position.x - 1
            } ];
        } else {
            if (app.isPlayerOne) {
                app.possibilities = [ {
                    y: position.y - 1,
                    x: position.x + 1
                }, {
                    y: position.y - 1,
                    x: position.x - 1
                } ];
            } else {
                app.possibilities = [ {
                    y: position.y + 1,
                    x: position.x + 1
                }, {
                    y: position.y + 1,
                    x: position.x - 1
                } ];
            }
        }
    };
    /**
	 * Reset global variables.
	 */
    app.resetVars = function() {
        app.selectedPiece.classList.remove("selected");
        app.selectedPiece = null;
        app.selectedSquare = null;
        app.selectedDestiny = null;
        app.possibilities = [];
    };
    app.isValidMovement = function(origin, destiny) {
        return app.isPlayerOne && destiny.y < origin.y || !app.isPlayerOne && destiny.y > origin.y ? true : false;
    };
    /**
	 * Move the piece to the destiny. If has capture, remove.
	 * @param  {object} captured DOM element to remove or false.
	 */
    app.movePiece = function(captured) {
        var destinyPos = app.getPosition(app.selectedDestiny);
        app.selectedDestiny.appendChild(app.selectedPiece);
        if (captured) {
            captured.remove();
        }
        if (!app.isKing(app.selectedPiece) && destinyPos.y === 0 || destinyPos.y === 7) {
            app.setKing(app.selectedPiece);
        }
    };
    app.getElementSquare = function(posY, posX) {
        var position = posY + "-" + posX;
        return app.board.querySelectorAll('[data-position="' + position + '"]')[0] || false;
    };
    /**
	 * Get the captured piece.
	 * @todo: refactoring is needed.
	 * @return {object} DOM element or false.
	 */
    app.getCaptured = function() {
        var pos = {
            x: null,
            y: null
        };
        pos.y = app.originPosition.y > app.destinyPosition.y ? app.destinyPosition.y + 1 : app.destinyPosition.y - 1;
        pos.x = app.originPosition.x > app.destinyPosition.x ? app.destinyPosition.x + 1 : app.destinyPosition.x - 1;
        return app.getPiece(app.getElementSquare(pos.y, pos.x));
    };
    /**
	 * Change the player's turn.
	 */
    app.changePlayer = function() {
        app.isPlayerOne = !app.isPlayerOne;
    };
    app.jump = function() {
        var squarePos = app.getPosition(app.selectedSquare), destinyPos = app.getPosition(app.selectedDestiny), diff = {
            y: Math.abs(squarePos.y - destinyPos.y),
            x: Math.abs(squarePos.x - destinyPos.x)
        };
        if (app.isKing(app.selectedPiece) || app.isValidMovement(squarePos, destinyPos)) {
            if (diff.x === 1 && diff.y === 1) {
                app.movePiece();
                app.changePlayer();
            } else {
                if (diff.x === 2 && diff.y === 2) {
                    var capturedPiece = app.getCaptured();
                    if (capturedPiece && !app.isValidPiece(app.getPieceType(capturedPiece))) {
                        app.movePiece(capturedPiece);
                        app.updateScore();
                        app.setupPosibilities();
                        app.verifyNewCapture();
                    } else {
                        app.showMessage("Você não pode capturar uma peça sua.");
                    }
                } else {
                    app.showMessage("Jogada inválida.");
                }
            }
        } else {
            app.showMessage("Você deve andar para frente.");
        }
    };
    /**
	 * Get the square's position in the board.
	 * @param  {object} element A DOM element.
	 * @return {object}         Position x and y of the element.
	 */
    app.getPosition = function(element) {
        var dataPos = element.getAttribute("data-position").split("-");
        return {
            y: parseInt(dataPos[0]),
            x: parseInt(dataPos[1])
        };
    };
    /**
	 * Get the piece's type.
	 * @param  {object} element A DOM element.
	 * @return {String}         Type of the piece.
	 */
    app.getPieceType = function(element) {
        return element.getAttribute("data-piece-type");
    };
    /**
	 * @todo: Exibir um feedback para o usuário.
	 */
    app.showMessage = function(message) {
        console.log("### ", message);
    };
    // ================================
    // ================================
    // ================================
    /**
	 * Configure the coordinates.
	 */
    // app.setMatchPosition = function () {
    // 	app.position.piece.y = app.getPosition(app.selectedSquare).y;
    // 	app.position.piece.x = app.getPosition(app.selectedSquare).x;
    // 	app.position.destiny.y = app.getPosition(app.selectedDestiny).y;
    // 	app.position.destiny.x = app.getPosition(app.selectedDestiny).x;
    // 	app.position.diff.y = (app.position.piece.y - app.position.destiny.y) < 0 ? (app.position.piece.y - app.position.destiny.y) * -1 : app.position.piece.y - app.position.destiny.y;
    // 	app.position.diff.x = (app.position.piece.x - app.position.destiny.x) < 0 ? (app.position.piece.x - app.position.destiny.x) * -1 : app.position.piece.x - app.position.destiny.x;
    // };
    /**
	 * The main rules of the game
	 * 1 x 1 = a simple movement.
	 * 2 x 2 = a movement with capture.
	 */
    // app.checkMove = function () {
    // 	var isSimpleMovement = ((app.isPlayerOne && app.position.destiny.y < app.position.piece.y) || (!app.isPlayerOne && app.position.destiny.y > app.position.piece.y)) ? true : false;
    // 	if (app.isKing(app.selectedPiece) || isSimpleMovement) {
    // 		if (app.position.diff.x === 1 && app.position.diff.y === 1) {
    // 			app.movePiece();
    // 			app.changePlayer();
    // 		}
    // 		else {
    // 			if (app.position.diff.x === 2 && app.position.diff.y === 2) {
    // 				var capturedPiece = app.getCaptured();
    // 				if (app.isPlayerOne) {
    // 					if (capturedPiece && app.getPieceType(capturedPiece) === 'player-two') {
    // 						app.movePiece(capturedPiece);
    // 						app.player.one.score++;
    // 						app.updateScore();
    // 						app.verifyNewCapture();
    // 					}
    // 				}
    // 				else {
    // 					if (capturedPiece && app.getPieceType(capturedPiece) === 'player-one') {
    // 						app.movePiece(capturedPiece);
    // 						app.player.two.score++;
    // 						app.updateScore();
    // 						app.verifyNewCapture();
    // 					}
    // 				}
    // 			}
    // 		}
    // 	}
    // 	else {
    // 		app.showMessage('Você deve movimentar a peça para frente.');
    // 	}
    // };
    app.verifyNewCapture = function() {
        var nextElement = null, nextDestiny = null, nextPiece = null, pos = {
            x: null,
            y: null
        };
        for (var i = 0, len = app.possibilities.length; i < len; i++) {
            nextElement = app.getElementSquare(app.possibilities[i].y, app.possibilities[i].x);
            pos.x = i % 2 === 0 ? app.possibilities[i].x + 1 : app.possibilities[i].x - 1;
            if (app.isKing(app.selectedPiece)) {
                pos.y = i % 2 === 0 ? app.possibilities[i].y + 1 : app.possibilities[i].y - 1;
            } else {
                pos.y = app.isPlayerOne ? app.possibilities[i].y - 1 : app.possibilities[i].y + 1;
            }
            if (nextElement) {
                nextPiece = app.getPiece(nextElement);
            }
            nextDestiny = app.getElementSquare(pos.y, pos.x);
            if (nextPiece && nextDestiny && !app.getPiece(nextDestiny) && app.isValidPiece(app.getPieceType(nextPiece), true)) {
                console.log("há chance de captura.");
                console.log("nextElement", nextElement);
                console.log("nextDestiny", nextDestiny);
                break;
            } else {
                if (i === len - 1) {
                    app.changePlayer();
                }
            }
        }
    };
    /**
	 * Check if there is piece to be captured.
	 * @todo: refactoring is needed.
	 */
    // app.verifyNewCapture = function () {
    // 	var domNextPiece = null,
    // 		domNextSquare = null,
    // 		domFuturePiece = null,
    // 		domFutureSquare = null,
    // 		dataValue = null;
    // 		isAdversary = null,
    // 		nextSquare = [],
    // 		futureSquare = [];
    // 	if (app.isKing(app.selectedPiece)) {
    // 		nextSquare = [
    // 			{ y: (app.position.destiny.y - 1), x: (app.position.destiny.x + 1) },
    // 			{ y: (app.position.destiny.y - 1), x: (app.position.destiny.x - 1) },
    // 			{ y: (app.position.destiny.y + 1), x: (app.position.destiny.x + 1) },
    // 			{ y: (app.position.destiny.y + 1), x: (app.position.destiny.x - 1) }
    // 		];
    // 		futureSquare = [
    // 			{ y: (app.position.destiny.y - 2), x: (app.position.destiny.x + 2) },
    // 			{ y: (app.position.destiny.y - 2), x: (app.position.destiny.x - 2) },
    // 			{ y: (app.position.destiny.y + 2), x: (app.position.destiny.x + 2) },
    // 			{ y: (app.position.destiny.y + 2), x: (app.position.destiny.x - 2) }
    // 		];
    // 	}
    // 	else {
    // 		if (app.isPlayerOne) {
    // 			nextSquare = [
    // 				{ y: (app.position.destiny.y - 1), x: (app.position.destiny.x + 1) },
    // 				{ y: (app.position.destiny.y - 1), x: (app.position.destiny.x - 1) }
    // 			];
    // 			futureSquare = [
    // 				{ y: (app.position.destiny.y - 2), x: (app.position.destiny.x + 2) },
    // 				{ y: (app.position.destiny.y - 2), x: (app.position.destiny.x - 2) }
    // 			];
    // 		}
    // 		else {
    // 			nextSquare = [
    // 				{ y: (app.position.destiny.y + 1), x: (app.position.destiny.x + 1) },
    // 				{ y: (app.position.destiny.y + 1), x: (app.position.destiny.x - 1) }
    // 			];
    // 			futureSquare = [
    // 				{ y: (app.position.destiny.y + 2), x: (app.position.destiny.x + 2) },
    // 				{ y: (app.position.destiny.y + 2), x: (app.position.destiny.x - 2) }
    // 			];
    // 		}
    // 	}
    // 	for (var i = 0, len = nextSquare.length; i < len; i++) {
    // 		dataValue = (nextSquare[i].y + '-' + nextSquare[i].x);
    // 		domNextSquare = app.board.querySelectorAll('[data-position="' + dataValue + '"]')[0] || false;
    // 		if (domNextSquare) {
    // 			domNextPiece = domNextSquare.getElementsByClassName('board__piece')[0] || false;
    // 		}
    // 		dataValue = (futureSquare[i].y + '-' + futureSquare[i].x);
    // 		domFutureSquare = app.board.querySelectorAll('[data-position="' + dataValue + '"]')[0] || false;
    // 		if (domFutureSquare) {
    // 			domFuturePiece = domFutureSquare.getElementsByClassName('board__piece')[0] || false;
    // 		}
    // 		if (domNextPiece) {
    // 			isAdversary = ((app.isPlayerOne && app.getPieceType(domNextPiece) === 'player-two') || (!app.isPlayerOne && app.getPieceType(domNextPiece) === 'player-one')) ? true : false;
    // 		}
    // 		if (domNextPiece && !domFuturePiece && domFutureSquare && isAdversary) {
    // 			break;
    // 		}
    // 		else {
    // 			if (i === len - 1) {
    // 				app.changePlayer();
    // 			}
    // 		}
    // 	}
    // };
    /**
	 * Update the visual score.
	 */
    app.updateScore = function() {
        return false;
        if (app.isPlayerOne) {
            app.player.one.score++;
        } else {
            app.player.two.score++;
        }
        app.player.one.dom.score.innerHTML = app.player.one.score;
        app.player.two.dom.score.innerHTML = app.player.two.score;
    };
    /**
	 * Update player's name.
	 */
    app.updatePlayer = function() {
        return false;
        app.player.one.dom.name.innerHTML = app.player.one.name + ": ";
        app.player.two.dom.name.innerHTML = app.player.two.name + ": ";
    };
    /**
	 * Let's go =]
	 */
    app.init();
})();