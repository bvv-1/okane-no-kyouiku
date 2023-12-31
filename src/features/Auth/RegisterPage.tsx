import { useState } from "react"
import { postRegisterApi } from "../../utils/links"
import { isValidEmail } from "../../utils/validations"

interface RegisterProps {
  onNextPressed: () => void
}

export default function RegisterPage(props: RegisterProps) {
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

    const response = await fetch(postRegisterApi(), {
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
      alert("登録に失敗しました")
      return
    }

    const jsonData = await response.json()
    console.log(jsonData)
    alert("登録しました")
    props.onNextPressed()
  }

  return (
    <>
      <div id="div">
        <div className="title">
          <h1>登録</h1>
          <p>メールアドレスとパスワードを設定してください。</p>
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
