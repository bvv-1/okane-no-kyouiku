import { useState } from "react"

import "./App.css"

import StartPage from "./features/StartPage"
import PlanPage from "./features/PlanPage"
import RecordPage from "./features/RecordPage"
import ProgressPage from "./features/ProgressPage"

export default function App() {
  const [uiState, setUIState] = useState<UIState>(UIState.Start)
  const [day, setDay] = useState<number>(1)

  return (
    <>
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
          {uiState === UIState.Start && <StartPage onNextPressed={() => setUIState(UIState.Plan)} />}
          {uiState === UIState.Plan && (
            <PlanPage
              onBackPressed={() => setUIState(UIState.Start)}
              onNextPressed={() => setUIState(UIState.Record)}
            />
          )}
          {uiState === UIState.Record && (
            <RecordPage day={day} setDay={setDay} onNextPressed={() => setUIState(UIState.Progress)} />
          )}
          {uiState === UIState.Progress && <ProgressPage />}
        </div>
      </div>
    </>
  )
}

const UIState = {
  Start: 0,
  Plan: 1,
  Record: 2,
  Progress: 3,
} as const
type UIState = (typeof UIState)[keyof typeof UIState]
