import { useState, useEffect } from "react";
import {
  postSuggestPlanApi,
  getTotalProgressApi,
  getGoalApi,
  postAcceptPlanApi,
} from "./utils/links";
import "./App.css";
import imgCongrats from "./assets/kusudama_1170.png";

export default function App() {
  const [uiState, setUIState] = useState<UIState>(UIState.Start);
  const [plans, setPlans] = useState<Plan[]>([]);

  return (<>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
    <link href="https://fonts.googleapis.com/css2?family=Yusei+Magic&display=swap" rel="stylesheet"></link>
    <div className="App">
      <div className="navi">
        <button onClick={() => setUIState(UIState.Start)}>はじめる</button>
        <button onClick={() => setUIState(UIState.Plan)}>お手伝いプラン</button>
        <button onClick={() => setUIState(UIState.Record)}>日々の記録</button>
        <button onClick={() => setUIState(UIState.Progress)}>進捗</button>
      </div>

      <div>
        {uiState === UIState.Start && <Start setPlans={setPlans} onNextPressed={() => setUIState(UIState.Plan)} />}
        {uiState === UIState.Plan && <Plan plans={plans} onBackPressed={() => setUIState(UIState.Start)} />}
        {uiState === UIState.Record && <Record />}
        {uiState === UIState.Progress && <Progress />}
      </div>
    </div>
  </>
  );

}

interface StartProps {
  setPlans: (plans: Plan[]) => void;
  onNextPressed: () => void;
}

// ここからをメインでいじってください!
function Start({ setPlans, onNextPressed }: StartProps) {
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
    alert("登録しました！");
    onNextPressed();
  };

  return (
    <>
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
    </>
  );
}

interface PlanProps {
  plans: Plan[];
  onBackPressed: () => void;
}

function Plan({ plans, onBackPressed }: PlanProps) {
  const [showAllPlans, setShowAllPlans] = useState(false);

  const handleAcceptPlan = async () => {
    const response = await fetch(postAcceptPlanApi(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plans: plans.map((plan) => {
          return {
            day: plan.day,
            plans_today: plan.plans_today.map((task) => {
              return {
                task: task.task,
                point: task.point,
              };
            }),
          };
        }),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jsonData = await response.json();
    console.log(jsonData);
    alert("お手伝いプランを確定しました！これから毎日頑張りましょう！");
  }

  return (
    <>
      <div className="title">
        <h1>お手伝いプラン</h1>
        <p>AIが作成したお手伝いプランです</p>
      </div>

      {/* TODO: 何日に一回なにをする、みたいなサマリーを表示 */}

      <button onClick={() => setShowAllPlans(!showAllPlans)}>
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

      <div className="buttons">
        <button onClick={() => onBackPressed()}>計画を作り直す</button>
        <button onClick={handleAcceptPlan}>計画を確定する</button>
        <p>この計画で本当にいいか、必ず子どもと一緒に確認しましょう</p>
      </div>
    </>
  );
}

function Record() {
  return <div>Record</div>;
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
        <div>
          <h3>ほしい物</h3>
          {goal ? goal.goal : "未設定"}
          <h3>必要ポイント</h3>
          {goal ? `${goal.goal_points}pt` : "未設定"}
          <h3>現在のポイント</h3>
          {totalProgress}pt
          {/* TODO: グラフでダッシュボードみたいに可視化できてたらかっこいい */}
        </div>
      )}
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
