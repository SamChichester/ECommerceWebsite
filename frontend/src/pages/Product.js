import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../interceptors/axios';
import handleAddToCart from '../utility/addtocart';
import { Modal, Button, Alert } from 'react-bootstrap';

const Product = () => {
  const { category_id, product_id } = useParams();
  const [product, setProduct] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [alertMessage, setAlertMessage] = useState(null);
  const [successStatus, setSuccessStatus] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAlertLoaded, setIsAlertLoaded] = useState(false);

  const handleShowAlertAndAddItem = (product, quantity) => {
    handleAddToCart(product, quantity, setAlertMessage, setSuccessStatus, setIsAlertLoaded);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }

  const handleAddToCartFromModal = () => {
    if (product) {
      handleShowAlertAndAddItem(product, quantity);
      setIsModalVisible(false);
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:8000/api/categories/${category_id}/products/${product_id}/`);
        setProduct(response.data);
      } catch(error) {
        console.error('Error fetching product:', error);
      }
    };

    getProduct();
  }, [category_id, product_id]);

  return (
    <div className='container mt-5'>
      {showAlert && isAlertLoaded && (
        <Alert variant={successStatus ? 'success' : 'danger' } onClose={() => setShowAlert(false)} dismissible>
          <strong>{successStatus ? 'Success!' : 'Error!'}</strong> {alertMessage}
        </Alert>
      )}
      {product ? (
        <div>
          <div className='row'>
            <div className='col-md-6'>
              <img src={product.image} alt={product.name} className='img-fluid' />
            </div>
            <div className='col-md-6 d-flex align-items-center justify-content-center'>
              <div className='text-center'>
                <h2>{product.name}</h2>
                <p className='text-muted mb-3'>Category: <Link className='text-muted' to={`http://localhost:3000/categories/${product.category.id}/`}>{product.category.name}</Link></p>
                <p>{product.description}</p>
                <h4>${product.price}</h4>
                <p className='text-muted mt-3'>Is available: {product.stock_number > 0 ? 'Yes' : 'No'}</p>
                {product.stock_number > 0 ? 
                  (
                    <button type="button" className='btn btn-primary mt-3' onClick={() => setIsModalVisible(true)}>Add to Cart</button>
                  ) : (
                    <button type="button" className='btn btn-primary disabled mt-3'>Out of Stock</button>
                  )
                }
              </div>
            </div>
          </div>
          <Modal show={isModalVisible} onHide={() => setIsModalVisible(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Select Quantity</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='mb-3'>
                <label htmlFor='quantityInput' className='form-label'>Quantity</label>
                <input 
                  type='number'
                  className='form-control'
                  id='quantityInput'
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                  min="1"
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' onClick={() => setIsModalVisible(false)}>Close</Button>
              <Button variant='primary' onClick={handleAddToCartFromModal}>Add to Cart</Button>
            </Modal.Footer>
          </Modal>
        </div>
      ) : (
        <div className='d-flex justify-content-center'>
          <div className='spinner-border'></div>
        </div>
      )}
    </div>
  );
};

export default Product;