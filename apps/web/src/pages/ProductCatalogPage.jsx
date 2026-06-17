import React from "react";
import { Link } from "react-router-dom";

const ShoppingCartPage = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>🛒 Seu Carrinho</h1>
      
      <div style={{ textAlign: 'center', padding: '40px', border: '1px solid #eee', borderRadius: '8px' }}>
        <p style={{ color: '#666', marginBottom: '20px' }}>O teu carrinho está vazio de momento.</p>
        <Link to="/">
          <button style={{ padding: '10px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Continuar a Comprar
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ShoppingCartPage;