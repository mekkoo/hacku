//寿司起動
//作成者: 河又
//日付: 2013年11月23日(土)
//参考:
//サルでもわかるLeap
//http://syslog.shimy.net/?p=619

var handLeft = 0;
var handRight = 0;
var cnt = 0;
var flag = false;

//HTMLの#consoleにログを出力する用
function htmlOutput(dataLeft, dataRight){
	$("#console_left").text("left: "+dataLeft+" ");
	$("#console_right").text("right: "+dataRight+" ");
}

//寿司注文関数
function sushiAct(){
	alert("sushiAct!");
}

//にぎりカウントアップ にぎり回数が3に達するとsushiAct()発火
function nigiriCntup(yPosition){
	var nigiriWatcher = $("#nigiri_watcher");
	var cntConsole = $("#cnt_console");
	if(yPosition >= 250){ //yが250以上の場合
		if(!flag) { //すでに250以上の場合、カウント処理をスキップ
			flag = true; //カウント中断のフラグを建てる
			cnt++; //カウントアップ
			cntConsole.text(cnt);
			if(cnt  === 3){ //3に達するとsushiAct()発火
				sushiAct(); //寿司注文関数
			}
		}
		init.removeClass("hide").text(yPosition);
	}else if(yPosition <= 250){ //yが250以下の場合
		if(flag) {
			flag = false;
		}
		init.addClass("hide");
	}
}

//Leapオブジェクトを継承後、永久ループでモーション監視へ
var controller = new Leap.Controller({enableGestures: true});
controller.on('animationFrame', function(frame){
	var frameString = "Frame ID: "  + frame.id  + ","
			+ "Timestamp: " + frame.timestamp + ","
			+ "Hands: "     + frame.hands.length + ","
			+ "Fingers: "   + frame.fingers.length + ","
			+ "Tools: "     + frame.tools.length + ","
			+ "Gestures: "  + frame.gestures.length + ",";

	if(frame.hands.length >= 2){ //手が2本以上ないと認識しないように
		var hand0 = frame.hands[0]; //hands[0]として認識された手の座標情報
		var hand1 = frame.hands[1]; //hands[1]として認識された手の座標情報

		//hand0がhand1により左にあれば、左/右の関係をそのように指定
		if(hand0.palmPosition[0] <= hand1.palmPosition[0]){
			handLeft = hand0; handRight = hand1;
		}else{ //hand1がhard0より左にあれば、逆に指定
			handLeft = hand1; handRight = hand0;
		}

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

		htmlOutput(parseInt(handLeft.palmPosition[1]), parseInt(handRight.palmPosition[1]));
		nigiriCntup(parseInt(handRight.palmPosition[1]));
	}

});
controller.connect();