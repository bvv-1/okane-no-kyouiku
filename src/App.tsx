import { useState, useEffect } from "react"

function App() {
  const API_BASE_URL = "https://flask-okane-no-kyouiku.onrender.com/" // "http://127.0.0.1:5000/""

  const [data, setData] = useState("")

  useEffect(() => {
    const fetchHelloWorld = async () => {
      const response = await fetch(API_BASE_URL)

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
