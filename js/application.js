(function() {
    console.log("checkers game running...");
    var app = {}, settings = {
        scope: "game-stage",
        board: "board",
        pieces: "pieces"
    };
    app.init = function() {
        app.setup();
        app.create();
        app.attach();
        app.bind();
    };
    app.setup = function() {
        app.scope = document.getElementById(settings.scope), app.board = document.getElementsByClassName(settings.board)[0], 
        app.pieces = document.getElementsByClassName(settings.pieces)[0];
    };
    app.create = function() {
        var html = [];
        for (var i = 0; i < 8; i++) {
            html.push('<div class="row">');
            for (var j = 0; j < 8; j++) {
                var squareType = (i + j) % 2 ? "dark" : "light";
                html.push('<span class="board__square ' + squareType + '">');
                if (squareType === "dark" && i < 3) {
                    html.push('<span class="board__piece dark" data-position="' + i + "-" + j + '">' + i + "-" + j + "</span>");
                }
                if (squareType === "dark" && i > 8 - 4) {
                    html.push('<span class="board__piece light" data-position="' + i + "-" + j + '">' + i + "-" + j + "</span>");
                }
                html.push("</span>");
            }
            html.push("</div>");
        }
        app.board.innerHTML = html.join("");
    };
    app.attach = function() {
        app.pieces = document.getElementsByClassName("board__piece");
    };
    app.bind = function() {
        for (var i = 0, len = app.pieces.length; i < len; i++) {
            app.pieces[i].addEventListener("click", function() {
                app.move(this);
            }, false);
        }
    };
    app.move = function(target) {
        var dataPos = target.getAttribute("data-position").split("-"), position = {
            col: dataPos[0],
            line: dataPos[1]
        };
        console.log(position.col, position.line);
    };
    app.init();
})();