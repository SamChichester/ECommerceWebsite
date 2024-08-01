import React, { useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../interceptors/axios';

const Success = () => {
    const [order, setOrder] = useState(null);
    const [success, setSuccess] = useState(false);
    const location = useLocation();
    const sessionId = new URLSearchParams(location.search).get('session_id');

    useEffect(() => {

        if (sessionId) {
            axiosInstance.get(`http://localhost:8000/api/orders/${sessionId}/`)
                .then(response => {
                    console.log('order data:', response.data)
                    setOrder(response.data);
                    setSuccess(true);
                })
                .catch(error => {
                    window.location.href = '/'
                    console.error('Error fetching order:', error);
                });
        } else {
            window.location.href = '/'
        }
    }, [sessionId]);

    return (
        <div className='container mt-5'>
            {success ? (
                <div className='text-center mb-5'>
                    <h1 className='display-4'>Order Successful!</h1>
                    <p className='lead'>Thank you for your purchase!</p>
                    <h2 className='my-4'>Order Details:</h2>
                </div>
                ) : null}
            {order ? (
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
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Success;