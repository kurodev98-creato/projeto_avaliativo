import React from 'react';
import { useCart } from '@/hooks/useCart.jsx';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const ShoppingCart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  const handleUpdateQuantity = (id, currentQty, delta, stock) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    if (newQty > stock) {
      toast.error(`Desculpe, temos apenas ${stock} unidades em stock.`);
      return;
    }
    updateQuantity(id, newQty);
  };

  const handleCheckout = () => {
    toast.success('Processando o seu pedido...');
    // Aqui entrará a lógica de criar a coleção "orders" no PocketBase posteriormente
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
        <div className="bg-muted p-4 rounded-full mb-4">
          <ShoppingBag className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-1">O seu carrinho está vazio</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Navegue pela loja e adicione produtos para começar a comprar.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lista de Itens (Ocupa 2 colunas no desktop) */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-bold">O meu Carrinho ({cartItems.length})</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => { clearCart(); toast.info('Carrinho limpo'); }}
            className="text-destructive hover:text-destructive/90 text-xs"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Limpar carrinho
          </Button>
        </div>

        <ScrollArea className="h-[50vh] pr-4">
          <div className="space-y-3">
            {cartItems.map((item) => {
              // Gera a URL da imagem guardada no PocketBase
              const imageUrl = item.images && item.images.length > 0
                ? pb.files.getUrl(item, item.images[0])
                : 'https://images.unsplash.com/photo-1648841875038-abd6b89c19b2?w=150&h=150&fit=crop';

              return (
                <div 
                  key={item.id} 
                  className="flex gap-4 bg-card border rounded-xl p-3 items-center justify-between shadow-sm hover:shadow-md transition-all"
                >
                  {/* Imagem do Produto */}
                  <img 
                    src={imageUrl} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-lg bg-muted flex-shrink-0"
                  />

                  {/* Informações do Produto */}
                  <div className="flex-grow min-w-0">
                    <h4 className="font-semibold text-sm text-card-foreground line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-1">
                      Preço Unitário: R$ {item.price.toFixed(2)}
                    </p>
                    <span className="text-sm font-bold text-primary">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Controles de Quantidade e Remoção */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex items-center border rounded-lg bg-background">
                      <Button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, -1, item.stock)} 
                        size="icon" 
                        variant="ghost"
                        className="h-8 w-8 rounded-l-lg"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, 1, item.stock)} 
                        size="icon" 
                        variant="ghost"
                        className="h-8 w-8 rounded-r-lg"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <Button 
                      onClick={() => { removeFromCart(item.id); toast.success('Removido do carrinho'); }} 
                      size="icon" 
                      variant="ghost" 
                      className="text-destructive hover:bg-destructive/10 h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Resumo do Pedido (Ocupa 1 coluna no desktop) */}
      <div className="bg-card border rounded-xl p-6 h-fit shadow-sm space-y-4">
        <h3 className="font-bold text-lg">Resumo do Pedido</h3>
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>R$ {cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Portes (Envio)</span>
            <span className="text-green-600 font-medium">Grátis</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg text-card-foreground">
          <span>Total</span>
          <span className="text-primary">R$ {cartTotal.toFixed(2)}</span>
        </div>

        <Button onClick={handleCheckout} className="w-full mt-2" size="lg">
          Finalizar Compra
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ShoppingCart;