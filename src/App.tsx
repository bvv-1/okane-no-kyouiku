import { useState, useEffect } from "react"

import "./App.css"

import StartPage from "./features/StartPage"
import PlanPage from "./features/PlanPage"
import RecordPage from "./features/RecordPage"
import ProgressPage from "./features/ProgressPage"
import RegisterPage from "./features/Auth/RegisterPage"
import LoginPage from "./features/Auth/LoginPage"

export default function App() {
  const [uiState, setUIState] = useState<UIState>(UIState.Start)
  const [token, setToken] = useState<string>("")
  const [day, setDay] = useState(1)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setToken(token)
      setUIState(UIState.Plan)
    }
  }, [])

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Yusei+Magic&display=swap" rel="stylesheet"></link>
      <div className="App">
        <div className="navi">
          <button onClick={() => setUIState(UIState.Register)}>新規登録</button>
          <button onClick={() => setUIState(UIState.Login)}>ログイン</button>
          <button onClick={() => setUIState(UIState.Start)}>はじめる</button>
          <button onClick={() => setUIState(UIState.Plan)}>お手伝いプラン</button>
          <button onClick={() => setUIState(UIState.Record)}>日々の記録</button>
          <button onClick={() => setUIState(UIState.Progress)}>進捗</button>
        </div>

        <div>
          {uiState === UIState.Register && <RegisterPage onNextPressed={() => setUIState(UIState.Start)} />}
          {uiState === UIState.Login && (
            <LoginPage onNextPressed={() => setUIState(UIState.Start)} setToken={setToken} />
          )}
          {uiState === UIState.Start && <StartPage onNextPressed={() => setUIState(UIState.Plan)} token={token} />}
          {uiState === UIState.Plan && (
            <PlanPage
              onBackPressed={() => setUIState(UIState.Start)}
              onNextPressed={() => setUIState(UIState.Record)}
              token={token}
            />
          )}
          {uiState === UIState.Record && (
            <RecordPage day={day} setDay={setDay} onNextPressed={() => setUIState(UIState.Progress)} token={token} />
          )}
          {uiState === UIState.Progress && <ProgressPage token={token} />}
        </div>
      </div>
    </>
  )
}

const UIState = {
  Register: 0,
  Login: 1,
  Start: 2,
  Plan: 3,
  Record: 4,
  Progress: 5,
} as const
type UIState = (typeof UIState)[keyof typeof UIState]
