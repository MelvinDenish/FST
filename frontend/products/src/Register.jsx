import { useState } from "react"
import axios from "axios"

function Register({ setPage }) {
  const [email, setEmail] = useState("")
  const [pwd, setPwd] = useState("")

  return (
    <div>
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />

      <label>Password</label>
      <input value={pwd} onChange={(e) => setPwd(e.target.value)} />

      <button onClick={async () => {
        await axios.post("http://localhost:3000/user/register", {
          email,
          password: pwd
        })
        alert("Registered")
        setPage("login")
      }}>
        Register
      </button>

      <button onClick={() => setPage("login")}>Login</button>
    </div>
  )
}

export default Register