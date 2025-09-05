// client/src/app/products/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import toast from 'react-hot-toast';

type Variant = {
  color: string;
  imageUrl: string;
  stock: number;
};

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  variants: Variant[];
  categoria?: string;
  destaque?: boolean;
};

type ApiResponse = Product | { error: string };

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/api/products/${id}`)
        .then(res => res.json())
        .then((data: ApiResponse) => {
          if ('error' in data) {
            throw new Error(data.error);
          }
          setProduct(data);
          if (data.variants && data.variants.length > 0) {
            setSelectedVariant(data.variants[0]);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Erro ao buscar produto:", err);
          setError('Produto não encontrado.');
          setLoading(false);
        });
    }
  }, [id]);

  // --- NOVIDADE: Lógica de adicionar ao carrinho está de volta! ---
  const handleAddToCart = () => {
    if (product && selectedVariant) {
      // Passamos o produto principal e a variante selecionada
      addToCart(product, selectedVariant);
      toast.success(`${product.name} (${selectedVariant.color}) foi adicionado ao carrinho!`);
    }
  };

  if (loading) return <main><h1>Carregando...</h1></main>;
  if (error) return <main><h1>{error}</h1></main>;
  if (!product || !selectedVariant) return <main><h1>Produto não encontrado ou sem variantes disponíveis.</h1></main>;

  return (
    <main>
      <div className="product-detail-layout">
        <div className="product-detail-image">
          <img src={selectedVariant.imageUrl} alt={`${product.name} - ${selectedVariant.color}`} />
        </div>
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p style={{ fontSize: '1.2rem', color: '#555' }}>{product.description}</p>
          <div className="color-selector" style={{ margin: '1.5rem 0' }}>
            <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Cor: {selectedVariant.color}</span>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              {product.variants.map((variant) => (
                <button
                  key={variant.color}
                  onClick={() => setSelectedVariant(variant)}
                  style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    backgroundColor: variant.color.toLowerCase() === 'rgb' ? 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' : variant.color.toLowerCase(),
                    border: selectedVariant.color === variant.color ? '3px solid var(--color-primary)' : '1px solid #ccc',
                    cursor: 'pointer'
                  }}
                  title={variant.color}
                />
              ))}
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>R$ {product.price}</p>
          <p>Estoque disponível: {selectedVariant.stock} unidades</p>
          <button onClick={handleAddToCart} className="button-primary" disabled={selectedVariant.stock === 0}>
            {selectedVariant.stock > 0 ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
          </button>
        </div>
      </div>
    </main>
  );
}