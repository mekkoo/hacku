var page = require('webpage').create();
var fs   = require('fs');

// *********************************
// 出前館へのログインと注文（ピザ）
// （注）ピザーラしか注文できない
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
        console.log('＼出前の錬金術士！！／');   
        console.log('出前館にログインするよ！',page.url);   
        setTimeout(function() {
            page.render('pizzaStep1.png');
        }, 200);
        page.open('https://demae-can.com/login/top/'); // 次ページヘ
    },
    function() {
        console.log('ログイン画面にいったよ！',page.url);
       setTimeout(function() {
            page.render('pizzaStep2.png');
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
            page.render('pizzaStep3.png');
        }, 200);

        page.open('https://demae-can.com/search/chain/101144/');//チェーン選択の画面
        //ピザーラを選択
    },
    function() {
        console.log('ピザを食べるよ',page.url);
        setTimeout(function() {
            page.render('pizzaStep4.png');
        }, 200);

        page.open('https://demae-can.com/shop/menu/1005145/?addressId=1');//店舗選択画面 
        //ピザーラ　六本木店を選択
    },
    function() {
        console.log('ピザーラ六本木店のピザにしたよ',page.url);
        setTimeout(function() {
            page.render('pizzaStep5.png');
        }, 200);
        
        //商品詳細画面を開き, モッツァナポリを選択
        page.open('https://demae-can.com/shop/item/1005145/01010004460/01010004460B/?menuCd=01010007&selectedMenuCd=&selectedCodeHistory=&orderId=160e8a8e1690bd7fb94687afa05fdba2&blockCd=13103001009&addressId=1');
    },
    function() {
        console.log('モッツァナポリを食べるよ',page.url);

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
            page.render('pizzaStep6.png');
        }, 200);
     },
     function() {
        
        //テスト→これは動く
        var test = page.evaluate(function() {
            //var hoge = "テスト1";
            //var btn = $('.cart_order_info > a').attr('id');
            // return hoge;
            //return btn;

        });
        console.log("ボタンのIDは", test);

        // jsを実行
        page.evaluate(function() {
            var btn = $('.cart_order_info > a').attr('id');
            console.log("evalueteテスト", btn);
            //カレーの個数を2個にする（1000円以上じゃないと頼めない）
            //document.getElementById("ma_order_count").value="2";
            // console.log("テスト1");

            // 対象ページ内でclick()を実装

            //fix:動かない
            //jQuery(配列)からHTMLElementを取り出すために[0]を使う
            //$('#ma_order_next_link')[0].click();//注文へボタン
            //$('.cart_order_info')[0].click(); 
            //document.getElementById("ma_order_next_link").click();
        });

        //適当に遷移させる（functionを動かす）
        page.open("https://demae-can.com/order/cart/forward");

        setTimeout(function() {
            page.render('pizzaStep7.png');
        }, 600);

     },
     function() {       
        console.log("注文画面へ", page.url);

        setTimeout(function() {
            page.render('pizzaStep8.png');
        }, 200);

        //phantom.jsを終了
        console.log("出前の錬金術士としての指名を全うした...");
        phantom.exit();
     }    
]).next();
