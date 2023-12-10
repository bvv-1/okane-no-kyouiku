import { useState, useEffect } from "react"
import { getHelloWorldApi, postSuggestPlanApi } from "./utils/links"
import "./App.css"

export default function App() {
  const [uiState, setUIState] = useState<UIState>(UIState.Start)
  const [data, setData] = useState("")

  useEffect(() => {
    const fetchHelloWorld = async () => {
      const response = await fetch(getHelloWorldApi())

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const jsonData = await response.json()
      setData(jsonData["message"])
    }

    fetchHelloWorld()
  }, [])

  return (
    <div className="App">
      <button onClick={() => setUIState(UIState.Start)}>Start</button>
      <button onClick={() => setUIState(UIState.Plan)}>Plan</button>
      <button onClick={() => setUIState(UIState.Record)}>Record</button>
      <button onClick={() => setUIState(UIState.Progress)}>Progerss</button>

      <div>
        {uiState === UIState.Start && <Start />}
        {uiState === UIState.Plan && <Plan />}
        {uiState === UIState.Record && <Record />}
        {uiState === UIState.Progress && <Progress />}
      </div>
      {data}
    </div>
  )
}

// ここからをメインでいじってください!
function Start() {
  const [itemName, setItemName] = useState("")
  const [requiredPoint, setRequiredPoint] = useState(100)
  const [tasks, setTasks] = useState<Task[]>([{ task: "", point: 0 }])

  const handleOnAddTask = () => {
    setTasks([...tasks, { task: "", point: 0 }])
  }

  const handleOnChangeTask = (index: number, task: string) => {
    const newTasks = [...tasks]
    newTasks[index].task = task
    setTasks(newTasks)
  }

  const handleOnChangePoint = (index: number, point: number) => {
    const newTasks = [...tasks]
    newTasks[index].point = point
    setTasks(newTasks)
  }

  const handleOnClear = () => {
    setItemName("")
    setRequiredPoint(100)
    setTasks([{ task: "", point: 0 }])
  }

  const handleOnNext = async () => {
    if (itemName === "") {
      alert("商品名を入力してください")
      return
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
          }
        }),
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const jsonData = await response.json()
    console.log(jsonData["plans"])
    alert("登録しました！")
  }

  return (
    <>
      <div className="title">
        <h1>登録</h1>
        <p>子どもがほしい物とそれに必要なお手伝いポイントを設定してください</p>
      </div>

      <h3>ほしい物</h3>
      <input
        type="text"
        placeholder="商品名を入力してください"
        value={itemName}
        onChange={(e) => {
          setItemName(e.target.value)
        }}
      />

      <h3>必要なお手伝いポイント</h3>
      <input
        type="number"
        placeholder="必要なポイント(1~1000)"
        value={requiredPoint}
        onChange={(e) => {
          setRequiredPoint(Number(e.target.value))
        }}
      />

      <h3>お手伝いタスク</h3>
      <p>お手伝い内容とそれに必要なポイントを設定してください</p>

      <div className="tasks">
        {tasks.map((task, index) => {
          return (
            <div key={index}>
              <input
                type="text"
                placeholder="タスク名"
                value={task.task}
                onChange={(e) => {
                  handleOnChangeTask(index, e.target.value)
                }}
              />
              <input
                type="number"
                placeholder="ポイント"
                value={task.point}
                onChange={(e) => {
                  handleOnChangePoint(index, Number(e.target.value))
                }}
              />
            </div>
          )
        })}
        <button onClick={handleOnAddTask}>タスクを追加</button>
      </div>
      <br />

      <div className="buttons">
        <button onClick={handleOnClear}>Clear</button>

        <button onClick={handleOnNext}>Next</button>
      </div>
    </>
  )
}

function Plan() {
  return <div>Plan</div>
}

function Record() {
  return <div>Record</div>
}

function Progress() {
  return <div>Progress</div>
}
// ここまでをメインでいじってください!

const UIState = {
  Start: 0,
  Plan: 1,
  Record: 2,
  Progress: 3,
} as const
type UIState = (typeof UIState)[keyof typeof UIState]

type Task = {
  task: string
  point: number
}
