import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../interceptors/axios";
import { Link } from "react-router-dom";

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const resultsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (resultsRef.current && !resultsRef.current.contains(event.target)) {
                setResults([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleQueryChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        if (newQuery.length > 1) {
            axiosInstance.get(`http://localhost:8000/api/search/?q=${newQuery}`)
                .then((response) => {
                    setResults(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching search results:', error)
                });
        } else {
            setResults([]);
        }
    };

    return (
        <div className="container" ref={resultsRef}>
            <form className="form-inline my-2 my-lg-0">
                <input 
                    className="form-control mr-sm-2"
                    type="search"
                    placeholder="Search products"
                    aria-label="Search"
                    value={query}
                    onChange={handleQueryChange}
                />
            </form>
            {results.length > 0 && (
                <ul className="list-group position-absolute">
                    {results.map(product => (
                        <li key={product.id} className="list-group-item">
                            <Link className="text-dark" to={`http://localhost:3000/categories/${product.category.id}/products/${product.id}/`}>
                                {product.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;