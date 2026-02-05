const firebaseConfig = {
  apiKey: "AIzaSyD0SccKNWtqgJrsCZepyA5PfFHqfajB2bw",
  authDomain: "denntetu.firebaseapp.com",
  databaseURL: "https://denntetu-default-rtdb.firebaseio.com",
  projectId: "denntetu",
  storageBucket: "denntetu.firebasestorage.app",
  messagingSenderId: "233879036281",
  appId: "1:233879036281:web:aa66129cfa45b7dfaf0fa8",
  measurementId: "G-0L4G45YDYM"
};

// Firebase 初期化
firebase.initializeApp(firebaseConfig);

// Realtime Database 取得
const database = firebase.database();


let myTeam = null;
let rollDiceBtnA, rollDiceBtnB;
let arriveBtnA, arriveBtnB;
let waitA, waitB;

function rollDice10() {
  return Math.floor(Math.random() * 10) + 1;

}

const stations = [
  { id: 0, name: "名古屋", type: "start" },

  { id: 1, name: "尾頭橋" },
  { id: 2, name: "金山" },
  { id: 3, name: "熱田" },
  { id: 4, name: "笠寺" },
  { id: 5, name: "大高" },
  { id: 6, name: "南大高" },
  { id: 7, name: "共和" },
  { id: 8, name: "大府" },
  { id: 9, name: "逢妻" },
  { id: 10, name: "刈谷" },
  { id: 11, name: "野田新町" },
  { id: 12, name: "東刈谷" },
  { id: 13, name: "三河安城" },
  { id: 14, name: "安城" },
  { id: 15, name: "西岡崎" },
  { id: 16, name: "岡崎" },
  { id: 17, name: "相見" },
  { id: 18, name: "幸田" },
  { id: 19, name: "三ヶ根" },
  { id: 20, name: "三河塩津" },
  { id: 21, name: "蒲郡" },
  { id: 22, name: "三河三谷" },
  { id: 23, name: "三河大津" },
  { id: 24, name: "愛知御津" },
  { id: 25, name: "西小坂井" },

  { id: 26, name: "豊橋", type: "transfer" },

  { id: 27, name: "二川", note: "静岡行" },
  { id: 28, name: "新所原" },
  { id: 29, name: "鷲津" },
  { id: 30, name: "新居町" },
  { id: 31, name: "弁天島" },
  { id: 32, name: "舞阪" },
  { id: 33, name: "高塚" },
  { id: 34, name: "浜松" },

  { id: 35, name: "天竜川" },
  { id: 36, name: "豊田町" },
  { id: 37, name: "磐田" },
  { id: 38, name: "御厨" },
  { id: 39, name: "袋井" },
  { id: 40, name: "愛野" },
  { id: 41, name: "掛川" },
  { id: 42, name: "菊川" },
  { id: 43, name: "金谷" },

  { id: 44, name: "島田", type: "transfer" },

  { id: 45, name: "六合", note: "熱海行" },
  { id: 46, name: "藤枝" },
  { id: 47, name: "西焼津" },
  { id: 48, name: "焼津" },
  { id: 49, name: "用宗" },
  { id: 50, name: "安倍川" },
  { id: 51, name: "静岡" },
  { id: 52, name: "東静岡" },
  { id: 53, name: "草薙" },
  { id: 54, name: "清水" },
  { id: 55, name: "興津" },
  { id: 56, name: "由比" },
  { id: 57, name: "蒲原" },
  { id: 58, name: "新蒲原" },
  { id: 59, name: "富士川" },
  { id: 60, name: "富士" },
  { id: 61, name: "吉原" },
  { id: 62, name: "東田子の浦" },
  { id: 63, name: "原" },
  { id: 64, name: "片浜" },
  { id: 65, name: "沼津" },
  { id: 66, name: "三島" },
  { id: 67, name: "函南" },

  { id: 68, name: "熱海", type: "transfer" },

  { id: 69, name: "湯河原", note: "上野東京ライン" },
  { id: 70, name: "真鶴" },
  { id: 71, name: "根府川" },
  { id: 72, name: "早川" },
  { id: 73, name: "小田原" },
  { id: 74, name: "鴨宮" },
  { id: 75, name: "国府津" },
  { id: 76, name: "二宮" },
  { id: 77, name: "大磯" },
  { id: 78, name: "平塚" },
  { id: 79, name: "茅ヶ崎" },
  { id: 80, name: "辻堂" },
  { id: 81, name: "藤沢" },
  { id: 82, name: "大船" },
  { id: 83, name: "戸塚" },

  { id: 84, name: "横浜", type: "goal" }
];

// チーム状態
const teams = {
  A: {
    position: 0,
    phase: "BEFORE_ROLL", // ← 唯一の状態
    waitUntil: null,
    nextPosition: null,
    history: []
  },
  B: {
    position: 0,
    phase: "BEFORE_ROLL",
    waitUntil: null,
    nextPosition: null,
    history: []
  }
};


