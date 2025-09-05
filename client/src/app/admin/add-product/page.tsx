// client/src/app/admin/add-product/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'; // Usando toast para notificações

export default function AddProductPage() {
  const router = useRouter();
  // Estados para os campos de texto
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  
  // Estado para o ARQUIVO da imagem
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para guardar o arquivo selecionado no estado
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !stock || !category || !imageFile) {
      toast.error('Por favor, preencha todos os campos e selecione uma imagem.');
      return;
    }

    setIsSubmitting(true);
    
    // Usamos FormData para enviar o arquivo junto com os outros dados
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', parseFloat(price).toFixed(2));
    formData.append('stock', stock);
    formData.append('categoria', category.toLowerCase());
    formData.append('destaque', String(isFeatured));
    formData.append('image', imageFile); // A chave 'image' é a que o backend espera

    try {
      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        body: formData, // Enviamos o FormData
        // O navegador define o 'Content-Type' como 'multipart/form-data' automaticamente
      });

      if (!response.ok) {
        throw new Error('Falha ao criar o produto no servidor.');
      }

      toast.success('Produto cadastrado com sucesso!');
      router.push('/admin/products');

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido';
      toast.error(`Erro: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h1>Adicionar Novo Produto</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
        
        <div className="form-group">
          <label htmlFor="name">Nome do Produto</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4}></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="price">Preço (Ex: 99.90)</label>
          <input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="stock">Estoque</label>
          <input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="category">Categoria</label>
          <input id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required placeholder="Ex: fones, teclados, mouses"/>
        </div>

        {/* Campo para fazer upload da imagem */}
        <div className="form-group">
          <label htmlFor="image">Imagem do Produto</label>
          <input id="image" type="file" accept="image/*" onChange={handleFileChange} required />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input id="featured" type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
          <label htmlFor="featured">Marcar como produto em destaque?</label>
        </div>
        
        <button type="submit" className="button-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar Produto'}
        </button>
      </form>
    </main>
  );
}