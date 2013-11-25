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
			/*
            if (status !== 'success') {
                console.log('error!');
                phantom.exit();
                return;
            }
            */
            // カートに入れるボタンの位置を取得
            // page.evaluateメソッドを使ってページ内部でのJavaScript実行結果を取得できる
            //var btnClickPosition = page.evaluate(function() {
            	document.querySelectorAll("[href='/shop/item/']").onclick();

            	//var childElements = element.childNodes;
            	//console.log(btn.innerHTML);

                //var btn = btnChildElement.get(0);

                /*
                var rect = btn.getBoundingClientRect();
 				
                var sx = (btn.screen) ? 0 : document.body.scrollLeft;
                var sy = (btn.screen) ? 0 : document.body.scrollTop;
                var position = {
                    left: Math.floor(rect.left + sx),
                    top: Math.floor(rect.top + sy),
                    width: Math.floor(rect.width),
                    height: Math.floor(rect.height)
                };
				

				var sx = (btn.screen) ? 0 : document.body.scrollLeft;
                var sy = (btn.screen) ? 0 : document.body.scrollTop;

                
                var position = {
                    left: Math.floor(rect.left),
                    top: Math.floor(rect.top),
                    width: Math.floor(rect.width),
                    height: Math.floor(rect.height)
                };
 
                return {
                    left: Math.round(position.left + position.width / 2),
                    top: Math.round(position.top + position.height / 2)
                };
             */
            //});
			
 
            // ボタンをクリックしてカートに入れるイベント
            //page.sendEvent('click', btnClickPosition.left, btnClickPosition.top);
 
            // Ajaxリクエストが発生するため１秒待つ
            setTimeout(function() {
                // ページのキャプチャ
                page.render('carryStep6.png');
 				phantom.exit();
                // 非同期処理の終了
                //done();
            }, 1000);
     }/*,
		function() {
		console.log('カートに入れるよ',page.url);
		setTimeout(function() {
            page.render('carryStep7.png');
        	phantom.exit();
        }, 200);
        
		//page.open('https://demae-can.com/order/cart/disp/61e9ab3a2da8d70d3ad4b37c87db2ec4?siteCd=honke&author=demae&countUrlGroupId=&countUrlSeqNo=&campaignId=&brandShopId=&addressId=1&fromItem=item'); // 
	}
	*/

]).next();