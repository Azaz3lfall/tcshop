// client/src/app/admin/products/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast'; // Importamos o toast

type ProductData = {
  name: string; description: string; price: string; imageUrl: string;
  stock: number; categoria: string; destaque: boolean;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/api/products/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Produto não encontrado');
          return res.json();
        })
        .then(data => {
          setProduct({
            name: data.name || '', description: data.description || '', price: data.price || '', imageUrl: data.imageUrl || '',
            stock: data.stock || 0, categoria: data.categoria || '', destaque: data.destaque || false,
          });
          setLoading(false);
        })
        .catch(err => {
          toast.error(err.message);
          setLoading(false);
          router.push('/admin/products');
        });
    }
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!product) return;
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setProduct(prev => ({ ...prev!, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          price: parseFloat(product.price).toFixed(2),
          stock: parseInt(String(product.stock), 10),
        }),
      });

      if (!response.ok) throw new Error('Falha ao atualizar o produto.');
      toast.success('Produto atualizado com sucesso!');
      router.push('/admin/products');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocorreu um erro.';
      toast.error(`Erro: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) return <main><h1>Carregando dados do produto...</h1></main>;
  if (!product) return <main><h1>Produto não encontrado.</h1></main>;

  return (
    <main>
      <h1>Editar Produto: {product.name}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
        {/* ...campos do formulário (são os mesmos)... */}
        <div className="form-group">
          <label htmlFor="name">Nome do Produto</label>
          <input id="name" name="name" type="text" value={product.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea id="description" name="description" value={product.description} onChange={handleChange} rows={4}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="price">Preço</label>
          <input id="price" name="price" type="number" step="0.01" value={product.price} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Estoque</label>
          <input id="stock" name="stock" type="number" value={product.stock} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="categoria">Categoria</label>
          <input id="categoria" name="categoria" type="text" value={product.categoria} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">URL da Imagem</label>
          <input id="imageUrl" name="imageUrl" type="text" value={product.imageUrl} readOnly style={{backgroundColor: '#eee'}} />
          <small>A alteração de imagem será implementada no futuro.</small>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input id="destaque" name="destaque" type="checkbox" checked={product.destaque} onChange={handleChange} />
          <label htmlFor="destaque">Marcar como produto em destaque?</label>
        </div>
        <button type="submit" className="button-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </main>
  );
}