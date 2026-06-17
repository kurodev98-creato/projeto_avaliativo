import React from "react";
import { useParams, Link } from "react-router-dom";

const ProductDetailPage = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" style={{ color: '#0070f3', textDecoration: 'none' }}>← Voltar para a loja</Link>
      <div style={{ marginTop: '20px', padding: '30px', border: '1px solid #e1e1e1', borderRadius: '8px', backgroundColor: '#fff' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>Detalhes do Produto</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>ID do Produto no PocketBase: <strong style={{ color: '#000' }}>{id}</strong></p>
        <button style={{ marginTop: '15px', padding: '12px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;