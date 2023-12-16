import { useState, useEffect } from "react"

import { Plan } from "../utils/types"
import { getSuggestedPlansApi, putAcceptSuggestedPlansApi } from "../utils/links"

interface PlanProps {
  plans: Plan[]
  plansIdsId: number | null
  tasksIdsId: number | null
  onBackPressed: () => void
  onNextPressed: () => void
}

export default function PlanPage({ onBackPressed, onNextPressed }: PlanProps) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [showAllPlans, setShowAllPlans] = useState(false)

  useEffect(() => {
    const fetchPlans = async () => {
      const response = await fetch(getSuggestedPlansApi(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const jsonData = await response.json()
      console.log(jsonData)
      setPlans(jsonData)
    }

    fetchPlans()
  }, [])

  const handleAcceptPlan = async () => {
    // const response = await fetch(postAcceptPlanApi(), {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     plans_ids_id: plansIdsId,
    //     tasks_ids_id: tasksIdsId,
    //   }),
    // })
    const response = await fetch(putAcceptSuggestedPlansApi(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const jsonData = await response.json()
    console.log(jsonData)
    alert("お手伝いプランを確定しました！これから毎日頑張りましょう！")
    onNextPressed()
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
                        {plan.tasks_today.map((task, index) => {
                          return (
                            <div key={index}>
                              {task.name} ({task.point}pt)
                            </div>
                          )
                        })}
                      </td>
                      <td>{plan.tasks_today.reduce((acc, cur) => acc + cur.point, 0)}pt</td>
                    </tr>
                  )
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
  )
}
