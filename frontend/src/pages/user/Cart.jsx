import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import {
  getCartByUser,
  incrementCartItem,
  decrementCartItem,
  removeCartItem
} from "../../services/cart.service"
import { placeOrder } from "../../services/order.service"
import { BACKEND_URL } from "../../utils/constants"
import {
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaTrashAlt,
  FaArrowLeft,
  FaShieldAlt,
  FaTruck,
  FaBoxOpen,
  FaTag
} from "react-icons/fa"
import "../../styles/cart.css"

const Cart = () => {
  const { user } = useContext(AuthContext)
  const [cart, setCart] = useState(null)

  const loadCart = () => {
    getCartByUser(user.id).then(res => setCart(res.data))
  }

  useEffect(() => {
    loadCart()
  }, [])

  const handleInc = async (productId) => {
    await incrementCartItem(productId, user.id)
    loadCart()
  }

  const handleDec = async (productId) => {
    await decrementCartItem(productId, user.id)
    loadCart()
  }

  const handleRemove = async (productId) => {
    await removeCartItem(productId, user.id)
    loadCart()
  }

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/payments/create?userId=${user.id}`,
        { method: "POST" }
      )

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || "Payment init failed")
      }

      const res = await response.json()

      const options = {
        key: "rzp_test_S8oxyx5HO6AK9e",
        amount: res.amount,
        currency: "INR",
        order_id: res.orderId,
        name: "Demo Shop",

        handler: async function (rzpResponse) {
          const verifyRes = await fetch(
            `${BACKEND_URL}/api/payments/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                razorpayOrderId: rzpResponse.razorpay_order_id,
                razorpayPaymentId: rzpResponse.razorpay_payment_id,
                razorpaySignature: rzpResponse.razorpay_signature,
                userId: user.id,
                paymentMode: "ONLINE"
              })
            }
          )

          if (!verifyRes.ok) {
            throw new Error("Payment verification failed")
          }

          alert("Order placed successfully")
          loadCart()
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {
      console.error(err)
      alert("Payment failed: " + err.message)
    }
  }

  /* ── Empty Cart ── */
  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">
          <FaShoppingCart />
        </div>
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <a href="/products" className="shop-now-btn">
          <FaArrowLeft />
          Continue Shopping
        </a>
      </div>
    )
  }

  const total = cart.cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  )

  const totalItems = cart.cartItems.reduce(
    (sum, i) => sum + i.quantity,
    0
  )

  const shipping = total > 500 ? 0 : 49
  const finalTotal = total + shipping

  return (
    <div className="cart-page">
      <div className="cart-container">

        {/* ── Header ── */}
        <div className="cart-header">
          <div className="cart-header-left">
            <FaShoppingCart className="cart-header-icon" />
            <div>
              <h2 className="cart-title">Shopping Cart</h2>
              <p className="cart-subtitle">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
              </p>
            </div>
          </div>
          <a href="/products" className="continue-shopping-btn">
            <FaArrowLeft />
            Continue Shopping
          </a>
        </div>

        {/* ── Layout ── */}
        <div className="cart-layout">

          {/* ── Cart Items ── */}
          <div className="cart-list">
            {cart.cartItems.map(item => (
              <div key={item.cartItemsId} className="cart-item">

                {/* Image */}
                <div className="cart-img-wrapper">
                  <img
                    src={`${BACKEND_URL}/${item.imageUrl}`}
                    alt={item.productName}
                    className="cart-img"
                  />
                </div>

                {/* Info */}
                <div className="cart-info">
                  <h4 className="product-name">{item.productName}</h4>
                  <p className="product-meta">
                    <span className="meta-tag">
                      <FaTag /> ₹{item.price} per unit
                    </span>
                  </p>

                  <div className="cart-item-bottom">
                    <div className="qty-control">
                      <button
                        onClick={() => handleDec(item.productId)}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleInc(item.productId)}>
                        <FaPlus />
                      </button>
                    </div>

                    <div className="item-total">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item.productId)}
                  title="Remove item"
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>

          {/* ── Summary ── */}
          <div className="cart-summary-wrapper">
            <div className="cart-summary">
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? "free-shipping" : ""}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>

              {shipping === 0 && (
                <div className="free-shipping-badge">
                  <FaTruck /> Free shipping on orders above ₹500
                </div>
              )}

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>

              <button className="checkout-btn" onClick={handlePlaceOrder}>
                Place Order
              </button>

              {/* Trust Badges */}
              <div className="trust-badges">
                <div className="trust-item">
                  <FaShieldAlt />
                  <span>Secure Payment</span>
                </div>
                <div className="trust-item">
                  <FaTruck />
                  <span>Fast Delivery</span>
                </div>
                <div className="trust-item">
                  <FaBoxOpen />
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cart