// 表示更新
function updateView() {
  ["A", "B"].forEach(teamKey => {
    const team = teams[teamKey];

    // 現在地
    document.getElementById(`team${teamKey}-position`).textContent =
      stations[team.position]?.name ?? "不明";

    // 到着予定駅（★ここが追加）
    const arrivalEl = document.getElementById(`team${teamKey}-arrival`);
    if (team.phase === "ROLLED" && team.nextPosition != null) {
      arrivalEl.textContent =
        `到着予定駅: ${stations[team.nextPosition].name}`;
    } else {
      arrivalEl.textContent = "到着予定駅: -";
    }
  });
}

function updateControlLock() {
  ["A", "B"].forEach(teamKey => {
    const team = teams[teamKey];
    const isMine = myTeam === teamKey;

    const rollBtn   = document.getElementById(`rollDiceBtn${teamKey}`);
    const arriveBtn = document.getElementById(`arriveBtn${teamKey}`);
    const undoBtn   = document.getElementById(`undoBtn${teamKey}`);
    const walkInput = document.getElementById(`walk${teamKey}`);
    const addBtn    = document.getElementById(`addWalk${teamKey}`);

    // 全部非表示
    rollBtn.style.display = "none";
    arriveBtn.style.display = "none";
    undoBtn.style.display = "none";
    walkInput.style.display = "none";
    addBtn.style.display = "none";

    if (!isMine) return;

    switch (team.phase) {
      case "BEFORE_ROLL":
        rollBtn.style.display = "inline-block";
        undoBtn.style.display = "inline-block";
        rollBtn.disabled = false;
        break;

      case "ROLLED":
        arriveBtn.style.display = "inline-block";
        arriveBtn.disabled = false;
        break;

      case "WAITING":
        rollBtn.disabled = true;
        arriveBtn.disabled = true;
        break;

      case "AFTER_WAIT":
        walkInput.style.display = "inline-block";
        addBtn.style.display = "inline-block";
        break;
    }
  });
}


window.addEventListener("DOMContentLoaded", () => {

  waitA = document.getElementById("waitA");
  waitB = document.getElementById("waitB");

  rollDiceBtnA = document.getElementById("rollDiceBtnA");
  rollDiceBtnB = document.getElementById("rollDiceBtnB");
  arriveBtnA   = document.getElementById("arriveBtnA");
  arriveBtnB   = document.getElementById("arriveBtnB");

  loadProgress();
  updateView();
  updateControlLock();
  updateScreen();
  updateMyTeamLabel();

  const diceResultA = document.getElementById("diceResultA");
  const diceResultB = document.getElementById("diceResultB");

  const registerBtn = document.getElementById("registerBtn");
  const registerScreen = document.getElementById("registerScreen");
  const gameScreen = document.getElementById("gameScreen");

  registerBtn.addEventListener("click", () => {
    const name = document.getElementById("playerName").value.trim();
    const team = document.getElementById("teamSelect").value;

    if (!name) {
      alert("名前を入力してください");
      return;
    }

    myTeam = team;
    saveProgress();

    registerScreen.style.display = "none";
    gameScreen.style.display = "block";

    updateControlLock();
    updateMyTeamLabel();
  });


  document.getElementById("arriveBtnA").addEventListener("click", () => {
    arriveTeam("A");
  });

  document.getElementById("arriveBtnB").addEventListener("click", () => {
    arriveTeam("B");
  });

  document.getElementById("undoBtnA").addEventListener("click", () => undoMove("A"));
  document.getElementById("undoBtnB").addEventListener("click", () => undoMove("B")); 
  
  document.getElementById("addWalkA").addEventListener("click", () => {
    addWalk("A");
  });

  document.getElementById("addWalkB").addEventListener("click", () => {
    addWalk("B");
  });

  rollDiceBtnA.addEventListener("click", () => {
    rollForTeam("A", diceResultA);
  });

  rollDiceBtnB.addEventListener("click", () => {
    rollForTeam("B", diceResultB);
  });
  
  const resetBtn = document.getElementById("resetBtn");

  resetBtn.addEventListener("click", () => {
    if (!confirm("すべての進捗をリセットします。よろしいですか？")) {
      return;
    }

  // ② 状態を初期化
    myTeam = null;
      teams.A.position = 0;
      teams.B.position = 0;

      teams.A.waitUntil = null;
      teams.B.waitUntil = null;

      teams.A.nextPosition = null;
      teams.B.nextPosition = null;

      teams.A.phase = "BEFORE_ROLL";
      teams.B.phase = "BEFORE_ROLL";
      
      diceResultA.textContent = "-";
      diceResultB.textContent = "-";

      teams.A.history = [];
      teams.B.history = [];

      database.ref("logs").remove();

      updateView();
      updateControlLock();
      updateScreen();
      updateMyTeamLabel();
    });

  const overlayCloseBtn = document.getElementById("overlayCloseBtn");
  const overlay = document.getElementById("overlay");

  overlayCloseBtn.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  // ③ 表示更新
    updateView();
    updateControlLock();
    updateScreen();
    updateMyTeamLabel();
  });

  database.ref("routeGame").on("value", snapshot => {
    const data = snapshot.val();
    if (!data) return;

    Object.assign(teams, data.teams);
    updateView();
    updateControlLock();
  });

 function saveProgress() {
  database.ref("routeGame").set({
    teams,
    updatedAt: Date.now()
  });

  if (myTeam) {
    localStorage.setItem("myTeam", myTeam);
  }
}


