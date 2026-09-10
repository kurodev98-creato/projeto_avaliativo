import React from 'react';

export default function App() {
  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon"></span>
          Minha Loja Monorepo
        </div>
        <nav className="nav">
          <a href="#produtos" className="nav-link">Produtos</a>
          <a href="#categorias" className="nav-link">Categorias</a>
          <a href="#sobre" className="nav-link">Sobre Nós</a>
          <a href="#contato" className="nav-link">Contato</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">
          Frontend React e PocketBase interligados com sucesso!
        </h1>
        <div className="hero-buttons">
          <a href="#produtos" className="btn btn-primary">
            Ver Produto de Teste
          </a>
          <a href="#carrinho" className="btn btn-secondary">
            Ir para o Carrinho 🛒
          </a>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="main-content">
        {/* Products Grid */}
        <div className="products-grid">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="card">
              <div className="card-image-placeholder"></div>
              <div className="card-title-placeholder"></div>
              <div className="card-line-placeholder"></div>
              <div className="card-line-placeholder" style={{ width: '50%' }}></div>
            </div>
          ))}
        </div>

        {/* Features Sidebar */}
        <aside className="features-panel">
          <h2 className="features-title">Features</h2>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <div className="feature-info">
                <h4>Performance</h4>
                <p>Performance rápida e moderna para o produto.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🛡️</div>
              <div className="feature-info">
                <h4>Segurança</h4>
                <p>Arquitetura segura protegendo seus dados.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🚀</div>
              <div className="feature-info">
                <h4>Escalabilidade</h4>
                <p>Estrutura monorepo pronta para crescer.</p>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
