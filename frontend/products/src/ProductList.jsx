import { useEffect, useState } from "react"
import axios from "axios"

function ProductList() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState(null)
  const userId = localStorage.getItem("userId")

 const loadProducts = async () => {
  const res = await axios.get("http://localhost:3000/product/getProducts")
  setProducts(res.data)
}

  useEffect(() => {
    loadProducts()
  }, [])

  const addToCart = (p) => {
    const existingItem = cart.find(item => item._id === p._id)
    
    if (existingItem) {
      // If product exists, increase count
      setCart(cart.map(item =>
        item._id === p._id
          ? { ...item, count: item.count + 1 }
          : item
      ))
    } else {
      // If product doesn't exist, add with count 1
      setCart([...cart, { ...p, count: 1 }])
    }
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.count), 0)
  }

  const addProduct = async () => {
    const formData = new FormData()
    formData.append("name", name)
    formData.append("price", price)
    formData.append("image", image)

    await axios.post("http://localhost:3000/product/add-product", formData)

    alert("Product added")
    loadProducts()
  }

  return (
    <>
      <button onClick={() => setShowCart(!showCart)}>
        {showCart ? "View Products" : "View Cart"}
      </button>

      {/* CART */}
      {showCart && (
        <>
          <ul>
            {cart.map((c, i) => (
              <li key={i}>
                {c.name} - ₹{c.price} x {c.count} = ₹{c.price * c.count}
              </li>
            ))}
          </ul>
          {cart.length > 0 && (
            <h3>Total: ₹{calculateTotal()}</h3>
          )}
        </>
      )}

      {/* ADD PRODUCT */}
      {!showCart && (
        <>
          <h2>Add Product</h2>
          <input placeholder="name" onChange={(e) => setName(e.target.value)} />
          <input placeholder="price" onChange={(e) => setPrice(e.target.value)} />
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />

          <button onClick={addProduct}>Add</button>

          <ul>
            {products.map((p) => (
              <li key={p._id}>
                <h3>{p.name}</h3>
                <p>₹{p.price}</p>

               <img
  src={`http://localhost:3000/uploads/${p.image}`}
  width="100"
/>
                <button onClick={() => addToCart(p)}>Add to Cart</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}

export default ProductList