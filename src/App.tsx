import { useState, useEffect } from "react"
import { getHelloWorldApi } from "./utils/links"

function App() {
  const [data, setData] = useState("")

  useEffect(() => {
    const fetchHelloWorld = async () => {
      const response = await fetch(getHelloWorldApi)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const jsonData = await response.json()
      setData(jsonData["message"])
    }
    
    fetchHelloWorld()
  }, [])

  return (
    <>
      {data}
    </>
  )
}

export default App
