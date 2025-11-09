import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductHero.css';

const ProductHero = () => {

  return (
    <div className="product-hero">
      <div className="hero-content">
        <h1 className="hero-title">
          {'TOY LAND'.split('').map((char, index) => (
            <span key={index} className="bounce-letter" style={{ animationDelay: `${0.1 * index}s` }}>
              {char}
            </span>
          ))}
        </h1>
        <p className="hero-subtitle">Where every toy tells a story!</p>
        <div className="hero-buttons">
          <Link to="/products" className="shop-now-btn">
            Shop Now
          </Link>
        </div>
      </div>
      <div className="toy-shelf">
        <span className="toy-emoji" style={{ animationDelay: '0.1s' }}>🧸</span>
        <span className="toy-emoji" style={{ animationDelay: '0.2s' }}>🎨</span>
        <span className="toy-emoji" style={{ animationDelay: '0.3s' }}>🎮</span>
        <span className="toy-emoji" style={{ animationDelay: '0.4s' }}>🚂</span>
        <span className="toy-emoji" style={{ animationDelay: '0.5s' }}>🎪</span>
      </div>
    </div>
  );
};

export default ProductHero;