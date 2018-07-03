Product.GameOver = function (game) {
    this._fontStyle = {
        font: 'Luckiest Guy, cursive',
        align: "center",
        smoothed: true
    };
    this._txtTapToRestart = null;
    this._toggleColor = false;
};

Product.GameOver.prototype = {
    preload: function () {
    },
    create: function () {
        Product._greetingType = ['greeting1', 'greeting2', 'greeting3', 'greeting4', 'greeting5', 'greeting6'];
        var txtGameOver = this.add.text(this.world.centerX, this.world.centerY - 400, 'Current Score', this._fontStyle);
        txtGameOver.fontSize = 30;
        txtGameOver.fill = '#ffffff';
        txtGameOver.anchor.set(0.5, 0.5);
        if (typeof(Storage) !== "undefined") {
            var txtCurrentScore = this.add.text(this.world.centerX, this.world.centerY - 370, Product._score, this._fontStyle);
            txtCurrentScore.fontSize = 32;
            txtCurrentScore.fill = '#ffffff';
            txtCurrentScore.anchor.set(0.5, 0.5);

            var txtGameOver = this.add.text(this.world.centerX, this.world.centerY - 320, 'Highest Score', this._fontStyle);
            txtGameOver.fontSize = 30;
            txtGameOver.fill = '#ec1f27';
            txtGameOver.anchor.set(0.5, 0.5);

            var txtBestScore = this.add.text(this.world.centerX, this.world.centerY - 285, storage.get('bestScore'), this._fontStyle);
            txtBestScore.fontSize = 32;
            txtBestScore.fill = '#ec1f27';
            txtBestScore.anchor.set(0.5, 0.5);
        }

        var greetingText = this.add.image(this.world.centerX, this.world.centerY - 100, this.greetingText(), this._fontStyle);
        greetingText.fontSize = 38;
        greetingText.fill = '#ec1f27';
        greetingText.anchor.set(0.5, 0.5);

        var gameOverText = this.add.image(this.world.centerX, this.world.centerY + 40, 'gameOverText');
        gameOverText.anchor.set(0.5, 0.5);

        var replay = this.add.button(this.world.centerX, this.world.centerY + 200, 'replay', this.play, this);
        replay.anchor.set(0.5, 0.5);

        var home = this.add.button(this.world.centerX, this.world.centerY + 325, 'home', this.menu, this);
        home.anchor.set(0.5, 0.5);

        var scoreBoard = this.add.button(this.world.centerX, this.world.centerY - 220, 'leaderBoard', this.scoreBoard, this);
        scoreBoard.anchor.set(0.5, 0.5);

        var closeButton = this.add.button(Product.GAME_WIDTH - 60, 10, 'close', this.close, this);
        closeButton.scale.setTo(0.6, 0.6);
        closeButton.anchor.set(0.5, -0.5);

        if (Product._score >= storage.get('bestScore')) {
            update_score();
        }

    },
    scoreBoard: function () {
        custom_event('LeaderBoardClick', 'Leader Board');
        var modal = document.getElementById('simpleModal');
        modal.style.display = 'block';
        getMessage();
    },
    greetingText: function () {
        if (Product._score < 100) {
            return Product._greetingType[0];
        } else if (Product._score >= 100 && Product._score <= 200) {
            return Product._greetingType[1];
        } else if (Product._score > 200 && Product._score <= 300) {
            return Product._greetingType[2];
        } else if (Product._score > 300 && Product._score <= 400) {
            return Product._greetingType[3];
        } else if (Product._score > 400 && Product._score <= 500) {
            return Product._greetingType[4];
        } else if (Product._score > 500) {
            return Product._greetingType[5];
        }

    },
    changeTxtColor: function () {
        if (!this._toggleColor) {
            this._txtTapToRestart.fill = "#f04848";
            this._toggleColor = true;
        } else {
            this._txtTapToRestart.fill = "#f02222";
            this._toggleColor = false;
        }
    },
    close: function (game) {
        custom_event('CloseButtonClick', 'Close Button');
        this.state.start('menu', true, false);
    },
    play: function () {
        custom_event('ReplayClick', 'Replay');
        this.state.start('play');
    },
    menu: function () {
        custom_event('HomeButtonClick', 'Home Button');
        this.state.start('menu', true, false);
    }
};
function update_score() {
    var user = storage.get('user');
    var data = {
        'udid': user['udid'],
        'score': Product._score
    };
    $.ajax({
        type: "post",
        url: base_url + "users/score_update",
        dataType: 'json',
        data: data
    })
        .done(function (res) {
            if (res.status == 1) {
               // console.log(res);
            } else {
               // console.log(res);
            }
        })
        .fail(function (data) {
            console.log(data);
        });
}

/*  Get Message from API to display in Message Box*/
function getMessage() {
    var localUser = storage.get("user");
    var data = {
        'udid': localUser['udid']
    };
    $.ajax({
        type: "post",
        url: base_url + "users/score_board",
        dataType: 'json',
        data: data
    })
        .done(function (res) {
            var scoreList = '';
            if (res.status == 1) {
                var data = res.data;
                for (var i = 0; i < data.length; i++) {
                    if (data[i]['is_user']) {
                        scoreList += '<tr class="user-score">';
                    }
                    else {
                        scoreList += '<tr>';
                    }
                    scoreList += '<td>' + data[i]["rank"] + '</td><td>' + data[i]['score'] + '</td></tr>';
                }
                document.getElementById('score-body').innerHTML = scoreList;
            } else {
                scoreList = '<h4>';
                scoreList += res.message + '</h4>';
                document.getElementById('message-modal-body').innerHTML = scoreList;
            }
        })
        .fail(function (res) {
            console.log(res);
        });
}
/* Modal Box Close for Message Box */
// window.addEventListener('click', clickOutside);

/*Function to close modal*/
function closeModal() {
    var modal = document.getElementById('simpleModal');
    modal.style.display = 'none';
}

/*Function to close modal if outside click*/
function clickOutside(e) {
    var modal = document.getElementById('simpleModal');
    if (e.target == modal) {
        modal.style.display = 'none';
    }
}