function startWaiting(teamKey) {
  const team = teams[teamKey];

  if (team.arrived) {
    alert("すでに到着しています");
    return;
  }

  team.waiting = true;

  // ★ 今から1時間後の時刻を保存
  team.waitUntil = Date.now() +  5 * 1000;// 5秒

  updateControlLock();
  saveProgress();
}

function findNextNoteStation(fromIndex) {
  for (let i = fromIndex + 1; i < stations.length; i++) {
    if (stations[i].note) {
      return stations[i];
    }
  }
  return null;
}

function showTransferOverlay(transferStation, nextStation) {
  const overlay = document.getElementById("overlay");
  const text = document.getElementById("overlayText");

  text.innerHTML = `
    <strong>${transferStation.name}駅で乗り換えです</strong><br>
    ${nextStation.note} に乗り換えてください
  `;

  overlay.style.display = "flex";
}

function showGoalOverlay() {
  const overlay = document.getElementById("overlay");
  const text = document.getElementById("overlayText");

  text.innerHTML = `
    <strong>🎉 ゴール！</strong><br>
    あとは到着するだけ！
  `
  overlay.style.display = "flex";
}

function loadProgress() {
  const gameRef = database.ref("routeGame");

  const savedTeam = localStorage.getItem("myTeam");
  if (savedTeam) {
    myTeam = savedTeam;
  }

  gameRef.once("value", snapshot => {
    const data = snapshot.val();

    if (!data) {
      // 初期データを作る
      database.ref("routeGame").set({
        teams,
        updatedAt: Date.now()
      });
      return;
    }

    // Firebase のデータを反映
    Object.assign(teams, data.teams);

    // 画面更新
    updateView();
    updateControlLock();
    updateScreen();
    updateMyTeamLabel();
    updateWaitingTimeView();
  });
  if (myTeam) {
    updateControlLock();
  }
}


function updateScreen() {
  const msg = document.getElementById("needRegisterMsg");
  const registerScreen = document.getElementById("registerScreen");
  const gameScreen = document.getElementById("gameScreen");

  if (myTeam) {
    registerScreen.style.display = "none";
    gameScreen.style.display = "block";
    msg.style.display = "none";
  } else {
    registerScreen.style.display = "block";
    gameScreen.style.display = "none";
    msg.style.display = "block";
  }
}

function updateMyTeamLabel() {
  const label = document.getElementById("myTeamLabel");

  if (!myTeam) {
    label.textContent = "";
    return;
  }

  label.textContent = `あなたは ${myTeam}チームです`;
}

function rollForTeam(teamKey, resultEl) {
  const team = teams[teamKey];
  if (team.phase !== "BEFORE_ROLL") return;
  const oldPosition = team.position;

  if (!myTeam) {
    alert("先にチーム登録をしてください");
    return;
  }
  // （必要なら）自分のチーム制限
  if (myTeam !== teamKey) {
    alert("自分のチームだけ操作できます");
    return;
  }

  // ① サイコロ
  if (team.phase !== "BEFORE_ROLL") return;

  const dice = Math.floor(Math.random() * 10) + 1;
  resultEl.textContent = dice;

  logAction(teamKey, "ROLL_DICE");

  team.history = [team.position];
  team.nextPosition = Math.min(team.position + dice, stations.length - 1);
  team.phase = "ROLLED";

  // 到着予定駅を表示
  const arrivalEl = document.getElementById(`team${teamKey}-arrival`);
  arrivalEl.textContent = `到着予定駅: ${stations[team.nextPosition].name}`;

  // ゴール判定
  const goalIndex = stations.findIndex(s => s.type === "goal");
  if (oldPosition < goalIndex && team.nextPosition >= goalIndex) {
    showGoalOverlay();
  }

  // 乗り換え判定
  for (let i = oldPosition + 1; i <= team.nextPosition; i++) {
    if (stations[i].type === "transfer") {
      const nextNoteStation = findNextNoteStation(i);
      if (nextNoteStation) {
        showTransferOverlay(stations[i], nextNoteStation);
        break;
      }
    }
  }


  // ③ 表示・保存
  updateView();
  updateControlLock();
  saveProgress();
};

