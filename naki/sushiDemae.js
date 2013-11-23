var page = require('webpage').create();
var fs   = require('fs');

// *********************************
// 出前館へのログインと注文（寿司）
// （注）銀のさら静岡県浜松中央店しか注文できない
// *********************************

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
		console.log('ログインするよ！',page.url);
        setTimeout(function() {
            page.render('sushiStep1.png');
        }, 200);		
		page.open('https://demae-can.com/login/top/'); // 次ページヘ
	},

	function() {
		console.log('ログイン画面にいったよ！',page.url);
       setTimeout(function() {
            page.render('sushiStep2.png');
        }, 200);

       //ログイン
		page.evaluate(function() {
	      document.getElementById("ma_email").value = "onigirikorokororo@gmail.com";
	      document.getElementById("ma_password").value = "J8iiqg8J8iqh";
	      document.getElementById("mainForm").submit();//次のページヘ
		});
	},
	function() {
		console.log('ログインに成功したよ！',page.url);
        setTimeout(function() {
            page.render('sushiStep3.png');
        }, 200);

        //店舗選択の画面へ
		page.open('https://demae-can.com/search/chain/100366/');
	},
	function() {
		console.log('お寿司を食べるよ',page.url);
		setTimeout(function() {
            page.render('sushiStep4.png');
        }, 200);

        //寿司選択画面へ
        //銀のさら浜松中央店
		page.open('https://demae-can.com/shop/menu/1002031/?addressId=1');        
	},
	function() {
		console.log('銀のさらにしたよ',page.url);
		setTimeout(function() {
            page.render('sushiStep5.png');
        }, 200);
        
        //注文画面へ
        //大トロ・マグロ１人盛り
		page.open('https://demae-can.com/shop/item/1002031/a0a10040/1/?menuCd=2088_901&selectedMenuCd=&selectedCodeHistory=&blockCd=22131043003&addressId=1');        
	},
	function() {
		console.log('大トロ・マグロ１人盛りを食べるよ',page.url);
		setTimeout(function() {
            page.render('sushiStep6.png');
        	phantom.exit();
        }, 200);
        
        //
		//page.open('');        
	}

]).next();