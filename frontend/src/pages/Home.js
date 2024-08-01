import React, { useState, useEffect } from "react";
import axiosInstance from "../interceptors/axios";
import isAuthenticated from "../utility/auth";
import { Link } from "react-router-dom";

const Home = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [randomCategoryProducts, setRandomCategoryProducts] = useState([]);
  const [randomCategory, setRandomCategory] = useState('');

  useEffect(() => {
    const getRecommendedProducts = async () => {
      if (isAuthenticated()) {
        try {
          const response = await axiosInstance.get('http://localhost:8000/api/recommended-products/');
          setRecommendedProducts(response.data.data);
        } catch (error) {
          console.error('Error fetching recommended products:', error);
        }
      }
    };

    const getBestSellers = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:8000/api/best-sellers/');
        setBestSellers(response.data);
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      }
    };

    const getRandomCategoryProducts = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:8000/api/random-category-products');
        setRandomCategoryProducts(response.data.data);
        setRandomCategory(response.data.category);
      } catch (error) {
        console.error('Error fetching random category products:', error)
      }
    };

    getRecommendedProducts();
    getBestSellers();
    getRandomCategoryProducts();
  }, []);

  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const productChunks = chunkArray(recommendedProducts, 5);
  const bestSellersChunks = chunkArray(bestSellers, 5);
  const randomProductsChunks = chunkArray(randomCategoryProducts, 5);

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col text-center">
          <h1 className="display-4">Home</h1>
        </div>
      </div>
      {recommendedProducts.length > 0 && (
        <div className="text-center">
          <h2 className="display-5 mt-5">Recommended For You</h2>
          <div id="recommendedProductsCarousel" className="carousel slide" data-bs-ride="carousel">
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
            <button className="carousel-control-prev pe-4" type="button" data-bs-target="#recommendedProductsCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next ps-4" type="button" data-bs-target="#recommendedProductsCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      )}
      {bestSellers.length > 0 && (
        <div className="text-center">
          <h2 className="display-5 mt-5">Best Sellers</h2>
          <div id="bestSellersCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {bestSellersChunks.map((chunk, index) => (
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
            <button className="carousel-control-prev pe-4" type="button" data-bs-target="#bestSellersCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next ps-4" type="button" data-bs-target="#bestSellersCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      )}
      {randomCategoryProducts.length > 0 && (
        <div className="text-center">
          <h2 className="display-5 mt-5">{randomCategory}</h2>
          <div id="randomProductsCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {randomProductsChunks.map((chunk, index) => (
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
            <button className="carousel-control-prev pe-4" type="button" data-bs-target="#randomProductsCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next ps-4" type="button" data-bs-target="#randomProductsCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;