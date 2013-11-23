//ピザ・すし・ナマステ起動
//作成者: 須田
//日付: 2013年11月23日(土)
//参考:
//スマートちゃんぷる: LeapTrainer.jsを使ってみる
//http://smartchamploo.blogspot.jp/2013/09/leaptrainerjs.html


//ループ外で変数を用意
var pizzaCnt = "";

//ピザ注文関数
function pizzaAct(){
	console.log('pizzaAct!');
}

var controller = new Leap.Controller({enableGestures: true});
//create a LeapTrainer controller object
var trainer = new LeapTrainer.Controller({controller: controller});
trainer.fromJSON('{"name":"NAMASUTE","pose":false,"data":[[{"x":0.4454638857849339,"y":-0.07073768692041396,"z":0.16706227388647343,"stroke":1},{"x":0.16141359189388693,"y":0.1282883935199512,"z":-0.3585075644771397,"stroke":1},{"x":-0.5545361142150661,"y":-0.04621326647368436,"z":0.12200601519683518,"stroke":1},{"x":0.12535587428286354,"y":-0.07076414646408213,"z":0.17730933219393485,"stroke":1},{"x":0.31991086227993726,"y":0.12880112916675246,"z":-0.3660447865364427,"stroke":1},{"x":-0.32089013813342027,"y":0.006517559117547103,"z":-0.0200936961365335,"stroke":1},{"x":-0.10835212499679281,"y":-0.07003367047863825,"z":0.1868490601767272,"stroke":1},{"x":0.33117297414326463,"y":0.0583901276304649,"z":-0.16792160985402751,"stroke":1},{"x":-0.16208273079809016,"y":0.04506849405543788,"z":-0.11852706279093048,"stroke":1},{"x":-0.23695627418361753,"y":-0.06794662085757502,"z":0.19795870124973836,"stroke":1},{"x":0.3102275504700579,"y":0.030454829881583725,"z":-0.07536453086756828,"stroke":1},{"x":-0.10309547595222429,"y":0.060739530601779404,"z":-0.14894807477251934,"stroke":1},{"x":-0.23396618410196185,"y":-0.06551386211775365,"z":0.21067526103933498,"stroke":1},{"x":0.2697340191737425,"y":0.050329275116181446,"z":-0.10240518717736224,"stroke":1},{"x":-0.243399715647513,"y":-0.11738008577755064,"z":0.2959518688694801,"stroke":1}]]}');
trainer.fromJSON('{"name":"SUSHI","pose":false,"data":[[{"x":0.47908447620325223,"y":0.08973994969388302,"z":0.5292734251501678,"stroke":1},{"x":-0.39382182390627674,"y":-0.20159140346599982,"z":-0.1998792022636448,"stroke":1},{"x":0.26664489525430046,"y":0.07251333740909463,"z":0.2890840907667919,"stroke":1},{"x":-0.11183434507716183,"y":-0.07963499463044449,"z":0.0044560863660159655,"stroke":1},{"x":0.009201450119828758,"y":-0.011349402054519064,"z":0.02535131738135815,"stroke":1},{"x":0.18720145835657587,"y":0.0669443118076625,"z":0.13547837845955968,"stroke":1},{"x":-0.2664741899371097,"y":-0.117797453229158,"z":-0.17602597884270335,"stroke":1},{"x":0.45821473943143254,"y":0.2459686549250296,"z":0.17770115218371152,"stroke":1},{"x":-0.5046599525192108,"y":-0.23552672058392357,"z":-0.2908470856038062,"stroke":1},{"x":0.45234707620363024,"y":0.3042416783027051,"z":0.06463468499435926,"stroke":1},{"x":-0.21507554597929374,"y":-0.07013374073068218,"z":-0.18234913586425355,"stroke":1},{"x":0.16008728564677877,"y":0.17069065656456586,"z":-0.09550486990859738,"stroke":1},{"x":-0.5209155237967478,"y":-0.2340648740082141,"z":-0.2813728628189591,"stroke":1}]]}');

controller.loop(function(frame){
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
						console.log(gestureString);
					break;
				default:
					gestureString += "unkown gesture type";
			}
			// console.log(gestureString);
		}
	}

	trainer.on('NAMASUTE', function() {
		console.log('NAMASUTEEEEEEE!!!!');
	});
	trainer.on('SUSHI', function() {
		console.log('I like SUSHI....');
	});

});