import { useEffect, useState } from "react"
import { Task } from "../utils/types"
import { getTodayPlanApi, postSubmitTodayProgressApi } from "../utils/links"

interface RecordProps {
  day: number
  setDay: React.Dispatch<React.SetStateAction<number>>
  onNextPressed: () => void
}

export default function Record({ day, setDay, onNextPressed }: RecordProps) {
  const [tasksToday, setTasksToday] = useState<Task[]>([])
  const [doneTasks, setDoneTasks] = useState<Task[]>([])

  useEffect(() => {
    const fetchTasksToday = async () => {
      const response = await fetch(getTodayPlanApi(day))

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const jsonData = await response.json()
      console.log(jsonData)
      setTasksToday(jsonData["tasks_today"])
    }
    fetchTasksToday()
  }, [day])

  const isDone = (task: Task) => {
    return doneTasks.some((doneTask) => doneTask.name === task.name)
  }

  const handleCheckboxChange = (task: Task) => {
    // チェックがついている場合は追加、ついていない場合は削除
    setDoneTasks((prevTasks) =>
      prevTasks.includes(task) ? prevTasks.filter((prevTask) => prevTask.name !== task.name) : [...prevTasks, task],
    )
  }

  const handleSubmit = async () => {
    const taskProgress = tasksToday.map((task) => {
      return {
        task: task,
        is_done: isDone(task),
      }
    })

    const response = await fetch(postSubmitTodayProgressApi(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        day: day,
        task_progress: taskProgress,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const jsonData = await response.json()
    console.log(jsonData)
    alert("記録しました！")

    onNextPressed()
  }

  const handlePrevDay = () => {
    setDay((d) => d - 1)
  }
  const handleNextDay = () => {
    setDay((d) => d + 1)
  }

  return (
    <>
      <div className="title">
        <h1>日々の記録</h1>
        <p>今日してくれたお手伝いを記録しましょう</p>
      </div>

      {tasksToday.length === 0 ? (
        <div>
          <h2>今日のお手伝いはありません</h2>
          <p>明日も頑張りましょう！</p>
        </div>
      ) : (
        <div>
          <h2>{day}日目のお手伝いプラン</h2>
          {tasksToday.map((task, index) => {
            return (
              <div key={index}>
                {/* チェックボックスの状態を管理 */}
                <input type="checkbox" checked={isDone(task)} onChange={() => handleCheckboxChange(task)} />
                {task.name} ({task.point}pt)
              </div>
            )
          })}
          <button onClick={handleSubmit}>記録する</button>
        </div>
      )}

      <div className="buttons">
        <button onClick={handlePrevDay}>前の日へ</button>
        <button onClick={handleNextDay}>次の日へ</button>
      </div>
    </>
  )
}
