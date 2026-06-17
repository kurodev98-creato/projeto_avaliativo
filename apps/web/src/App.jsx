import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importações com caminhos relativos diretos para evitar erros de leitura
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import ShoppingCartPage from './pages/ShoppingCartPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota para a página de detalhes do produto */}
        <Route path="/product/:id" element={<ProductDetailPage />} />
        
        {/* Rota para o carrinho de compras */}
        <Route path="/cart" element={<ShoppingCartPage />} />
        
        {/* Rota padrão (Página Inicial) */}
        <Route path="/" element={
          <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Minha Loja Monorepo</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>Frontend React e PocketBase interligados com sucesso!</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <a href="/product/exemplo123" style={{ color: '#0070f3', fontWeight: 'bold' }}>Ver Produto de Teste</a>
              <a href="/cart" style={{ color: '#0070f3', fontWeight: 'bold' }}>Ir para o Carrinho 🛒</a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;