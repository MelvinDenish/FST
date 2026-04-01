import { useState } from 'react'
import Register from './Register'
import Login from './Login'
import ProductList from './ProductList'

function App() {
  const [page, setPage] = useState("login")

  return (
    <>
      {page === "register" && <Register setPage={setPage} />}
      {page === "login" && <Login setPage={setPage} />}
      {page === "products" && <ProductList setPage={setPage} />}
    </>
  )
}

export default App