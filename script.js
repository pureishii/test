// 現在のスコアを記録する変数
let score = 0;

// 以前保存したハイスコアを読み込む（localStorageから取得）
let highScore = localStorage.getItem("highScore") || 0;

// ハイスコアを画面に表示
document.getElementById("highscore").textContent = highScore;

// HTML内の要素を変数にしておく（操作を簡単にするため）
const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const startButton = document.getElementById("start-btn");

// 敵の出現とタイマー用の変数（あとで止めるために必要）
let gameInterval;
let timerInterval;

// ゲームの制限時間（秒）
let timeLimit = 10;

// ゲームスタート時に呼ばれる関数
function startGame() {
  score = 0; // スコアを0に戻す
  scoreDisplay.textContent = score; // 表示もリセット
  startButton.disabled = true; // ボタンを連打できないように無効化

  gameArea.innerHTML = ""; // ゲームエリアを空にする
  clearInterval(gameInterval); // 前回のゲームが動いていたら止める
  clearInterval(timerInterval);

  timeLimit = 10; // 制限時間を再設定

  // 残り時間・スコア・ハイスコアを表示
  document.getElementById("score-area").textContent =
    `スコア: 0 / ハイスコア: ${highScore} / 残り: ${timeLimit}s`;

  // 1秒ごとに敵を出現させる
  gameInterval = setInterval(spawnEnemy, 1000);

  // 1秒ごとにタイマーをカウントダウンする
  timerInterval = setInterval(() => {
    timeLimit--; // 残り秒数を1減らす

    // スコア表示を更新
    document.getElementById("score-area").textContent =
      `スコア: ${score} / ハイスコア: ${highScore} / 残り: ${timeLimit}s`;

    // 時間切れになったらゲーム終了
    if (timeLimit <= 0) {
      endGame();
    }
  }, 1000);
}

// ゲームを終了する関数
function endGame() {
  clearInterval(gameInterval); // 敵出現を止める
  clearInterval(timerInterval); // タイマーを止める
  startButton.disabled = false; // スタートボタンを再び有効にする

  // 今回のスコアがハイスコアを超えたら保存する
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore); // ブラウザに保存
  }

  // 最終結果を表示
  document.getElementById("score-area").textContent =
    `🎉 ゲーム終了！ スコア: ${score} / ハイスコア: ${highScore}`;
}

// 敵キャラを1体出現させる関数
function spawnEnemy() {
  // divタグを作って、enemyクラスをつける
  const enemy = document.createElement("div");
  enemy.className = "enemy";

  // 敵の出現位置（画面内のランダムな場所）
  const maxX = gameArea.clientWidth - 60;  // 敵の幅ぶん引いてる
  const maxY = gameArea.clientHeight - 60;
  enemy.style.left = Math.random() * maxX + "px";
  enemy.style.top = Math.random() * maxY + "px";

  // 敵をクリック（タップ）したときの処理
  enemy.addEventListener("click", () => {
    gameArea.removeChild(enemy); // 敵を消す
    score++; // スコアを1加算
    scoreDisplay.textContent = score; // 表示を更新

    // ハイスコアを更新
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore); // 保存
    }
  });

  // 3秒たってもタップされなければ自動で消す
  setTimeout(() => {
    if (gameArea.contains(enemy)) {
      gameArea.removeChild(enemy);
    }
  }, 3000);

  // 敵を画面に追加
  gameArea.appendChild(enemy);
}

// 「スタート」ボタンが押されたらゲーム開始
startButton.addEventListener("click", startGame);
