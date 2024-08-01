import React, { useState, useEffect } from "react";
import axiosInstance from "../interceptors/axios";
import formatDateTime from "../utility/formatdatetime";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:8000/api/track-orders/my-orders/');
        setOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getOrders();
  }, []);

  return (
    <div className="container mt-5">
      {isLoading ? (
        <div className='d-flex justify-content-center'>
          <div className='spinner-border'></div>
        </div>
      ) : (
        <div>
          {orders.length > 0 ? (
            <div className="accordion" id="ordersAccordion">
              {orders.map(order => (
                <div key={order.id} className="accordion-item">
                  <h2 className="accordion-header" id={`heading${order.id}`}>
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${order.id}`}
                      aria-expanded="true"
                      aria-controls={`collapse${order.id}`}
                    >
                      Order Code: {order.order_code}
                    </button>
                  </h2>
                  <div
                    id={`collapse${order.id}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading${order.id}`}
                    data-bs-parent="#ordersAccordion"
                  >
                    <div className="accordion-body">
                      <p><strong>Shipping to:</strong> {order.shipping_line1}, {order.shipping_city} {order.shipping_postal_code}</p>
                      <p><strong>Total Price:</strong> ${order.total_price}</p>
                      <p><strong>Order Date:</strong> {formatDateTime(order.created_at)}</p>
                      <ul className="list-group list-group-flush">
                        {order.items.map(item => (
                          <li key={item.id} className="list-group-item">
                            <div className="d-flex justify-content-between">
                              <span>{item.product.name}</span>
                              <span>Quantity: {item.quantity}, Price: ${item.price}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No orders found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;