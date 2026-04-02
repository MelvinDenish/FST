import { useState } from "react"
import axios from "axios"

function Login({ setPage }) {
  const [email, setEmail] = useState("")
  const [pwd, setPwd] = useState("")

  return (
    <div>
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />

      <label>Password</label>
      <input value={pwd} onChange={(e) => setPwd(e.target.value)} />

      <button onClick={async () => {
        try {
          const res = await axios.post("http://localhost:3000/user/login", {
            email,
            password: pwd
          })

        console.log(res);
          if (res.data.user) {
            localStorage.setItem("userId", res.data.user._id)
            setPage("products")
          } else {
            alert("Login failed")
          }
        } catch {
          alert("Login failed")
        }
      }}>
        Login
      </button>
      <button onClick={()=>setPage("register")}>
        Register
      </button>
    </div>
  )
}

export default Login