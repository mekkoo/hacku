//ナマステ起動
//作成者: 河又
//日付: 2013年11月23日(土)
//参考:
//サルでもわかるLeap
//http://syslog.shimy.net/?p=619

var namasuteCnt = "";
var handLeft = "";
var handRight= "";

//寿司注文関数
function namasuteAct(){
	console.log('namasuteAct!');
}

function vectorToString(vector, digits) {
	if (typeof digits === "undefined") {
		digits = 1;
	}
	return "(" + vector[0].toFixed(digits) + ", "// toFixed(digits)は小数点digits桁以下を切り捨てする処理
			+ vector[1].toFixed(digits) + ", "
			+ vector[2].toFixed(digits) + ")";
}

//HTMLの#consoleにログを出力する関数 通常使わない
function htmlOutput(dataLeft, dataRight){
	$("#console_left").text("left: "+dataLeft+" ");
	$("#console_right").text("right: "+dataRight+" ");
}

//Leapオブジェクトを継承後、永久ループでモーション監視へ
Leap.loop(function(frame){
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
			"handLeft: " +
				handLeft.palmPosition[0] + //左手のX座標
			"  handID: " +
				handLeft.id + //左手の一時的ID
			"  palmVelocity: " +
				handLeft.palmVelocity
		);

		console.log(
			"handRight: " +
				handRight.palmPosition[0] + //右手のX座標
			"  handID: " +
				handRight.id + //右手の一時的ID
			"  palmVelocity: " +
				handRight.palmVelocity
		);

		htmlOutput(parseInt(handLeft.palmVelocity[0]), parseInt(handRight.palmVelocity[0]));

	}

});