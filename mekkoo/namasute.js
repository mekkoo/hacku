//ナマステ起動
//作成者: 須田
//日付: 2013年11月23日(土)
//参考:
//サルでもわかるLeap
//http://syslog.shimy.net/?p=619

var namasuteCnt = "";
var handLeft = "";
var handRight = "";
var outCnt = "";
var previousFrame = "";
var flag = false;

//ナマステ注文関数
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

//HTMLの#consoleにログを出力する関数
function htmlOutput(dataLeft, dataRight){
	$("#console_left").text("left: "+dataLeft+" ");
	$("#console_right").text("right: "+dataRight+" ");
}

function handRightInit(yPosition){
	var init = $("#init");
	switch (yPosition){
		case "out":
			outCnt++;
			init.addClass("hide");
			break;
		default:
			init.removeClass("hide").text(yPosition);
			break;
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

	if(frame.hands.length >= 2 && previousFrame){ //手が2本以上ないと認識しないように
		var hand0 = frame.hands[0]; //hands[0]として認識された手の座標情報
		var hand1 = frame.hands[1]; //hands[1]として認識された手の座標情報

		//hand0がhand1により左にあれば、左/右の関係をそのように指定
		if(hand0.palmPosition[0] <= hand1.palmPosition[0]){
			handLeft = hand0; handRight = hand1;
		}else{ //hand1がhard0より左にあれば、逆に指定
			handLeft = hand1; handRight = hand0;
		}

		// console.log(
		// 	"handLeftX: " +
		// 		handLeft.palmPosition[0] + //左手のX座標
		// 	"handLeftY: " +
		// 		handLeft.palmPosition[1] + //左手のX座標
		// 	"handLeftZ: " +
		// 		handLeft.palmPosition[2] + //左手のX座標
		// 	"handID: " +
		// 		handLeft.id + //左手の一時的ID
		// 	"palmVelocity: " +
		// 		handLeft.palmVelocity
		// );

		// console.log(
		// 	"handRightX: " +
		// 		// handRight.palmPosition[0] + //右手のX座標
		// 	"handRightY: " +
		// 		handRight.palmPosition[1] + //右手のX座標
		// 	"handRightZ: " +
		// 		// handRight.palmPosition[2] + //右手のX座標
		// 	"handID: " +
		// 		handRight.id + //右手の一時的ID
		// 	"palmVelocity: " +
		// 		handRight.palmVelocity
		// );

		// htmlOutput(parseInt(handLeft.palmPosition[1]), parseInt(handRight.palmPosition[1]));

		// if(parseInt(handRight.palmPosition[1]) >= 250){
		// 	handRightInit(parseInt(handRight.palmPosition[1]));
		// }else{
		// 	handRightInit("out");
		// } 

		if(!flag && previousFrame.hands.length == 2) {
			flag = true;
		}else {
			if(parseInt(frame.hands[0].palmPosition[0]) >= (-40) && parseInt(frame.hands[0].palmPosition[0]) <= 40) {
				handRightInit(parseInt(frame.hands[0].palmPosition[0]));
				namasuteCnt++;
			}else {
				handRightInit("out");
				console.log("-----------------------------");
				flag = false;
			}
			if(namasuteCnt == 100) {
				namasuteAct();
				namasuteCnt = 0;
			}
		}	
	}
	// else if(frame.hands.length == 1 && previousFrame) {
	// }

	previousFrame = frame;
});
controller.connect();