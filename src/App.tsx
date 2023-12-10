import { useState, useEffect } from "react";
import {
  postSuggestPlanApi,
  getTotalProgressApi,
  getGoalApi,
  postAcceptPlanApi,
  postTodayPlansApi,
  postSubmitProgressApi,
} from "./utils/links";
import "./App.css";
import imgCongrats from "./assets/kusudama_1170.png";

export default function App() {
  const [uiState, setUIState] = useState<UIState>(UIState.Start);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansIdsId, setPlansIdsId] = useState<number | null>(null);
  const [tasksIdsId, setTasksIdsId] = useState<number | null>(null);
  const [day, setDay] = useState<number>(1);

  return (<>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link href="https://fonts.googleapis.com/css2?family=Yusei+Magic&display=swap" rel="stylesheet"></link>
    <div className="App">
      <div className="navi">
        <button onClick={() => setUIState(UIState.Start)}>はじめる</button>
        <button onClick={() => setUIState(UIState.Plan)}>お手伝いプラン</button>
        <button onClick={() => setUIState(UIState.Record)}>日々の記録</button>
        <button onClick={() => setUIState(UIState.Progress)}>進捗</button>
      </div>

      <div>
        {uiState === UIState.Start && <Start setPlans={setPlans} setPlansIdsId={setPlansIdsId} setTasksIdsId={setTasksIdsId} onNextPressed={() => setUIState(UIState.Plan)} />}
        {uiState === UIState.Plan && <Plan plans={plans} plansIdsId={plansIdsId} tasksIdsId={tasksIdsId} onBackPressed={() => setUIState(UIState.Start)} onNextPressed={() => setUIState(UIState.Record)} />}
        {uiState === UIState.Record && <Record day={day} setDay={setDay} onNextPressed={() => setUIState(UIState.Progress)} />}
        {uiState === UIState.Progress && <Progress />}
      </div>
    </div>
  </>
  );

}

interface StartProps {
  setPlans: (plans: Plan[]) => void;
  setPlansIdsId: (plansIdsId: number | null) => void;
  setTasksIdsId: (tasksIdsId: number | null) => void;
  onNextPressed: () => void;
}

