import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Package, Truck, Shield, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import pb from '@/lib/pocketbaseClient';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          pb.collection('products').getList(1, 6, {
            sort: '-rating',
            filter: 'stock > 0',
            $autoCancel: false
          }),
          pb.collection('categories').getFullList({ $autoCancel: false })
        ]);

        setFeaturedProducts(productsData.items);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: Package,
      title: 'Produtos de qualidade',
      description: 'Selecionamos os melhores produtos para você'
    },
    {
      icon: Truck,
      title: 'Entrega rápida',
      description: 'Receba seus produtos em até 7 dias úteis'
    },
    {
      icon: Shield,
      title: 'Compra segura',
      description: 'Seus dados protegidos com criptografia'
    }
  ];

  return (
    <>
      <Helmet>
        <title>ShopHub - Sua loja online de confiança</title>
        <meta name="description" content="Encontre os melhores produtos com preços incríveis na ShopHub. Eletrônicos, moda, casa e jardim, esportes e muito mais." />
      </Helmet>

      <Header />

      <main>
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1655457342304-da7423de984f"
              alt="ShopHub hero background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance" style={{ letterSpacing: '-0.02em' }}>
                Descubra produtos incríveis com os melhores preços
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-white/90">
                Milhares de produtos de qualidade com entrega rápida e segura para todo o Brasil
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/catalog')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Explorar Catálogo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-balance">Produtos em destaque</h2>
                <p className="text-muted-foreground">Os mais vendidos e bem avaliados</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/catalog')}>
                Ver todos
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum produto disponível no momento</p>
              </div>
            )}
          </div>
        </section>

        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-balance">Explore por categoria</h2>
            
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to="/catalog"
                    className="bg-card rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 group border"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                      <Star className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Ofertas especiais toda semana
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto leading-relaxed text-white/90">
              Cadastre-se e receba descontos exclusivos direto no seu email
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              Criar conta grátis
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;