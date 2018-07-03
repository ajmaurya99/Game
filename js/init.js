/**
 * Phaser Initialise
 * @type {Phaser.Game}
 */
var devMode = false;
var base_url = '';
if (!devMode) {
    base_url = 'https://tastytreatofficial.com/indian-chabao-league/backend/api/';
    /*window.console = {
        log: function () {
        }
    };*/
} else {
    base_url = 'http://localhost/snehal/chak-chak-chabao-game/backend/api/';
}

var storage = Storages.localStorage;
var game, WebFontConfig, preloadSprite, is_register;

$(document).ready(function () {
    $("#register-btn").on('click', function () {
        $(".login").hide();
        $(".register").show();
    });

    $("#login-btn").on('click', function () {
        $(".register").hide();
        $(".login").show();
    });
});
window.onload = function () {
    var user = storage.get('user');
    if (user && user['udid']) {
        $(".GameForm").hide();
        create_game();
    } else {
        $(".GameForm").show();
        $(".login").show();
        $(".register").hide();
    }

    function create_game() {
        game = new Phaser.Game(620, 960, Phaser.AUTO, '', {}, true);
        game.state.add('boot', Product.Boot);
        game.state.add('load', Product.Load);
        game.state.add('menu', Product.Menu);
        game.state.add('howToPlay', Product.HowToPlay);
        game.state.add('play', Product.Play);
        game.state.add('gameOver', Product.GameOver);
        game.state.start('boot');
    }

    /* set Local Storage*/
    function set_user(res) {
        storage.set('user', JSON.stringify(res.data));
        storage.set('bestScore', res.data.score);
    }

    /* Regex to check email format*/
    $.validator.addMethod('emailFormat', function (value, element) {
        if (value) {
            var emailReg = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            var valid = emailReg.test(value);
            if (!valid) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }, 'Please enter Valid Email.');

    /* Regex to check contact number*/
    $.validator.addMethod('contactformat', function (value, element) {
        var numberreg = new RegExp(/^[0]?[789]\d{9}$/);
        var valid = numberreg.test(value);
        if (!valid) {
            return false;
        } else {
            return true;
        }
    }, 'Please enter Valid Number.');

    /* Regex to disallow space before name*/
    $.validator.addMethod('noSpace', function (value, element) {
        var numberReg = new RegExp(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/);
        var valid = numberReg.test(value);
        if (!valid) {
            return false;
        } else {
            return true;
        }
    }, 'Please enter Correct Name.');

    /* Login form Validation and submit*/
    $("#loginform").validate({
        rules: {
            mobile: {
                required: true,
                number: true,
                contactformat: true,
                minlength: 10
            },
        },
        submitHandler: function () {
            var serializeData = $("#loginform").serialize();
            $.ajax({
                type: "post",
                url: base_url + "users/login",
                dataType: 'json',
                data: serializeData
            })
                .done(function (res) {
                    if (res.status == 1) {
                        dataLayer.push({
                            'event': 'LoginFormSubmitted',
                            'formName': 'Login Form',
                            'eventLabel': 'Login Successful'
                        });
                        $("#loginform")[0].reset();
                        set_user(res);
                        alertify.alert().setHeader('').setting({
                            'label': 'OK',
                            'message': res.message,
                            'onok': function () {
                                $(".login").hide();
                                $(".GameForm").hide();
                                create_game();
                            }
                        }).show();

                    } else {
                        alertify.alert().setHeader('').setting({
                            'label': 'Register Now',
                            'message': res.message,
                            'onok': function () {
                                $(".login").hide();
                                $(".register").show();
                            }
                        }).show();
                    }
                })
                .fail(function (res) {
                    console.log(res);
                });
        }
    });

    /* Register form Validation and submit*/
    $("#registerform").validate({
        rules: {
            name: {
                required: true,
                noSpace: true
            },
            email: {
                email: true,
                emailFormat: true
            },
            mobile: {
                required: true,
                number: true,
                contactformat: true,
                minlength: 10
            },
            city: {
                required: true
            }
        },
        submitHandler: function () {
            var serializeData = $("#registerform").serialize();
            $.ajax({
                type: "post",
                url: base_url + "users/register",
                dataType: 'json',
                data: serializeData
            })
                .done(function (res) {
                    if (res.status == 1) {
                        dataLayer.push({
                            'event': 'RegisterFormSubmitted',
                            'formName': 'Register Form',
                            'eventLabel': 'Registration Successful'
                        });
                        is_register = true;
                        $("#registerform")[0].reset();
                        set_user(res);
                        alertify.alert().setHeader('').setting({
                            'label': 'OK',
                            'message': res.message,
                            'onok': function () {
                                $(".GameForm").hide();
                                $(".register").hide();
                                create_game();
                            }
                        }).show();
                    } else {
                        /*confirm(res.message);*/
                        alertify.alert(res.message);
                        alertify.alert().setHeader('').setting({
                            'label': 'Login Now',
                            'message': res.message,
                            'onok': function () {
                                $(".register").hide();
                                $(".login").show();
                            }
                        }).show();
                    }
                })
                .fail(function (res) {
                    console.log(res);
                });
        }
    });



};

