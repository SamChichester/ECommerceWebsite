import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../interceptors/axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:8000/api/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    getCategories();
  }, []);

  return (
    <div className="container mt-5">
      {categories.length > 0 ? (
        <div className="row">
          {categories.map((category) => (
              <div className="col-md-4 mb-4" key={category.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body text-center">
                    <Link to={`/categories/${category.id}`} className="text-decoration-none text-dark">
                      <h5 className="card-title">{category.name}</h5>
                    </Link>
                  </div>
                </div>
              </div>
          ))}
        </div>
      ) : (
        <div className='d-flex justify-content-center'>
          <div className='spinner-border'></div>
        </div>
      )}

    </div>
  );
};

export default Categories;