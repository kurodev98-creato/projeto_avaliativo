import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import pb from '@/lib/pocketbaseClient';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await pb.collection('orders').getOne(orderId, { $autoCancel: false });
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-3xl mx-auto space-y-6">
              <Skeleton className="h-12 w-3/4 mx-auto" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">Pedido não encontrado</h1>
              <Button onClick={() => navigate('/')}>Voltar para home</Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const estimatedDelivery = new Date(order.created);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + (order.shippingMethod === 'express' ? 5 : 10));

  return (
    <>
      <Helmet>
        <title>Pedido Confirmado - ShopHub</title>
        <meta name="description" content="Seu pedido foi confirmado com sucesso" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Pedido confirmado</h1>
              <p className="text-muted-foreground">
                Obrigado pela sua compra! Seu pedido foi recebido e está sendo processado.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Número do pedido</p>
                  <p className="font-semibold">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Data do pedido</p>
                  <p className="font-semibold">
                    {new Date(order.created).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Entrega estimada</p>
                  <p className="font-semibold">
                    {estimatedDelivery.toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Itens do pedido
                </h2>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t mt-6 pt-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Endereço de entrega
                </h2>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.name}<br />
                  {order.shippingAddress.street}, {order.shippingAddress.number} {order.shippingAddress.complement && `- ${order.shippingAddress.complement}`}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}<br />
                  {order.shippingAddress.phone}
                </p>
              </div>

              <div className="border-t mt-6 pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">R$ {order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="font-medium">
                      {order.shippingCost === 0 ? 'Grátis' : `R$ ${order.shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl text-primary">
                      R$ {order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Voltar para home
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Ver meus pedidos
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default OrderConfirmationPage;