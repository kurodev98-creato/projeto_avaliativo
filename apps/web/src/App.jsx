import React, { useState } from 'react';

const PRODUCTS = [
  {
    id: 1,
    name: 'Teclado Mecânico RGB',
    category: 'Periféricos',
    price: 299.90,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60',
    description: 'Switch azul, iluminação RGB customizável e layout ABNT2.'
  },
  {
    id: 2,
    name: 'Mouse Gamer 16000 DPI',
    category: 'Periféricos',
    price: 159.90,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60',
    description: 'Sensor óptico de alta precisão e 6 botões programáveis.'
  },
  {
    id: 3,
    name: 'Headset Surround 7.1',
    category: 'Áudio',
    price: 349.00,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=60',
    description: 'Drivers de 50mm, microfone com cancelamento de ruído.'
  },
  {
    id: 4,
    name: 'Monitor UltraWide 29"',
    category: 'Monitores',
    price: 1299.00,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60',
    description: 'Painel IPS, 75Hz, tempo de resposta 1ms e FreeSync.'
  }
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + amount;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
          <a href="#features" className="nav-link">Features</a>
          <button 
            className="btn btn-secondary" 
            onClick={() => setIsCartOpen(!isCartOpen)}
            style={{ padding: '0.5rem 1rem' }}
          >
            🛒 Carrinho ({totalItems})
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">
          Frontend React e PocketBase interligados com sucesso!
        </h1>
        <div className="hero-buttons">
          <a href="#produtos" className="btn btn-primary">
            Ver Produtos
          </a>
          <button className="btn btn-secondary" onClick={() => setIsCartOpen(true)}>
            Abrir Carrinho 🛒 ({totalItems})
          </button>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="main-content" id="produtos">
        {/* Products Grid */}
        <div className="products-grid">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="card">
              <img 
                src={product.image} 
                alt={product.name}
                style={{ 
                  width: '100%', 
                  height: '160px', 
                  objectFit: 'cover', 
                  borderRadius: '0.5rem' 
                }} 
              />
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600, marginTop: '0.5rem' }}>
                {product.category}
              </span>
              <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>{product.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{product.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                <button 
                  className="btn btn-primary" 
                  onClick={() => addToCart(product)}
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                >
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar: Carrinho ou Features */}
        <aside className="features-panel">
          {isCartOpen || cart.length > 0 ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="features-title">Seu Carrinho</h2>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{totalItems} item(ns)</span>
              </div>

              {cart.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>O carrinho está vazio.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {cart.map((item) => (
                    <div 
                      key={item.id} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        background: '#0f172a', 
                        padding: '0.75rem', 
                        borderRadius: '0.5rem' 
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#38bdf8' }}>
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{ background: '#334155', color: '#fff', border: 'none', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.85rem' }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{ background: '#334155', color: '#fff', border: 'none', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          +
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          style={{ background: 'transparent', color: '#ef4444', border: 'none', marginLeft: '0.25rem', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}

                  <div style={{ borderTop: '1px solid #334155', paddingTop: '1rem', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
                      <span>Total:</span>
                      <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      Finalizar Compra
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="features-title">Features</h2>
              <div className="features-list" style={{ marginTop: '1rem' }}>
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
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
