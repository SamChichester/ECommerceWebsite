import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../interceptors/axios';
import handleAddToCart from '../utility/addtocart';
import { Button, Modal, Alert } from 'react-bootstrap';


const Products = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [alertMessage, setAlertMessage] = useState(null);
  const [successStatus, setSuccessStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAlertLoaded, setIsAlertLoaded] = useState(false);

  const handleShowAlertAndAddItem = (product, quantity) => {
    handleAddToCart(product, quantity, setAlertMessage, setSuccessStatus, setIsAlertLoaded);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }

  const handleAddToCartFromModal = () => {
    if (selectedProduct) {
      handleShowAlertAndAddItem(selectedProduct, quantity);
      setSelectedProduct(null);
    }
  };

  useEffect(() => {
    const getProducts = async (id, page) => {
      try {
        const response = await axiosInstance.get(`http://localhost:8000/api/categories/${id}/products/?page=${page}`);
        setProducts(response.data.results);
        setCategory(response.data.results[0].category);
        setTotalPages(Math.ceil(response.data.count / 12));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getProducts(id, currentPage);
  }, [id, currentPage]);

  return (
    <div className="container mt-5">
      {showAlert && isAlertLoaded && (
        <Alert variant={successStatus ? 'success' : 'danger' } onClose={() => setShowAlert(false)} dismissible>
          <strong>{successStatus ? 'Success!' : 'Error!'}</strong> {alertMessage}
        </Alert>
      )}
      {isLoading ? (
        <div className='d-flex justify-content-center'>
          <div className='spinner-border'></div>
        </div>
      ) : (
        <div>
          <div className='text-center mb-4'>
            <h1 className='display-4 mb-2'>Products in {category.name}</h1>
            <Link to={`/categories/${category.id}`} className='btn btn-primary'>Back to {category.name}</Link>
          </div>
          {products.length === 0 ? (
            <div className='text-center'>
              <p>No products available.</p>
            </div>
          ) : (
            <div className='row'>
              {products.map(product => (
                <div className='col-md-4 mb-4' key={product.id}>
                  <div className='card h-100'>
                    <img src={product.image} alt={product.name} className='card-image-top' />
                    <div className='card-body'>
                      <h5 className='card-title'><Link className='text-dark' to={`http://localhost:3000/categories/${id}/products/${product.id}/`}>{product.name}</Link></h5>
                      <p className='card-text'>{product.description}</p>
                      <p className='card-text'>${product.price}</p>
                      <p className='card-text'>Is available: {product.stock_number > 0 ? 'Yes' : 'No'}</p>
                      {product.stock_number > 0 ? 
                        (
                          <button type="button" className='btn btn-primary' onClick={() => setSelectedProduct(product)}>Add to Cart</button>
                        ) : (
                          <button type="button" className='btn btn-primary disabled'>Out of Stock</button>
                        )
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className='d-flex justify-content-center mt-4 mb-4'>
            <button
              className='btn btn-secondary me-2'
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <div className='pt-2 d-flex align-items-center justify-content-center'>
              <p>Page {currentPage} of {totalPages}</p>
            </div>
            <button
              className='btn btn-secondary ms-2'
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>

          <Modal show={selectedProduct !== null} onHide={() => setSelectedProduct(null)}>
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
              <Button variant='secondary' onClick={() => setSelectedProduct(null)}>Close</Button>
              <Button variant='primary' onClick={handleAddToCartFromModal}>Add to Cart</Button>
            </Modal.Footer>
          </Modal>
        </div>
        )}
    </div>
  );
};

export default Products;