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
                name: "player One"
            },
            two: {
                name: "player Two"
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
        app.updatePlayer();
        app.updateScore();
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
        var elmPlayerOne = app.score.getElementsByClassName(settings.score.playerOne)[0].getElementsByTagName("span"), elmPlayerTwo = app.score.getElementsByClassName(settings.score.playerTwo)[0].getElementsByTagName("span");
        app.selectedPiece = null;
        app.selectedSquare = null;
        app.selectedDestiny = null;
        app.position = {
            piece: {
                x: null,
                y: null
            },
            destiny: {
                x: null,
                y: null
            },
            diff: {
                x: null,
                y: null
            }
        };
        app.player = {
            one: {
                name: settings.player.one.name,
                score: 0,
                dom: {
                    name: elmPlayerOne[0],
                    score: elmPlayerOne[1]
                }
            },
            two: {
                name: settings.player.two.name,
                score: 0,
                dom: {
                    name: elmPlayerTwo[0],
                    score: elmPlayerTwo[1]
                }
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
        } else {
            if (!app.hasPiece(target)) {
                app.chooseDestiny(target);
                app.setMatchPosition();
                app.checkMove();
                app.resetVars();
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
    app.choosePiece = function(target) {
        if (app.hasPiece(target)) {
            app.selectedPiece = target.getElementsByClassName("board__piece")[0];
            var pieceType = app.getPieceType(app.selectedPiece);
            if (app.isPlayerOne && pieceType === "player-one" || !app.isPlayerOne && pieceType === "player-two") {
                app.selectedSquare = target;
                app.selectedPiece.classList.add("selected");
            } else {
                app.selectedPiece = null;
                app.showMessage("Espere a sua vez de jogar || você não pode jogar com uma peça do adversário.");
            }
        } else {
            app.showMessage("Você deve escolher uma peça antes do destino.");
        }
    };
    /**
	 * Select a destiny to the piece.
	 * @param  {object} target The selected square.
	 */
    app.chooseDestiny = function(target) {
        app.selectedDestiny = target;
    };
    /**
	 * The main rules of the game
	 * 1 x 1 = a simple movement.
	 * 2 x 2 = a movement with capture.
	 */
    app.checkMove = function() {
        var isSimpleMovement = app.isPlayerOne && app.position.destiny.y < app.position.piece.y || !app.isPlayerOne && app.position.destiny.y > app.position.piece.y ? true : false;
        if (app.isKing(app.selectedPiece) || isSimpleMovement) {
            if (app.position.diff.x === 1 && app.position.diff.y === 1) {
                app.movePiece();
                app.changePlayer();
            } else {
                if (app.position.diff.x === 2 && app.position.diff.y === 2) {
                    var capturedPiece = app.getCaptured();
                    if (app.isPlayerOne) {
                        if (capturedPiece && app.getPieceType(capturedPiece) === "player-two") {
                            app.movePiece(capturedPiece);
                            app.player.one.score++;
                            app.updateScore();
                        }
                    } else {
                        if (capturedPiece && app.getPieceType(capturedPiece) === "player-one") {
                            app.movePiece(capturedPiece);
                            app.player.two.score++;
                            app.updateScore();
                        }
                    }
                }
            }
        } else {
            app.showMessage("Você deve movimentar a peça para frente.");
        }
    };
    /**
	 * Move the piece to the destiny. If has capture, remove.
	 * @param  {object} captured DOM element to remove or false.
	 */
    app.movePiece = function(captured) {
        app.selectedDestiny.appendChild(app.selectedPiece);
        if (captured) {
            captured.remove();
        }
        if (!app.isKing(app.selectedPiece) && app.position.destiny.y === 0 || app.position.destiny.y === 7) {
            app.setKing(app.selectedPiece);
        }
    };
    /**
	 * Get the captured piece.
	 * @return {object} DOM element or false.
	 */
    app.getCaptured = function() {
        var dataValue = null, captured = null;
        if (app.isPlayerOne && !app.isKing(app.selectedPiece)) {
            if (app.position.piece.x > app.position.destiny.x) {
                dataValue = app.position.destiny.y + 1 + "-" + (app.position.destiny.x + 1);
            } else {
                dataValue = app.position.destiny.y + 1 + "-" + (app.position.destiny.x - 1);
            }
        } else {
            if (!app.isPlayerOne && app.isKing(app.selectedPiece)) {
                if (app.position.piece.x > app.position.destiny.x) {
                    dataValue = app.position.destiny.y + 1 + "-" + (app.position.destiny.x + 1);
                } else {
                    dataValue = app.position.destiny.y + 1 + "-" + (app.position.destiny.x - 1);
                }
            } else {
                if (app.position.piece.x > app.position.destiny.x) {
                    dataValue = app.position.destiny.y - 1 + "-" + (app.position.destiny.x + 1);
                } else {
                    dataValue = app.position.destiny.y - 1 + "-" + (app.position.destiny.x - 1);
                }
            }
        }
        captured = app.board.querySelectorAll('[data-position="' + dataValue + '"]')[0];
        return captured.getElementsByClassName("board__piece")[0] || false;
    };
    /**
	 * Configure the coordinates.
	 */
    app.setMatchPosition = function() {
        app.position.piece.y = app.getPosition(app.selectedSquare).y;
        app.position.piece.x = app.getPosition(app.selectedSquare).x;
        app.position.destiny.y = app.getPosition(app.selectedDestiny).y;
        app.position.destiny.x = app.getPosition(app.selectedDestiny).x;
        app.position.diff.y = app.position.piece.y - app.position.destiny.y < 0 ? (app.position.piece.y - app.position.destiny.y) * -1 : app.position.piece.y - app.position.destiny.y;
        app.position.diff.x = app.position.piece.x - app.position.destiny.x < 0 ? (app.position.piece.x - app.position.destiny.x) * -1 : app.position.piece.x - app.position.destiny.x;
    };
    /**
	 * Set piece like king.
	 * @param {object} piece DOM element.
	 */
    app.setKing = function(piece) {
        piece.classList.add("king");
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
	 * Change the player's turn.
	 */
    app.changePlayer = function() {
        app.isPlayerOne = !app.isPlayerOne;
    };
    /**
	 * Check if there is piece in the square.
	 * @param  {object}  square DOM element
	 * @return {Boolean}        true if there is piece or false if not.
	 */
    app.hasPiece = function(square) {
        var piece = square.getElementsByClassName("board__piece")[0];
        return piece ? true : false;
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
	 * Update the visual score.
	 */
    app.updateScore = function() {
        app.player.one.dom.score.innerHTML = app.player.one.score;
        app.player.two.dom.score.innerHTML = app.player.two.score;
    };
    /**
	 * Update player's name.
	 */
    app.updatePlayer = function() {
        app.player.one.dom.name.innerHTML = app.player.one.name + ": ";
        app.player.two.dom.name.innerHTML = app.player.two.name + ": ";
    };
    /**
	 * @todo: Exibir um feedback para o usuário.
	 */
    app.showMessage = function(message) {
        console.log("### ", message);
    };
    /**
	 * Reset global variables.
	 */
    app.resetVars = function() {
        app.selectedPiece.classList.remove("selected");
        app.selectedPiece = null;
        app.selectedSquare = null;
        app.selectedDestiny = null;
    };
    /**
	 * Let's go =]
	 */
    app.init();
})();