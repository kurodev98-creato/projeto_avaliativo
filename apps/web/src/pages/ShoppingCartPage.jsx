import React from "react";
import { Link } from "react-router-dom";

const ShoppingCartPage = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>🛒 Seu Carrinho</h1>
      
      <div style={{ textAlign: 'center', padding: '50px 20px', border: '1px solid #e1e1e1', borderRadius: '8px', backgroundColor: '#fafafa' }}>
        <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '20px' }}>O seu carrinho está vazio de momento.</p>
        <Link to="/">
          <button style={{ padding: '12px 24px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Continuar a Comprar
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ShoppingCartPage;