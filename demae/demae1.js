var page = require('webpage').create();

var fs   = require('fs');



// ページが読み込まれたら page.onCallback を呼ぶ

page.onInitialized = function() {

    page.evaluate(function() {

        document.addEventListener('DOMContentLoaded', function() {

            window.callPhantom('DOMContentLoaded');

        }, false);

    });

};



// ページが読み込まれたら登録した関数の配列を順次実行してくれるクラス

var funcs = function(funcs) {

    this.funcs = funcs;

    this.init();

};

funcs.prototype = {

    // ページが読み込まれたら next() を呼ぶ

    init: function() {

        var self = this;

        page.onCallback = function(data){

            if (data === 'DOMContentLoaded') self.next();

        }

    },

    // 登録した関数の配列から１個取り出して実行

    next: function() {

        var func = this.funcs.shift();

        if (func !== undefined) {

            func();

        } else {

            page.onCallback = function(){};

        }

    }

};



// 順次実行する関数

new funcs([

    function() {

        console.log('ログイン処理', page.url);

        setTimeout(function() {

            page.render('step1.png');

        }, 200);

        page.open('https://demae-can.com/login/top/'); // 次ページヘ

    },

    function() {

        console.log('ログイン画面', page.url);

        setTimeout(function() {

            page.render('step2.png');

        }, 200);

        page.evaluate(function() {

            document.getElementById('ma_email').value = "okame0904@gmail.com";

            document.getElementById('ma_password').value   = "tukurua0904";

            document.getElementById('mainForm').submit(); // 次ページヘ

        });

    },

    function() {

        console.log('ログイン後画面', page.url);

        console.log(page.title);

        setTimeout(function() {

            page.render('step3.png');

            phantom.exit();

        }, 200);

    }

]).next();
