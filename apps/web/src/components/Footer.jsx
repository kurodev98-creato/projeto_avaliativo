import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const categories = [
    'Eletrônicos',
    'Moda',
    'Casa e Jardim',
    'Esportes',
    'Livros',
    'Beleza'
  ];

  return (
    <footer className="bg-muted border-t mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ShopHub
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Sua loja online de confiança com os melhores produtos e preços do mercado.
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contato@shophub.com.br</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>(11) 98765-4321</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-primary transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary transition-colors">
                  Carrinho
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary transition-colors">
                  Minha Conta
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Categorias</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {categories.map((category) => (
                <li key={category}>
                  <Link to="/catalog" className="hover:text-primary transition-colors">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Atendimento</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Central de Ajuda
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Política de Privacidade
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Termos de Serviço
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Trocas e Devoluções
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ShopHub. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;