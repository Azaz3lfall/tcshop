'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation'; // Hook para ler a parte dinâmica da URL

// Definindo o tipo do produto
type Product = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string;
  stock: number;
};

// Componente para a lista de produtos (para reutilizar o visual)
const ProductList = ({ products }: { products: Product[] }) => (
    <div className="product-grid">
        {products.map(product => (
            <Link href={`/products/${product.id}`} key={product.id} className="product-card">
                <div>
                    <img src={product.imageUrl} alt={product.name} />
                    <div className="product-card-content">
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <h3>R$ {product.price}</h3>
                    </div>
                </div>
            </Link>
        ))}
    </div>
);


export default function CategoryPage() {
  const params = useParams(); // Pega os parâmetros da URL
  const categorySlug = params.slug; // Pega o valor de [slug], ex: "audio"

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Só busca os dados se a categoria (slug) existir
    if (categorySlug) {
      // Faz a chamada para a nossa nova API
      fetch(`http://localhost:3001/api/products/category/${categorySlug}`)
        .then(res => res.json())
        .then((data: Product[]) => {
          setProducts(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Erro ao buscar produtos da categoria:", err);
          setLoading(false);
        });
    }
  }, [categorySlug]); // O useEffect será executado novamente se a categoria na URL mudar

  if (loading) {
    return <main><h1>Carregando produtos da categoria {decodeURIComponent(categorySlug as string)}...</h1></main>
  }

  return (
    <main>
      {/* 'decodeURIComponent' é para exibir nomes com espaços ou acentos corretamente, como "periféricos" */}
      <h1 style={{ textTransform: 'capitalize' }}>Categoria: {decodeURIComponent(categorySlug as string)}</h1>
      
      {products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <p>Nenhum produto foi encontrado nesta categoria.</p>
      )}
    </main>
  );
}