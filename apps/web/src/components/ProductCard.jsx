import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Função única e corrigida para o PocketBase
  const handleAddToCart = (e) => {
    e.preventDefault();
    try {
      addToCart(product, 1);
      toast.success('Produto adicionado ao carrinho');
    } catch (error) {
      toast.error(error.message || 'Erro ao adicionar ao carrinho');
    }
  };

  // URL da imagem vinda do PocketBase
  const imageUrl = product.images && product.images.length > 0
    ? pb.files.getUrl(product, product.images[0])
    : 'https://images.unsplash.com/photo-1648841875038-abd6b89c19b2?w=400&h=400&fit=crop';

  // Definição das variáveis de desconto para evitar erros de compilação
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-card rounded-xl overflow-hidden border hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-2 py-1 rounded-lg text-xs font-bold">
              -{discountPercent}%
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold">Esgotado</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
              {product.reviews > 0 && (
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-primary">
              R$ {product.price ? product.price.toFixed(2) : '0.00'}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                R$ {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;