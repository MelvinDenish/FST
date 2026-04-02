import { useEffect, useState } from "react"
import axios from "axios"

function ProductList() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [image, setImage] = useState(null)

  // Load products from backend
  const loadProducts = async () => {
    const res = await axios.get("http://localhost:3000/product/getProducts")
    setProducts(res.data)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const addToCart = async (product) => {
    const qty = Number(product.quantity)
    if (!qty || qty < 1) {
      alert("Out of stock!")
      return
    }

    // Check if product already in cart
    let found = cart.find(item => item._id === product._id)
    
    if (found) { 
      setCart(cart.map(item => 
        item._id === product._id ? { ...item, count: item.count + 1 } : item
      ))
    } else { 
      setCart([...cart, { ...product, count: 1 }])
    }
 
    await axios.post("http://localhost:3000/product/reduce-quantity", {
      productId: product._id,
      quantity: 1
    })

    loadProducts()
  }

  // Calculate total price
  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.count), 0)
  }

  // Add new product
  const addProduct = async () => {
    if (!name || !price || !quantity) {
      alert("Please fill all fields")
      return
    }
    
    const qty = parseInt(quantity)
    if (isNaN(qty) || qty <= 0) {
      alert("Quantity must be greater than 0")
      return
    }
    
    const formData = new FormData()
    formData.append("name", name)
    formData.append("price", parseFloat(price))
    formData.append("quantity", qty.toString())
    formData.append("image", image)

    try {
      await axios.post("http://localhost:3000/product/add-product", formData)
      alert("Product added successfully!")
      
      setName("")
      setPrice("")
      setQuantity("")
      setImage(null)
      loadProducts()
    } catch (error) {
      alert("Failed to add product")
    }
  }

  return (
    <div>
      <button onClick={() => setShowCart(!showCart)}>
        {showCart ? "View Products" : "View Cart"}
      </button>

      {/* CART VIEW */}
      {showCart && (
        <div>
          <h2>Cart</h2>
          {cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item._id}>
                  {item.name} - ₹{item.price} x {item.count} = ₹{item.price * item.count}
                </div>
              ))}
              <h3>Total: ₹{getTotal()}</h3>
            </>
          )}
        </div>
      )}

      {/* PRODUCTS VIEW */}
      {!showCart && (
        <div>
          <h2>Add Product</h2>
          <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="price" value={price} onChange={(e) => setPrice(e.target.value)} />
          <input placeholder="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <button onClick={addProduct}>Add</button>

          <h2>Products</h2>
          {products.map((p) => {
            const qty = p.quantity ? Number(p.quantity) : 0
            const inStock = qty > 0
            
            return (
            <div key={p._id}>
              <h3>{p.name}</h3>
              <p>Price: ₹{p.price}</p>
              <p>Stock: {qty}</p>
              <img src={`http://localhost:3000/uploads/${p.image}`} width="100" alt={p.name} />
              <button onClick={() => addToCart(p)} disabled={!inStock}>
                {inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ProductList