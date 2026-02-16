import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getOrdersBySeller } from "../../services/order.service";
import { FaHistory, FaBoxOpen } from "react-icons/fa";
import "../../styles/order.css";
import "../../styles/status.css";

const SellerOrderHistory = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrdersBySeller(user.id)
      .then(res => {
        const history = res.data.filter(o => o.orderStatus !== "PENDING");
        setOrders(history);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="page-spinner"></div>
        <p>Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>
          <FaHistory style={{ marginRight: "10px", color: "#16a34a" }} />
          Order History
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <FaBoxOpen style={{ fontSize: "48px", color: "#d1d5db", marginBottom: "16px" }} />
          <h3>No past orders</h3>
          <p>Completed and cancelled orders will appear here.</p>
        </div>
      ) : (
        <div className="order-list">
          {orders.map(order => (
            <div key={order.orderId} className="order-card">
              <div className="order-header">
                <div>
                  <b>Order #{order.orderId}</b>
                  <p>{new Date(order.orderDate).toLocaleString()}</p>
                  <small>Buyer: {order.buyerName}</small>
                </div>
                <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>
                  {order.orderStatus}
                </span>
              </div>

              <div className="order-items">
                {order.orderItems.map(item => (
                  <div key={item.orderItemId} className="order-item">
                    <div className="order-item-left">
                      <span className="product-name">{item.productName}</span>
                    </div>
                    <span className="order-item-price">
                      {item.quantity} × ₹{item.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <h4>Total: ₹ {order.totalAmount}</h4>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrderHistory;