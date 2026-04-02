import { useEffect, useState } from "react"
import axios from "axios"

function ProductList() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [form, setForm] = useState({ name: "", price: "", quantity: "", image: null })

  // Load products
  const loadProducts = async () => {
    const res = await axios.get("http://localhost:3000/product/getProducts")
    setProducts(res.data)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  // Add to cart
  const addToCart = async (product) => {
    if (product.quantity < 1) {
      alert("Out of stock!")
      return
    }

    // Update cart
    const existing = cart.find(item => item._id === product._id)
    if (existing) {
      setCart(cart.map(item => 
        item._id === product._id ? { ...item, count: item.count + 1 } : item
      ))
    } else {
      setCart([...cart, { ...product, count: 1 }])
    }

    // Reduce stock in database
    await axios.post("http://localhost:3000/product/reduce-quantity", {
      productId: product._id,
      quantity: 1
    })

    loadProducts()
  }

  // Calculate total
  const getTotal = () => cart.reduce((sum, item) => sum + item.price * item.count, 0)

  // Add new product
  const addProduct = async () => {
    if (!form.name || !form.price || !form.quantity) {
      alert("Fill all fields")
      return
    }

    const formData = new FormData()
    formData.append("name", form.name)
    formData.append("price", form.price)
    formData.append("quantity", form.quantity)
    formData.append("image", form.image)

    await axios.post("http://localhost:3000/product/add-product", formData)
    alert("Product added!")
    
    setForm({ name: "", price: "", quantity: "", image: null })
    loadProducts()
  }

  return (
    <div>
      <button onClick={() => setShowCart(!showCart)}>
        {showCart ? "View Products" : "View Cart"}
      </button>

      {/* CART */}
      {showCart && (
        <div>
          <h2>Cart</h2>
          {cart.length === 0 ? (
            <p>Empty</p>
          ) : (
            <>
              {cart.map(item => (
                <div key={item._id}>
                  {item.name} - ₹{item.price} x {item.count} = ₹{item.price * item.count}
                </div>
              ))}
              <h3>Total: ₹{getTotal()}</h3>
            </>
          )}
        </div>
      )}

      {/* PRODUCTS */}
      {!showCart && (
        <div>
          <h2>Add Product</h2>
          <input placeholder="name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
          <input placeholder="price" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} />
          <input placeholder="quantity" type="number" value={form.quantity} onChange={(e) => setForm({...form, quantity: e.target.value})} />
          <input type="file" onChange={(e) => setForm({...form, image: e.target.files[0]})} />
          <button onClick={addProduct}>Add</button>

          <h2>Products</h2>
          {products.map(p => (
            <div key={p._id}>
              <h3>{p.name}</h3>
              <p>₹{p.price}</p>
              <p>Stock: {p.quantity}</p>
              <img src={`http://localhost:3000/uploads/${p.image}`} width="100" />
              <button onClick={() => addToCart(p)} disabled={p.quantity < 1}>
                {p.quantity > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductList