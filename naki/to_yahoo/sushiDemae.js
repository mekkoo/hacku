var page = require('webpage').create();

// *********************************
// 出前館へのログインと注文テスト（寿司）
// *********************************

var funcs = [

    function() {
        console.log('＼出前の錬金術士！！／');   
        console.log('出前館にログインするよ！',page.url);   
        // setTimeout(function() {
        //     page.render('sushiStep1.png');
        // }, 200);
        page.open('https://demae-can.com/login/top/'); // 次ページヘ
    },
    function() {
        console.log('ログイン画面にいったよ！',page.url);
       setTimeout(function() {
            page.render('sushiStep1.png');
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
            page.render('sushiStep2.png');
        }, 200);

        page.open('https://demae-can.com/search/chain/100366/');//チェーン選択の画面
        //銀のさらを選択
    },
    function() {
        console.log('寿司を食べるよ',page.url);
        setTimeout(function() {
            page.render('sushiStep3.png');
        }, 200);

        page.open('https://demae-can.com/shop/menu/3002022/?addressId=1');//店舗選択画面 
        //銀のさら  麻布店を選択
    },
    function() {
        console.log('銀のさらの寿司にしたよ',page.url);
        setTimeout(function() {
            page.render('sushiStep4.png');
        }, 200);
        
        //商品詳細画面を開き, 華を選択
        page.open('https://demae-can.com/shop/item/3002022/a0a10039/1/?menuCd=a&selectedMenuCd=&selectedCodeHistory=&blockCd=13103001009&addressId=1');
    },
    function() {
        console.log('華を食べるよ',page.url);

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
            page.render('sushiStep5.png');
        }, 200);
     },
     function() {
        console.log("カートにいれたよ！",page.url);
        
        // jsを実行し,ボタンをクリック
        page.evaluate(function() {
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

             $('#ma_order_next_link')[0].click();//次へボタン
        });

        setTimeout(function() {
            page.render('sushiStep6.png');
        }, 200);

     },
     function() {       
        console.log("注文画面へいくよ！", page.url);
        
        // jsを実行し,ボタンをクリック
        page.evaluate(function() {
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

             $('#ma_next_link')[0].click();//次へボタン
        });

        setTimeout(function() {
            page.render('sushiStep7.png');
        }, 200);
    },
    function() {
        //注文！！
         console.log("注文！", page.url);
        
        // jsを実行し,ボタンをクリック
        page.evaluate(function() {
            document.getElementById("ma_password").value = "YahooJapan";

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

            //パスワード入力
            $('#ma_password').val('YahooJapan');

            //注文されちゃう！！
             //$('#ma_order_link')[0].click();//注文するボタン
        });

        setTimeout(function() {
            page.render('sushiStep8.png');
        }, 200);  

        //キャプチャのため, TOPに遷移（がちな注文時は外す）
        page.open('https://demae-can.com/');
    },
    function() {
        //phantom.jsを終了
        console.log("出前の錬金術士としての指名を全うした...");
        phantom.exit();
     } 
];

//phantomjsでページ遷移
//参考：http://blog.p-rex.net/?eid=975503
var recursive = function(i){
  if(i < funcs.length){
    page.onLoadFinished = function(){recursive(i+1);};
    funcs[i]();
  }else{
    phantom.exit();
  }
};

recursive(0);