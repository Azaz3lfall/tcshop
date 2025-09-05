'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Vamos usar o componente Image para o banner

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string;
  stock: number;
  destaque?: boolean;
  categoria?: string;
};

// Componente reutilizável para renderizar um card de produto
const ProductCard = ({ product }: { product: Product }) => (
    <Link href={`/products/${product.id}`} className="product-card">
        <div>
            <img src={product.imageUrl} alt={product.name} />
            <div className="product-card-content">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <h3>R$ {product.price}</h3>
            </div>
        </div>
    </Link>
);


export default function Home() {
  const [destaques, setDestaques] = useState<Product[]>([]);
  const [outrosProdutos, setOutrosProdutos] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(response => response.json())
      .then((allProducts: Product[]) => {
        // Filtra produtos em destaque
        const destaquesFiltrados = allProducts.filter(p => p.destaque === true);
        const outrosProdutosFiltrados = allProducts.filter(p => p.destaque !== true);
        
        // Pega todas as categorias únicas e remove valores vazios
        const uniqueCategories = [...new Set(allProducts.map(p => p.categoria).filter(Boolean))];
        setCategories(uniqueCategories as string[]);

        setDestaques(destaquesFiltrados);
        setOutrosProdutos(outrosProdutosFiltrados);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar produtos:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <main><p>Carregando loja...</p></main>;
  }

  return (
    <main>
      {/* Seção de Categorias */}
      <section style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2>Navegue por Categoria</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', padding: '1rem 0' }}>
          {categories.map(category => (
            <Link key={category} href={`/category/${category}`} style={{ 
                padding: '10px 20px', 
                backgroundColor: '#e9ecef', 
                borderRadius: '20px', 
                textDecoration: 'none', 
                color: '#333', 
                fontWeight: 500,
                transition: 'background-color 0.2s'
             }}
             onMouseOver={e => e.currentTarget.style.backgroundColor = '#ced4da'}
             onMouseOut={e => e.currentTarget.style.backgroundColor = '#e9ecef'}
             >
                {/* Deixa a primeira letra maiúscula */}
                {category.charAt(0).toUpperCase() + category.slice(1)}
            </Link>
          ))}
        </div>
      </section>
      
      {/* Seção de Destaques */}
      {destaques.length > 0 && (
        <section>
          <h1 style={{borderTop: '1px solid #eee', paddingTop: '2rem'}}>Produtos em Destaque</h1>
          <div className="product-grid">
            {destaques.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}

      {/* Seção de Outros Produtos */}
      {outrosProdutos.length > 0 && (
        <section style={{ marginTop: '3rem' }}>
          <h1>Nosso Catálogo</h1>
          <div className="product-grid">
            {outrosProdutos.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}
    </main>
  );
}