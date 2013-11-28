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

        // jsを実行(出前館はjQueryを読み込んでいるのでその前提で)
        page.evaluate(function() {
            // 対象ページ内でclick()を実装
            // 参考：http://stackoverflow.com/questions/15739263/phantomjs-click-an-element#answer-17789929
            HTMLElement.prototype.click = function() {
                var ev = document.createEvent('MouseEvent');
                ev.initMouseEvent(
                    'click',
                    /*bubble*/true, /*cancelable*/true,
                    window, null,
                    0, 0, 0, 0, /*coordinates*/
                    false, false, false, false, /*modifier keys*/
                    0/*button=left*/, null
                );
                this.dispatchEvent(ev);
            };

             $('#btn_shop_detail a[href=/shop/item/]')[0].click();//カートにいれるボタン
            //$('#btn_shop_detail a[href^=/shop]')[0].click();//キャンセルボタン

        });

        setTimeout(function() {
        	//fix:レンダリングできてない？
        	page.render('carryStep6.png');
       	}, 200);
     },
     function() {    	
        console.log("カートに入れたよ", page.url);

        // jsを実行
        page.evaluate(function() {
        	//カレーの個数を2個にする（1000円以上じゃないと頼めない）
        	document.getElementById("ma_order_count").value="2";

            // 対象ページ内でclick()を実装
            HTMLElement.prototype.click = function() {
                var ev = document.createEvent('MouseEvent');
                ev.initMouseEvent(
                    'click',
                    /*bubble*/true, /*cancelable*/true,
                    window, null,
                    0, 0, 0, 0, /*coordinates*/
                    false, false, false, false, /*modifier keys*/
                    0/*button=left*/, null
                );
                this.dispatchEvent(ev);
            };

            //fix:動かない
			$('.cart_order_info')[0].click();  
             //$('#ma_order_next_link')[0].click();//次へボタン

        });

        setTimeout(function() {
        	page.render('carryStep7.png');
       	}, 200);
     },
     function() {    	
        console.log("注文画面にいった？", page.url);


       	//phantom.jsを終了
        phantom.exit();
     }    

]).next();