// ここからをメインでいじってください!
function Start({ setPlans, setPlansIdsId, setTasksIdsId, onNextPressed }: StartProps) {
  const [itemName, setItemName] = useState("");
  const [requiredPoint, setRequiredPoint] = useState(100);
  const [tasks, setTasks] = useState<Task[]>([{ task: "", point: 0 }]);

  const handleOnAddTask = () => {
    setTasks([...tasks, { task: "", point: 0 }]);
  };

  const handleOnChangeTask = (index: number, task: string) => {
    const newTasks = [...tasks];
    newTasks[index].task = task;
    setTasks(newTasks);
  };

  const handleOnChangePoint = (index: number, point: number) => {
    const newTasks = [...tasks];
    newTasks[index].point = point;
    setTasks(newTasks);
  };

  const handleOnClear = () => {
    setItemName("");
    setRequiredPoint(100);
    setTasks([{ task: "", point: 0 }]);
  };

  const handleOnNext = async () => {
    if (itemName === "") {
      alert("商品名を入力してください");
      return;
    }

    const response = await fetch(postSuggestPlanApi(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        goal: itemName,
        goal_points: requiredPoint,
        tasks: tasks.map((task) => {
          return {
            task: task.task,
            point: task.point,
          };
        }),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jsonData = await response.json();
    setPlans(jsonData["plans"]);
    setPlansIdsId(jsonData["plans_ids_id"]);
    setTasksIdsId(jsonData["tasks_ids_id"]);
    alert("登録しました！");
    onNextPressed();
  };

  return (
    <>
      <div id="div">
        <div className="title">
          <h1>登録</h1>
          <p>子どもがほしい物とそれに必要なお手伝いポイントを設定してください</p>
        </div>

        <h3>ほしい物</h3>
        <input
          className="inputGet"
          type="text"
          placeholder="商品名を入力してください"
          value={itemName}
          onChange={(e) => {
            setItemName(e.target.value);
          }}
        />

        <h3>必要なお手伝いポイント</h3>
        <input
          type="number"
          className="inputGet"
          placeholder="必要なポイント (1~1000)"
          value={requiredPoint}
          onChange={(e) => {
            setRequiredPoint(Number(e.target.value));
          }}
        />

        <h3>お手伝いタスク</h3>
        <p>お手伝い内容とそれに必要なポイントを設定してください</p>

        <div className="tasks">
          {tasks.map((task, index) => {
            return (
              <div key={index}>
                <input
                  className="inputGetText"
                  type="text"
                  placeholder="タスク名"
                  value={task.task}
                  onChange={(e) => {
                    handleOnChangeTask(index, e.target.value);
                  }}
                />
                <input
                  type="number"
                  className="inputGetNumber"
                  placeholder="ポイント"
                  value={task.point}
                  onChange={(e) => {
                    handleOnChangePoint(index, Number(e.target.value));
                  }}
                />
              </div>
            );
          })}
          <button id="taskbutton" onClick={handleOnAddTask}>タスクを追加</button>
        </div>
        <br />

        <div className="buttons">
          <button onClick={handleOnClear}>Clear</button>

          <button onClick={handleOnNext}>Next</button>
        </div>
      </div>
    </>
  );
}

interface PlanProps {
  plans: Plan[];
  plansIdsId: number | null;
  tasksIdsId: number | null;
  onBackPressed: () => void;
  onNextPressed: () => void;
}

function Plan({ plans, plansIdsId, tasksIdsId, onBackPressed, onNextPressed }: PlanProps) {
  const [showAllPlans, setShowAllPlans] = useState(false);

  const handleAcceptPlan = async () => {
    const response = await fetch(postAcceptPlanApi(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plans_ids_id: plansIdsId,
        tasks_ids_id: tasksIdsId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jsonData = await response.json();
    console.log(jsonData);
    alert("お手伝いプランを確定しました！これから毎日頑張りましょう！");
    onNextPressed();
  }

  return (
    <>
      <div id="div">
        <div className="title">
          <h1>お手伝いプラン</h1>
          <p>AIが作成したお手伝いプランです</p>
        </div>

        {/* TODO: 何日に一回なにをする、みたいなサマリーを表示 */}

        <button id="hyouzi" onClick={() => setShowAllPlans(!showAllPlans)}>
          {showAllPlans ? "表示しない" : "日々の計画を表示する"}
        </button>
        {showAllPlans && (
          <div>
            <h3>日々の計画</h3>
            <table>
              <thead>
                <tr>
                  <th>日付</th>
                  <th>お手伝いタスク</th>
                  <th>合計ポイント</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, index) => {
                  return (
                    <tr key={index}>
                      <td>{plan.day}日目</td>
                      <td>
                        {plan.plans_today.map((task, index) => {
                          return (
                            <div key={index}>
                              {task.task} ({task.point}pt)
                            </div>
                          );
                        })}
                      </td>
                      <td>{plan.plans_today.reduce((acc, cur) => acc + cur.point, 0)}pt</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="kakuninn">この計画で本当にいいか、必ず子どもと一緒に確認しましょう</p>

        <div className="buttons">

          <button onClick={() => onBackPressed()}>計画を作り直す</button>
          <button onClick={handleAcceptPlan}>計画を確定する</button>
        </div>
      </div>
    </>
  );
}

interface RecordProps {
  day: number;
  setDay: (day: number | ((prev: number) => number)) => void;
  onNextPressed: () => void;
}

function Record({ day, setDay, onNextPressed }: RecordProps) {
  const [plansToday, setPlansToday] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTodayPlans = async () => {
      const response = await fetch(postTodayPlansApi(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          day: day,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonData = await response.json();
      console.log(jsonData);
      setPlansToday(jsonData["plans_today"]);
    };
    fetchTodayPlans();
  }, [day]);

  // 新しいステート変数を追加
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);

  // チェックボックスの状態が変更されたときのハンドラ
  const handleCheckboxChange = (index: number) => {
    // チェックがついている場合は追加、ついていない場合は削除
    setCheckedIndices((prevIndices) =>
      prevIndices.includes(index)
        ? prevIndices.filter((prevIndex) => prevIndex !== index)
        : [...prevIndices, index]
    );
  };

  const handleSubmit = async () => {
    const totalPoints = plansToday.filter((_, index) => checkedIndices.includes(index)).reduce((acc, cur) => acc + cur.point, 0);

    const response = await fetch(postSubmitProgressApi(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        day: day,
        total_points: totalPoints,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jsonData = await response.json();
    console.log(jsonData);
    alert("記録しました！");
    
    onNextPressed();
  }

  return (
    <>
      <div className="title">
        <h1>日々の記録</h1>
        <p>今日してくれたお手伝いを記録しましょう</p>
      </div>

      {plansToday.length === 0 ? (
        <div>
          <h2>今日のお手伝いはありません</h2>
          <p>明日も頑張りましょう！</p>
        </div>
      ) : (
        <div>
          <h2>{day}日目のお手伝いプラン</h2>
          {plansToday.map((task, index) => {
            return (
              <div key={index}>
                {/* チェックボックスの状態を管理 */}
                <input
                  type="checkbox"
                  checked={checkedIndices.includes(index)}
                  onChange={() => handleCheckboxChange(index)}
                />
                {task.task} ({task.point}pt)
              </div>
            );
          }
          )}
          <button onClick={handleSubmit}>
            記録する
          </button>
        </div>
      )}

      <div className="buttons">
        <button onClick={() => setDay(day - 1)}>前の日へ</button>
        <button onClick={() => setDay(day + 1)}>次の日へ</button>
      </div>
    </>
  );
}

function Progress() {
  const [totalProgress, setTotalProgress] = useState(-1);
  const [goal, setGoal] = useState<Goal | null>(null);

  useEffect(() => {
    const fetchGoal = async () => {
      const response = await fetch(getGoalApi());

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonData = await response.json();
      console.log(jsonData);
      setGoal({ goal: jsonData["goal"], goal_points: jsonData["goal_points"] });
    };
    fetchGoal();

    const fetchTotalProgress = async () => {
      const response = await fetch(getTotalProgressApi());

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonData = await response.json();
      console.log(jsonData);
      setTotalProgress(jsonData["points"]);
    };
    fetchTotalProgress();
  }, []);

  return (
    <>
      <div id="div">
        <div className="title">
          <h1>進捗</h1>
          <p>現在の進捗状況を確認できます</p>
        </div>

        {goal && totalProgress >= goal.goal_points ? (
          <div>
            <h2>目標達成！</h2>
            <p>
              おめでとうございます！マネーリテラシーの向上に向けて素晴らしい成果を上げましたね。お子さんの努力は本当に素晴らしいものです。これからもこの調子でスキルを磨いていきましょう。よく頑張りました！
            </p>
            <img src={imgCongrats} alt="おめでとう" width={300} />
          </div>
        ) : (
          <div className="sintyoku">
            <div className="sintyokuGet">
              <h3>ほしい物</h3>
              <p>{goal ? goal.goal : "未設定"}</p>
            </div>
            <div className="sintyokuPoint">
              <div>
                <h3>必要ポイント</h3>
                <p><span>{goal ? `${goal.goal_points}` : "未設定"}</span>pt</p>
              </div>
              <div>
                <h3>現在のポイント</h3>
                <p><span>{totalProgress}</span>pt</p>
              </div>
            </div>



            {/* TODO: グラフでダッシュボードみたいに可視化できてたらかっこいい */}
          </div>
        )}
      </div>
    </>
  );
}
// ここまでをメインでいじってください!

const UIState = {
  Start: 0,
  Plan: 1,
  Record: 2,
  Progress: 3,
} as const;
type UIState = (typeof UIState)[keyof typeof UIState];

type Task = {
  task: string;
  point: number;
};

type Goal = {
  goal: string;
  goal_points: number;
};

type Plan = {
  day: number;
  plans_today: Task[];
}
