import { useEffect, useState } from "react"
import { Goal } from "../utils/types"
import { getGoalApi, getTotalProgressApi } from "../utils/links"
import imgCongrats from "../assets/kusudama_1170.png"

export default function ProgressPage() {
  const [totalProgress, setTotalProgress] = useState(-1)
  const [goal, setGoal] = useState<Goal | null>(null)

  useEffect(() => {
    const fetchGoal = async () => {
      const response = await fetch(getGoalApi())

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const jsonData = await response.json()
      console.log(jsonData)
      setGoal({ goal: jsonData["goal"], goal_points: jsonData["goal_points"] })
    }
    fetchGoal()

    const fetchTotalProgress = async () => {
      const response = await fetch(getTotalProgressApi())

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const jsonData = await response.json()
      console.log(jsonData)
      setTotalProgress(jsonData["points"])
    }
    fetchTotalProgress()
  }, [])

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
                <p>
                  <span>{goal ? `${goal.goal_points}` : "未設定"}</span>pt
                </p>
              </div>
              <div>
                <h3>現在のポイント</h3>
                <p>
                  <span>{totalProgress}</span>pt
                </p>
              </div>
            </div>

            {/* TODO: グラフでダッシュボードみたいに可視化できてたらかっこいい */}
          </div>
        )}
      </div>
    </>
  )
}
