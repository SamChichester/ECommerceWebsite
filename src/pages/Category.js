import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../interceptors/axios';

const Category = () => {
  const { id } = useParams();
  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const getCategory = async (id) => {
      try {
        const response = await axiosInstance.get(`http://localhost:8000/api/categories/${id}/`)
        setCategory(response.data)
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    const getProductList = async (id) => {
      try {
        const response = await axiosInstance.get(`http://localhost:8000/api/best-sellers/${id}/`)
        setProducts(response.data);
      } catch (error) {
        console.log('Error fetching products:', error)
      }
    };

    getCategory(id);
    getProductList(id);
  }, [id]);

  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const productChunks = chunkArray(products, 5);

  return (
    <div className="container mt-5">
      {products.length > 0 && category ? (
        <div>
          <div className="row mb-4">
              <div className="col text-center">
                  <h1 className="display-4">{category.name}</h1>
              </div>
          </div>
          <div className='text-center mb-5'>
            <Link className="btn btn-primary" to={`products`}>View all products.</Link>
          </div>
          {products.length > 0 && (
            <div className="text-center">
              <h2 className="display-5">Products</h2>
              <div id="categoryProductsCarousel" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner">
                  {productChunks.map((chunk, index) => (
                      <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                          <div className="row justify-content-center">
                              {chunk.map(product => (
                                  <div className="col-md-2 p-2" key={product.id}>
                                      <div className="card">
                                          <img className="card-img-top" src={product.image} alt={product.name} />
                                          <div className="card-body">
                                              <h5><Link className="text-dark" to={`/categories/${product.category.id}/products/${product.id}/`}>{product.name}</Link></h5>
                                              <p className="card-text">${product.price}</p>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
                  </div>
                  <button className="carousel-control-prev pe-4" type="button" data-bs-target="#categoryProductsCarousel" data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next ps-4" type="button" data-bs-target="#categoryProductsCarousel" data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                  </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className='d-flex justify-content-center'>
          <div className='spinner-border'></div>
        </div>
      )}
    </div>
  );
};

export default Category;
