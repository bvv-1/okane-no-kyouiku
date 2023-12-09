import { useState, useEffect } from "react"
import { getHelloWorldApi } from "./utils/links"
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
      {data}
      <button onClick={() => setUIState(UIState.Start)}><Start /></button>
      <button onClick={() => setUIState(UIState.Plan)}><Plan /></button>
      <button onClick={() => setUIState(UIState.Record)}><Record /></button>
      <button onClick={() => setUIState(UIState.Progress)}><Progress /></button>

      {uiState === UIState.Start && <div>Start</div>}
      {uiState === UIState.Plan && <div>Plan</div>}
      {uiState === UIState.Record && <div>Record</div>}
      {uiState === UIState.Progress && <div>Progress</div>}
    </div>
  )
}

// ここからをメインでいじってください!
function Start() {
  return <div>Start</div>
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
type UIState = typeof UIState[keyof typeof UIState]
