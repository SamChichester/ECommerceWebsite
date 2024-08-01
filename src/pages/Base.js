import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const Base = () => {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('access_token') !== null) {
            setIsAuth(true);
        }
    }, [isAuth]);

    return (
        <>
            <nav className="navbar navbar-expand-sm bg-light navbar-light">
                <div className="container-fluid">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/categories">Categories</Link>
                        </li>
                        <li className="nav-item">
                            {isAuth ? <Link className="nav-link" to="/logout">Logout</Link> : <Link className="nav-link" to="/login">Login</Link>}
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/cart">View Cart</Link>
                        </li>
                        <li className="nav-item">
                            {isAuth ? <Link className="nav-link" to='/track-orders/my-orders'>My Orders</Link> : <Link className="nav-link" to="/track-orders">Track Orders</Link>}
                        </li>
                    </ul>
                    <SearchBar />
                </div>
            </nav>

            <Outlet />
        </>
    );
};

export default Base