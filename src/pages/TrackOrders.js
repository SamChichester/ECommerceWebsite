import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../interceptors/axios";
import formatDateTime from "../utility/formatdatetime";

const TrackOrders = () => {
  const [order, setOrder] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryCode = searchParams.get("code");

  useEffect(() => {
    if (queryCode) {
      const getOrder = async () => {
        try {
          const response = await axiosInstance.get(`http://localhost:8000/api/track-orders/${queryCode}/`);
          setOrder(response.data);
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching order:', error);
          setError("No order found with the specified code.");
          setTimeout(() => {
            navigate("/track-orders");
          }, 1000);
        }
      };
      getOrder();
    }
  }, [queryCode, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length === 6) {
      navigate(`/track-orders?code=${code}`);
    } else {
      setError("Please enter a valid 6-digit code.");
    }
  };

  if (!queryCode) {
    return (
      <div className="container mt-5">
        <h1 className="display-4 mb-4">Track Your Order</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            placeholder="Enter 6-digit order code"
          />
          <button type="submit" className="btn btn-primary mt-3">Track Order</button>
        </form>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {order ? (
          <div>
            <h1 className="display-4 mb-4">Order Summary</h1>
            <div className='card'>
                <div className='card-body'>    
                    <ul className='list-group list-group-flush'>
                        {order.items.map(item => (
                            <li key={item.id} className='list-group-item'>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <span>{item.product.name}</span>
                                    <span>Quantity: {item.quantity}, Price: ${item.price}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className='mt-4'>
                        <p className='card-text'>
                            <strong>Shipping to:</strong> {order.shipping_line1}, {order.shipping_city} {order.shipping_postal_code}
                        </p>
                        <p>
                            <strong>Tracking Number:</strong> {order.order_code}
                        </p>
                        <p>
                            <strong>Created at:</strong> {formatDateTime(order.created_at)}
                        </p>
                    </div>
                </div>
            </div>
          </div>
      ) : (
        <div>
          {error ? (
            <div className="alert alert-danger">
              <p>{error}</p>
              <p>Redirecting to input page...</p>
            </div>
          ) : (
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackOrders;
