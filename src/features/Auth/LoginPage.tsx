import { useState } from "react"
import { postLoginApi } from "../../utils/links"
import { isValidEmail } from "../../utils/validations"

interface LoginProps {
  onNextPressed: () => void
  setToken: (token: string) => void
}

export default function LoginPage(props: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleOnClear = () => {
    setEmail("")
    setPassword("")
  }

  const handleOnNext = async () => {
    if (email === "") {
      alert("メールアドレスを入力してください")
      return
    }
    if (password === "") {
      alert("パスワードを入力してください")
      return
    }
    if (!isValidEmail(email)) {
      alert("正しいメールアドレスを入力してください")
      return
    }

    const response = await fetch(postLoginApi(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })

    if (!response.ok) {
      alert("ログインに失敗しました")
      return
    }

    const jsonData = await response.json()
    const token = jsonData.token
    localStorage.setItem("token", token)
    alert("ログインしました")
    props.setToken(token)
    props.onNextPressed()
  }

  return (
    <>
      <div id="div">
        <div className="title">
          <h1>ログイン</h1>
          <p>ログイン情報を入力してください。</p>
        </div>

        <h3>メールアドレス</h3>
        <input
          className="inputGet"
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />

        <h3>パスワード</h3>
        <input
          type="password"
          className="inputGet"
          placeholder="パスワード"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />

        <br />

        <div className="buttons">
          <button onClick={handleOnClear}>Clear</button>

          <button onClick={handleOnNext}>Next</button>
        </div>
      </div>
    </>
  )
}
