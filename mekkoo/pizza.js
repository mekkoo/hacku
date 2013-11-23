//ピザ起動
//作成者: 河又
//日付: 2013年11月23日(土)
//参考:
//サルでもわかるLeap
//http://syslog.shimy.net/?p=619


//ループ外で変数を用意
var pizzaCnt = "";

//ピザ注文関数
function pizzaAct(){
	console.log('pizzaAct!');
}

Leap.loop(function(frame){
	//ジェスチャーにまつわる情報を格納する変数
	var gestureString = "";

	if (frame.gestures.length > 0) {
		for (var i = 0; i < frame.gestures.length; i++) {
			var gesture = frame.gestures[i];
			gestureString += "Gesture ID: " + gesture.id + ", "
					+ "type: " + gesture.type + ", "
					+ "state: " + gesture.state + ", "
					+ "hand IDs: " + gesture.handIds.join(", ") + ", "
					+ "pointable IDs: " + gesture.pointableIds.join(", ") + ", "
					+ "duration: " + gesture.duration + " &micro;s, ";

			switch (gesture.type) {
				case "circle":
						//pizzaCntにインクリメント
						pizzaCnt++;
						gestureString += "pizzaCnt:" + pizzaCnt;
						//100回ごとにpizzaAct関数を起動
						if (pizzaCnt % 100 === 0) pizzaAct();
					break;
				default:
					gestureString += "unkown gesture type";
			}
			console.log(gestureString);
		}
	}
});