// 「到着ボタン」を押したとき
function arriveTeam(teamKey) {
  if (myTeam !== teamKey) {
    alert("自分のチームだけ操作できます");
    return;
  }
  const team = teams[teamKey];
  if (team.phase !== "ROLLED") return;

  team.position = team.nextPosition;
  logAction(teamKey, "ARRIVE");
  team.nextPosition = null;
  team.phase = "WAITING";
  team.waiting = true;
  team.waitUntil = Date.now() + 5000;

  const arrivalEl = document.getElementById(`team${teamKey}-arrival`);
  arrivalEl.textContent = "到着予定駅: -";

  updateView();
  updateControlLock();
  saveProgress();
}

function addWalk(teamKey) {
  if (myTeam !== teamKey) {
    alert("自分のチームだけ操作できます");
    return;
  }

  const team = teams[teamKey];

  // フェーズ制限
  if (team.phase !== "AFTER_WAIT") {
    alert("今は歩いた駅数を入力できません");
    return;
  }

  const inputEl = document.getElementById(`walk${teamKey}`);
  const steps = Number(inputEl.value);

  if (isNaN(steps) || steps < 0) {
    alert("正しい駅数を入力してください");
    return;
  }

  const oldPosition = team.position;
  const newPosition = Math.min(
    team.position + steps,
    stations.length - 1
  );

  team.history = [team.position];
  team.position = newPosition;
  logAction(teamKey, "ADD_WALK");
  team.phase = "BEFORE_ROLL";

  // 乗り換え判定
  for (let i = oldPosition + 1; i <= newPosition; i++) {
    if (stations[i].type === "transfer") {
      const nextNoteStation = findNextNoteStation(i);
      if (nextNoteStation) {
        showTransferOverlay(stations[i], nextNoteStation);
        break;
      }
    }
  }

  // ゴール判定
  if (stations[newPosition].type === "goal") {
    showGoalOverlay();
  }

  inputEl.value = "";

  updateView();
  updateControlLock();
  saveProgress();
}

function formatTime(ms) {
  const totalSec = Math.ceil(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}分${sec}秒`;
}

function updateWaitingTimeView() {
  ["A", "B"].forEach(key => {
    const team = teams[key];
    const el = document.getElementById(`wait${key}`);

    if (team.waiting && team.waitUntil) {
      const remain = team.waitUntil - Date.now();
      el.textContent = `⏳ 残り ${formatTime(remain)}`;
    } else {
      el.textContent = "";
    }
  });
}

function updateWaitingStatus() {
  const now = Date.now();

  ["A", "B"].forEach(teamKey => {
    const team = teams[teamKey];
    const el = teamKey === "A" ? waitA : waitB;

    if (team.waiting && team.waitUntil) {
      const remain = team.waitUntil - now;

      if (remain <= 0) {
        team.waiting = false;
        team.waitUntil = null;
        team.history = [team.position];
        const arrivalEl = document.getElementById(`team${teamKey}-arrival`);
        if (arrivalEl) {
          arrivalEl.textContent = "到着予定駅: ―";
        }
        el.textContent = "-";

  if (remain <= 0) {
    team.phase = "AFTER_WAIT";
    team.waitUntil = null;

  if (myTeam === teamKey) {
    alert(`${teamKey}チーム、出発できます！`);
  }
    saveProgress();
  }

      } else {
        const min = Math.floor(remain / 60000);
        const sec = Math.floor((remain % 60000) / 1000);
        el.textContent = `${min}分${sec}秒`;
      }

    } else {
      el.textContent = "-";
    }
  });

  updateControlLock();
}

function undoMove(teamKey) {
  const team = teams[teamKey];
 
  if (myTeam !== teamKey) {
    alert("自分のチームだけ操作できます");
    return;
  }

  if (team.phase !== "BEFORE_ROLL") {
    alert("今は修正できません");
    return;
  }

  if (team.history.length === 0) {
    alert("修正できる履歴がありません");
    return;
  }

  if (!confirm("前のターンの歩数を取り消しますか？")) {
    return;
  }

  team.position = team.history[0];
  logAction(teamKey, "UNDO");
  team.history = [];
  team.phase = "AFTER_WAIT";

  updateView();
  updateControlLock();
  saveProgress();
}

setInterval(() => {
  updateWaitingStatus();
  updateWaitingTimeView();
}, 1000);

function logAction(teamKey, action) {
  database.ref("logs").push({
    team: teamKey,
    action: action,
    phase: teams[teamKey].phase,
    position: teams[teamKey].position,
    time: Date.now()
  });
}