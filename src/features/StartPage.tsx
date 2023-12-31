import { useState } from "react"

import { Task } from "../utils/types"
import { postSubmitGoalAndTaskApi } from "../utils/links"

interface StartProps {
  onNextPressed: () => void
  token: string
}

export default function StartPage({ onNextPressed }: StartProps) {
  const [itemName, setItemName] = useState("")
  const [requiredPoint, setRequiredPoint] = useState(100)
  const [tasks, setTasks] = useState<Task[]>([{ name: "", point: 0 }])

  const handleOnAddTask = () => {
    setTasks([...tasks, { name: "", point: 0 }])
  }

  const handleOnChangeTask = (index: number, task: string) => {
    const newTasks = [...tasks]
    newTasks[index].name = task
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
    setTasks([{ name: "", point: 0 }])
  }

  const handleOnNext = async () => {
    if (itemName === "") {
      alert("商品名を入力してください")
      return
    }

    const response = await fetch(postSubmitGoalAndTaskApi(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        goal: {
          name: itemName,
          point: requiredPoint,
        },
        tasks: tasks.map((task) => {
          return {
            name: task.name,
            point: task.point,
          }
        }),
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const jsonData = await response.json()
    console.log(jsonData)
    alert("登録しました！")
    onNextPressed()
  }

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
            setItemName(e.target.value)
          }}
        />

        <h3>必要なお手伝いポイント</h3>
        <input
          type="number"
          className="inputGet"
          placeholder="必要なポイント (1~1000)"
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
                  className="inputGetText"
                  type="text"
                  placeholder="タスク名"
                  value={task.name}
                  onChange={(e) => {
                    handleOnChangeTask(index, e.target.value)
                  }}
                />
                <input
                  type="number"
                  className="inputGetNumber"
                  placeholder="ポイント"
                  value={task.point}
                  onChange={(e) => {
                    handleOnChangePoint(index, Number(e.target.value))
                  }}
                />
              </div>
            )
          })}
          <button id="taskbutton" onClick={handleOnAddTask}>
            タスクを追加
          </button>
        </div>
        <br />

        <div className="buttons">
          <button onClick={handleOnClear}>Clear</button>

          <button onClick={handleOnNext}>Next</button>
        </div>
      </div>
    </>
  )
}
