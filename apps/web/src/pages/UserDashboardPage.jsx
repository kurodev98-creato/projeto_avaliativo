import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Edit, Trash2, Plus } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import pb from '@/lib/pocketbaseClient';

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, addressesData] = await Promise.all([
          pb.collection('orders').getList(1, 50, {
            filter: `userId = "${currentUser.id}"`,
            sort: '-created',
            $autoCancel: false
          }),
          pb.collection('user_addresses').getList(1, 50, {
            filter: `userId = "${currentUser.id}"`,
            sort: '-isDefault,-created',
            $autoCancel: false
          })
        ]);

        setOrders(ordersData.items);
        setAddresses(addressesData.items);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser.id]);

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    const labels = {
      pending: 'Pendente',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };

    return (
      <Badge className={variants[status] || variants.pending}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <>
      <Helmet>
        <title>Minha Conta - ShopHub</title>
        <meta name="description" content="Gerencie sua conta, pedidos e endereços" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8">Minha conta</h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="orders">
                <Package className="w-4 h-4 mr-2" />
                Pedidos
              </TabsTrigger>
              <TabsTrigger value="addresses">
                <MapPin className="w-4 h-4 mr-2" />
                Endereços
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="bg-card rounded-xl p-6 border max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Informações pessoais</h2>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nome</p>
                    <p className="font-medium">{currentUser.name || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium">{currentUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Função</p>
                    <Badge>{currentUser.role === 'admin' ? 'Administrador' : 'Cliente'}</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-card rounded-xl p-6 border">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <p className="font-semibold mb-1">Pedido {order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(order.status)}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/order-confirmation/${order.id}`)}
                          >
                            Ver detalhes
                          </Button>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                          </p>
                          <p className="font-bold text-primary">
                            R$ {order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card rounded-xl border">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
                  <p className="text-muted-foreground mb-6">
                    Você ainda não fez nenhum pedido
                  </p>
                  <Button onClick={() => navigate('/catalog')}>
                    Explorar produtos
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="addresses">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex justify-end mb-4">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar endereço
                    </Button>
                  </div>

                  {addresses.length > 0 ? (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="bg-card rounded-xl p-6 border">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold">{address.name}</p>
                                {address.isDefault && (
                                  <Badge variant="secondary">Padrão</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {address.street}, {address.number} {address.complement && `- ${address.complement}`}<br />
                                {address.city}, {address.state} - {address.zipCode}<br />
                                {address.phone}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-card rounded-xl border">
                      <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Nenhum endereço cadastrado</h3>
                      <p className="text-muted-foreground mb-6">
                        Adicione um endereço para facilitar suas compras
                      </p>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar endereço
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default UserDashboardPage;