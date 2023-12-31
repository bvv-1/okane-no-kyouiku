import { useEffect, useState } from "react"
import { Goal } from "../utils/types"
import { getCheckProgressApi } from "../utils/links"
import imgCongrats from "../assets/kusudama_1170.png"

interface ProgressProps {
  token: string
}

export default function ProgressPage(props: ProgressProps) {
  const [totalPoint, setTotalPoint] = useState(-1)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [onTrack, setOnTrack] = useState(true)

  useEffect(() => {
    const fetchCheckProgress = async () => {
      const response = await fetch(getCheckProgressApi())

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const jsonData = await response.json()
      console.log(jsonData)
      setTotalPoint(jsonData["total_point"])
      setGoal(jsonData["goal"])
      setOnTrack(jsonData["on_track"])
    }
    fetchCheckProgress()
  }, [])
  console.log(props.token)

  return (
    <>
      <div id="div">
        <div className="title">
          <h1>進捗</h1>
          <p>現在の進捗状況を確認できます</p>
        </div>

        {onTrack ? <div>順調です！</div> : <div>見直しをしてみませんか？</div>}

        {goal && totalPoint >= goal.point ? (
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
              <p>{goal ? goal.name : "未設定"}</p>
            </div>
            <div className="sintyokuPoint">
              <div>
                <h3>必要ポイント</h3>
                <p>
                  <span>{goal ? `${goal.point}` : "未設定"}</span>pt
                </p>
              </div>
              <div>
                <h3>現在のポイント</h3>
                <p>
                  <span>{totalPoint}</span>pt
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
