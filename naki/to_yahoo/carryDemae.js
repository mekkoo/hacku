var page = require('webpage').create();
var fs   = require('fs');

// *********************************
// 出前館へのログインと注文（ナマステ）
// （注）情熱カレー　禅　六本木店しか注文できない
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
            page.render('carryStep1.png');
        }, 200);
		page.open('https://demae-can.com/login/top/'); // 次ページヘ
	},

	function() {
		console.log('ログイン画面にいったよ！',page.url);
       setTimeout(function() {
            page.render('carryStep2.png');
        }, 200);

       //ログイン
		page.evaluate(function() {
	      document.getElementById("ma_email").value = "onigiri_korokororo@yahoo.co.jp";
	      document.getElementById("ma_password").value = "YahooJapan";
	      document.getElementById("mainForm").submit();//次のページヘ
		});
	},
	function() {
		console.log('ログインに成功したよ！',page.url);
        setTimeout(function() {
            page.render('carryStep3.png');
        }, 200);

		page.open('https://demae-can.com/search/genre/curry/');//チェーン選択の画面
		//情熱カレー　禅を選択
	},
	function() {
		console.log('カレーを食べるよ',page.url);
		setTimeout(function() {
            page.render('carryStep4.png');
        }, 200);

		page.open('https://demae-can.com/search/chain/301493/?addressId=1');//店舗選択画面 
		//情熱カレー　禅　六本木店を選択
	},
	function() {
		console.log('情熱カレー禅六本木店にしたよ',page.url);
		setTimeout(function() {
            page.render('carryStep5.png');
        }, 200);
        
		//商品詳細画面を開き, バターチキンカレーを選択
		page.open('https://demae-can.com/shop/item/3004627/104a1/001/?menuCd=JBZ1_104&selectedMenuCd=&selectedCodeHistory=&blockCd=13103001009&addressId=1');
	},
	function() {
			console.log('バターチキンカレーを食べるよ',page.url);
  			page.includeJs("//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js", function(){ // jQueryをinclude
    			var offset = page.evaluate(function(){ // リンクのoffsetを取得
      				return $('a[href="/shop/item/"]').offset();
    			});
    			console.log("left:"+offset.left+",top:"+ offset.top);
    			page.sendEvent('click', offset.left+1, offset.top+1); // クリック
    		});


            setTimeout(function() {
                // ページのキャプチャ
                page.render('carryStep6.png');
 				phantom.exit();
            }, 200);
     }

]).next();