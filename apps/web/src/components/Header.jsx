import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useCart } from '@/hooks/useCart.jsx';
import ShoppingCartSidebar from '@/components/ShoppingCart.jsx';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { cartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/catalog', label: 'Catálogo' },
  ];

  if (currentUser?.role === 'admin') {
    navLinks.push({ path: '/admin', label: 'Admin' });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ShopHub
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive(link.path)
                        ? 'text-primary border-b-2 border-primary pb-1'
                        : 'text-foreground/80'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/catalog')}
                className="text-foreground/80 hover:text-foreground"
              >
                <Search className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(true)}
                className="relative text-foreground/80 hover:text-foreground"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-foreground">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5 text-sm font-medium">{currentUser?.name || currentUser?.email}</div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      Minha Conta
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      Meus Pedidos
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => navigate('/login')} size="sm">
                  Entrar
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-medium ${
                      isActive(link.path) ? 'text-primary' : 'text-foreground/80'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsCartOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Carrinho ({cartItemCount})
                  </Button>
                  {isAuthenticated ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Conta
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        navigate('/login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1"
                    >
                      Entrar
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <ShoppingCartSidebar isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </>
  );
};

export default Header;