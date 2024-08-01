import React, { useState, useEffect } from 'react';
import axiosInstance from '../interceptors/axios';
import { loadStripe } from '@stripe/stripe-js';
import Checkout from './Checkout';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51PZJ1GDsw2SW1P8iYHhpJHt1gcpGkepfOdgKg6tWG3x2o3E2S2xRajbrDzFBGmsJkNLiIEjzEdQq9fZaLVulE49o00dfRmCl0j');


const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const handleShowAlertAndRemoveItem = (product) => {
    handleRemoveFromCart(product);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  }

  const getCartProducts = () => {
    axiosInstance.get('http://localhost:8000/api/cart/')
      .then((response) => {
        setCartProducts(response.data.data);
        setCartTotalPrice(response.data.cart_total_price);
      });
  };

  const handleRemoveFromCart = (product) => {
    axiosInstance.post('http://127.0.0.1:8000/api/cart/', {
      action: 'remove',
      product: {
        id: product.id,
      }
    })
      .then((response) => {
        console.log('Product removed from cart:', response.data)
        getCartProducts();
      });
  };

  useEffect(() => getCartProducts(), []);

  return (
    <div className='container mt-5'>
      {showAlert && (
        <div className='alert alert-success alert-dismissible'>
          <button type='button' className='btn-close' onClick={() => setShowAlert(false)}></button>
          <strong>Success!</strong> Item removed from cart.
        </div>
      )}
      <div className='text-center mb-4'>
        <h1 className='display-4'>Cart</h1>
      </div>
      {cartProducts.length === 0 ? (
        <div className='text-center'>
          <p>Cart is empty.</p>
        </div>
      ) : (
        <div className='row'>
          {cartProducts.map(cartProduct => (
            <div className='col-md-4 mb-4' key={cartProduct.product.id}>
              <div className='card h-100'>
                <img src={cartProduct.image} alt={cartProduct.name} className='card-image-top' />
                <div className='card-body'>
                  <h5 className='card-title'>{cartProduct.product.name}</h5>
                  <p className='card-text'>Price: {cartProduct.product.price}</p>
                  <p className='card-text'>Quantity: {cartProduct.quantity}</p>
                  <p className='card-text'>Total Price: {cartProduct.total_price}</p>
                  <button type="button"  className='btn btn-primary' onClick={() => handleShowAlertAndRemoveItem(cartProduct.product)}>Remove from cart</button>
                </div>
              </div>
            </div>
          ))}
          <div className='col-12 mb-4 text-center'>
            <h3 className='mb-4'>Total Cart Price: {cartTotalPrice}</h3>
            <Elements stripe={stripePromise}>
              <Checkout />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;