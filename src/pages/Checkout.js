import React from 'react';
import { useState, useEffect } from 'react';
import axiosInstance from '../interceptors/axios';


const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
        try {
            const response = await axiosInstance.get('http://localhost:8000/api/cart/');
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    fetchCartItems();
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('http://localhost:8000/api/create-checkout-session/', {
        cartItems: cartItems,
      });
      setSessionId(response.data.id);
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <div>
        <form onSubmit={handleFormSubmit}>
          <button type="submit">Checkout</button>
        </form>
    </div>
  );
};

export default Checkout;