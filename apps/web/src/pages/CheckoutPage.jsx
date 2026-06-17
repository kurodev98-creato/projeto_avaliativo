import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Package, CheckCircle } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useCart } from '@/hooks/useCart.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [shippingData, setShippingData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    street: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('credit');

  const [errors, setErrors] = useState({});

  const subtotal = getCartTotal();
  const shippingCost = shippingMethod === 'express' ? 25 : subtotal > 200 ? 0 : 15;
  const total = subtotal + shippingCost;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!shippingData.name) newErrors.name = 'Nome é obrigatório';
    if (!shippingData.email) newErrors.email = 'Email é obrigatório';
    if (!shippingData.phone) newErrors.phone = 'Telefone é obrigatório';
    if (!shippingData.street) newErrors.street = 'Rua é obrigatória';
    if (!shippingData.number) newErrors.number = 'Número é obrigatório';
    if (!shippingData.city) newErrors.city = 'Cidade é obrigatória';
    if (!shippingData.state) newErrors.state = 'Estado é obrigatório';
    if (!shippingData.zipCode) newErrors.zipCode = 'CEP é obrigatório';
    
    return newErrors;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      const newErrors = validateStep1();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      const orderNumber = `ORD-${Date.now()}`;
      
      const orderData = {
        userId: currentUser.id,
        orderNumber,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: shippingData,
        shippingMethod,
        paymentMethod,
        subtotal,
        shippingCost,
        tax: 0,
        total,
        status: 'pending'
      };

      const order = await pb.collection('orders').create(orderData, { $autoCancel: false });
      
      clearCart();
      toast.success('Pedido realizado com sucesso');
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Erro ao processar pedido');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Endereço', icon: Package },
    { number: 2, title: 'Entrega', icon: Truck },
    { number: 3, title: 'Pagamento', icon: CreditCard },
    { number: 4, title: 'Revisão', icon: CheckCircle }
  ];

  return (
    <>
      <Helmet>
        <title>Checkout - ShopHub</title>
        <meta name="description" content="Finalize sua compra" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8">Finalizar compra</h1>

          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                        currentStep >= step.number
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-muted-foreground/30 text-muted-foreground'
                      }`}
                    >
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs mt-2 hidden sm:block">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 ${
                        currentStep > step.number ? 'bg-primary' : 'bg-muted-foreground/30'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl p-6 border">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold mb-4">Endereço de entrega</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input
                          id="name"
                          name="name"
                          value={shippingData.name}
                          onChange={handleShippingChange}
                          className="mt-1 text-foreground placeholder:text-muted-foreground"
                        />
                        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={shippingData.email}
                          onChange={handleShippingChange}
                          className="mt-1 text-foreground placeholder:text-muted-foreground"
                        />
                        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={shippingData.phone}
                          onChange={handleShippingChange}
                          placeholder="(11) 98765-4321"
                          className="mt-1 text-foreground placeholder:text-muted-foreground"
                        />
                        {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                      </div>

                      <div>
                        <Label htmlFor="zipCode">CEP</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={shippingData.zipCode}
                          onChange={handleShippingChange}
                          placeholder="12345-678"
                          className="mt-1 text-foreground placeholder:text-muted-foreground"
                        />
                        {errors.zipCode && <p className="text-sm text-destructive mt-1">{errors.zipCode}</p>}
                      </div>

                      <div>
                        <Label htmlFor="street">Rua</Label>
                        <Input
                          id="street"
                          name="street"
                          value={shippingData.street}
                          onChange={handleShippingChange}
                          className="mt-1 text-foreground placeholder:text-muted-foreground"
                        />
                        {errors.street && <p className="text-sm text-destructive mt-1">{errors.street}</p>}
                      </div>

                      <div>
                        <Label htmlFor="number">Número</Label>
                        <Input
                          id="number"
                          name="number"
                          value={shippingData.number}
                          onChange={handleShippingChange}
                          className="mt-1 text-foreground placeholder:text-muted-foreground"
                        />
                        {errors.number && <p className="text-sm text-destructive mt-1">{errors.number}</p>}
                      </div>

                      <div>
                        <Label htmlFor="complement">Complemento</Label>
                        <Input
                          id="complement"
                          name="complement"
                          value={shippingData.complement}
                          onChange={handleShippingChange}
                          placeholder="Apto, bloco, etc."
                          className="mt-1 text-foreground placeholder:text-muted-foreground"
                        />
                      </div>

                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          name="city"
                          value={shippingData.city}
                          onChange={handleShippingChange}
                          className="mt-1 text-foreground placeholder:text-muted-foreground"
                        />
                        {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                      </div>

                      <div>
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          name="state"
                          value={shippingData.state}
                          onChange={handleShippingChange}
                          placeholder="SP"
                          className="mt-1 text-foreground placeholder:text-muted-foreground"
                        />
                        {errors.state && <p className="text-sm text-destructive mt-1">{errors.state}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold mb-4">Método de entrega</h2>
                    
                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="flex-1 cursor-pointer">
                          <div className="font-semibold">Entrega Padrão</div>
                          <div className="text-sm text-muted-foreground">7-10 dias úteis - {subtotal > 200 ? 'Grátis' : 'R$ 15,00'}</div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="flex-1 cursor-pointer">
                          <div className="font-semibold">Entrega Expressa</div>
                          <div className="text-sm text-muted-foreground">3-5 dias úteis - R$ 25,00</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold mb-4">Método de pagamento</h2>
                    
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="credit" id="credit" />
                        <Label htmlFor="credit" className="flex-1 cursor-pointer">
                          <div className="font-semibold">Cartão de Crédito</div>
                          <div className="text-sm text-muted-foreground">Parcelamento em até 12x</div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="debit" id="debit" />
                        <Label htmlFor="debit" className="flex-1 cursor-pointer">
                          <div className="font-semibold">Cartão de Débito</div>
                          <div className="text-sm text-muted-foreground">Pagamento à vista</div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="flex-1 cursor-pointer">
                          <div className="font-semibold">PIX</div>
                          <div className="text-sm text-muted-foreground">Aprovação instantânea</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold mb-4">Revisão do pedido</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Endereço de entrega</h3>
                        <p className="text-sm text-muted-foreground">
                          {shippingData.name}<br />
                          {shippingData.street}, {shippingData.number} {shippingData.complement && `- ${shippingData.complement}`}<br />
                          {shippingData.city}, {shippingData.state} - {shippingData.zipCode}<br />
                          {shippingData.phone}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Método de entrega</h3>
                        <p className="text-sm text-muted-foreground">
                          {shippingMethod === 'express' ? 'Entrega Expressa (3-5 dias)' : 'Entrega Padrão (7-10 dias)'}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Método de pagamento</h3>
                        <p className="text-sm text-muted-foreground">
                          {paymentMethod === 'credit' && 'Cartão de Crédito'}
                          {paymentMethod === 'debit' && 'Cartão de Débito'}
                          {paymentMethod === 'pix' && 'PIX'}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Itens do pedido</h3>
                        <div className="space-y-2">
                          {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {item.name} x {item.quantity}
                              </span>
                              <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="flex-1"
                    >
                      Voltar
                    </Button>
                  )}
                  {currentStep < 4 ? (
                    <Button onClick={handleNextStep} className="flex-1">
                      Continuar
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? 'Processando...' : 'Confirmar pedido'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 border sticky top-24">
                <h2 className="text-xl font-bold mb-4">Resumo</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? 'Grátis' : `R$ ${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl text-primary">
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>Ao finalizar a compra, você concorda com nossos Termos de Serviço e Política de Privacidade.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CheckoutPage;