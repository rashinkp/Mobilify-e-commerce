import React from 'react'
import { Route, Router, Routes } from 'react-router'
import HomePage from './pages/user/HomePage'
import Products from './pages/user/Products';
import AboutUs from './pages/user/AboutUs';
import Cart from './pages/user/Cart';
import Login from './pages/user/Login';
import Orders from './pages/user/Orders';
import Product from './pages/user/Product';
import Checkout from './pages/user/Checkout';
import Navbar from './components/user/Navbar';

const App = () => {
  return (
    <div className="px-4">
      <Navbar />
      <Routes>
        <Route path="/user" element={<HomePage />} />
        <Route path="/user/products" element={<Products />} />
        <Route path="/user/about" element={<AboutUs />} />
        <Route path="/user/cart" element={<Cart />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/orders" element={<Orders />} />
        <Route path="/user/product" element={<Product />} />
        <Route path="/user/checkout" element={<Checkout />} />
      </Routes>
    </div>
  );
}

export default App