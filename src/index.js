import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import Cookies from 'js-cookie';
import Base from "./pages/Base";
import Home from "./pages/Home";
import Register from './pages/Register';
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import Products from "./pages/Products";
import Product from './pages/Product';
import Cart from "./pages/Cart";
import TrackOrders from './pages/TrackOrders';
import MyOrders from './pages/MyOrders';
import Success from './pages/Success';
import isAuthenticated from './utility/auth';


const setDeviceIdCookie = () => {
  if (!Cookies.get('device_id')) {
    const deviceId = crypto.randomUUID();
    Cookies.set('device_id', deviceId, {expires: 365, path: '/' });
    console.log(`Setting new device_id: ${deviceId}`);
  } else {
    console.log(`Found existing device_id: ${Cookies.get('device_id')}`);
  }
};

setDeviceIdCookie();

axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
  const csrftoken = Cookies.get('csrftoken');
  if (csrftoken) {
    config.headers['X-CSRFTOKEN'] = csrftoken;
  }
  const deviceId = Cookies.get('device_id');
  if (deviceId) {
    config.headers['Device-ID'] = deviceId;
  }
  return config
});

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Base />}>
          <Route index element={<Home />}/>
          <Route path="login" element={isAuthenticated() ? <Navigate to="/" replace /> : <Login />} />
          <Route path="logout" element={!isAuthenticated() ? <Navigate to="/" replace /> : <Logout />} />
          <Route path="register" element={<Register />} />
          <Route exact path="categories" element={<Categories />} />
          <Route path="categories/:id" element={<Category />} />
          <Route path="categories/:id/products" element={<Products />} />
          <Route path="categories/:category_id/products/:product_id" element={<Product />} />
          <Route exact path="cart" element={<Cart />} />
          <Route path="track-orders" element={<TrackOrders />} />
          <Route path="track-orders/my-orders" element={!isAuthenticated() ? <Navigate to="/" replace /> : <MyOrders />} />
          <Route path="success" element={<Success />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />)