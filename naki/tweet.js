#!/usr/bin/env phantomJS

var page = require('webpage').create(),
    system = require('system');
// Twitterのアカウントを指定する
var aco = {
  twitterID : "IDいれる",
  twitterPW : "ぱすわーどいれる"
};
// 書き込みを行うメッセージを指定
// var comment = "Hello, from PhantomJS! --- " + Math.random();
var comment = "PhantomJSてすと --- " + Math.random();


// ログインと書き込みのURL
var loginURI = "https://mobile.twitter.com/session/new";
var tweetURI = "https://mobile.twitter.com/compose/tweet";
var baseURI = "https://mobile.twitter.com/";

// メッセージ表示用
page.onConsoleMessage = function(msg) {
  console.log("con> " + msg);
};
page.onUrlChanged = function(targetUrl) {
  console.log('onUrlChanged: ' + targetUrl);
};
// Twitterへ書き込むまでの手順
var tasks = [
  function () {
    page.open(loginURI);
  },
  function () {
    page.evaluate(function(aco) {
      // login
      document.getElementById("username").value = aco.twitterID;
      document.getElementById("password").value = aco.twitterPW;
      document.querySelector("form").submit();

    }, aco);
  },
  function () {
    page.open(tweetURI);
  },
  function () {
    page.evaluate(function(comment) {
      console.log("フォームへ書き込み中");
      var e = document.querySelector("textarea");
      e.value = comment;
      e = document.querySelector("form.tweetform");
      e.submit();
    }, comment);
  },
  function () {
    console.log("タスク完了");
    page.render("result.png");
    phantom.exit();
  }
];
// 各種タスクを実行
page.onLoadFinished = function (status) {
  // 広告など外部サイトのページロードを無視
  if (page.url.substr(0, baseURI.length) !== baseURI) return;
  console.log("onLoadFinished:" + page.url);
  var task = tasks.shift();
  task();
};
(tasks.shift())();


