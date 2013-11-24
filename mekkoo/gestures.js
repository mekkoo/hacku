//寿司起動
//作成者: 河又
//日付: 2013年11月23日(土)
//参考:
//サルでもわかるLeap
//http://syslog.shimy.net/?p=619

var previousFrame = "";

var handLeft = 0;
var handRight = 0;

var sushiCnt = 0;
var sushiFlag = false;

var namasuteCnt = 0;
var namasuteFlag = false;

var pizzaCnt = 0;
var pizzaFlag = false;

//寿司注文関数
function sushiAct(){
	Messenger().post({
		message: "寿司が注文されました",
		hideAfter: 2
	});
}

//ピザ注文関数
function pizzaAct(){
	Messenger().post({
		message: "ピザが注文されました",
		hideAfter: 2
	});
}

function namasuteAct(){
	Messenger().post({
		message: "インド人が注文されました",
		hideAfter: 2
	});
}

//HTMLの#consoleにログを出力する用
function htmlOutput(dataLeft, dataRight){
	$("#console_left").text("left: "+dataLeft+" ");
	$("#console_right").text("right: "+dataRight+" ");
}

function consoleLog(handLeft, handRight) {
	console.log(
		"handLeftX: " +
			handLeft.palmPosition[0] + //左手のX座標
			"handLeftY: " +
			handLeft.palmPosition[1] + //左手のX座標
			"handLeftZ: " +
			handLeft.palmPosition[2] + //左手のX座標
			"handID: " +
			handLeft.id + //左手の一時的ID
			"palmVelocity: " +
			handLeft.palmVelocity
	);

	console.log(
		"handRightX: " +
			handRight.palmPosition[0] + //右手のX座標
			"handRightY: " +
			handRight.palmPosition[1] + //右手のX座標
			"handRightZ: " +
			handRight.palmPosition[2] + //右手のX座標
			"handID: " +
			handRight.id + //右手の一時的ID
			"palmVelocity: " +
			handRight.palmVelocity
	);
}

//にぎりカウントアップ にぎり回数が3に達するとsushiAct()発火
function nigiriCntup(yPosition){
	var nigiriWatcher = $("#nigiri_watcher");
	var cntConsole = $("#cnt_console");
	if(yPosition >= 300){ //yが300以上の場合
		if(!sushiFlag) { //すでに300以上の場合、カウント処理をスキップ
			sushiFlag = true; //カウント中断のフラグを建てる
			sushiCnt++; //カウントアップ
			cntConsole.text(sushiCnt);
			if(sushiCnt === 3){ //3に達するとsushiAct()発火
				sushiAct(); //寿司注文関数
				sushiCnt = 0;
			}
		}
		nigiriWatcher.removeClass("hide").text(yPosition);
	} else if (yPosition <= 250){ //yが250以下の場合
		if(sushiFlag) {
			sushiFlag = false;
		}
		nigiriWatcher.addClass("hide");
	}
}


//Leapオブジェクトを継承後、永久ループでモーション監視へ
var controller = new Leap.Controller({enableGestures: true});
controller.on('animationFrame', function(frame){

	if(frame.hands.length >= 2 && previousFrame){ //手が2本以上認識されている場合の処理

		var hand0 = frame.hands[0]; //hands[0]として認識された手の座標情報8
		var hand1 = frame.hands[1]; //hands[1]として認識された手の座標情報

		//hand0がhand1により左にあれば、左/右の関係をそのように指定
		if(hand0.palmPosition[0] <= hand1.palmPosition[0]){
			handLeft = hand0; handRight = hand1;
		}else{ //hand1がhard0より左にあれば、逆に指定
			handLeft = hand1; handRight = hand0;
		}

		htmlOutput(parseInt(handLeft.palmPosition[1]), parseInt(handRight.palmPosition[1]));
		nigiriCntup(parseInt(handRight.palmPosition[1]));

		//namasute
		// 前のフレームで手が二本の場合にnamasuteFlagが立つ
		if(namasuteFlag) {
			// var gestureString = "namasuteCnt:" + namasuteCnt;
			// 手のX座標が -40 <= X <= 40　に収まっている場合
			if(parseInt(frame.hands[0].palmPosition[0]) >= (-40) && parseInt(frame.hands[0].palmPosition[0]) <= 40　&& parseInt(frame.hands[0].palmPosition[1]) <= 200) {
				// namasuteCntが100ならnamasuteAct関数を起動しCnt初期化。そうでないならnamasuteCntをインクリメント
				if(namasuteCnt === 45) {
					namasuteAct();
					namasuteCnt = 0;
				}else {
					namasuteCnt++;
				}
			}else {
				namasuteCnt = 0;
				namasuteFlag = false;
			}
			// console.log(gestureString);
		}else if(previousFrame.hands.length == 2){
			namasuteFlag = true;
		}

	} else if (frame.hands.length === 1){ //手が1本のみ認識されている場合の処理
		// pizza
		if (frame.gestures.length > 0) {
			for (var i = 0; i < frame.gestures.length; i++) {
				var gesture = frame.gestures[i];
				switch (gesture.type) {
					case "circle":
						//pizzaCntにインクリメント
						pizzaCnt++;
//						var gestureString = "pizzaCnt:" + pizzaCnt;
						//50回ごとにpizzaAct関数を起動
						if (pizzaCnt === 80){
							pizzaAct();
							pizzaCnt = 0;
						}
						break;
					default:
						break;
				}
//				console.log(gestureString);
			}
		}
	}

	previousFrame = frame;
});
controller.connect();