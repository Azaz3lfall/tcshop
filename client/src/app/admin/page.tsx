// client/src/app/admin/products/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2'; // --- NOVIDADE 1: Importar o SweetAlert2 ---

type Product = {
  id: number;
  name: string;
  price: string;
  stock: number;
  categoria: string;
};

export default function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar produtos:", err);
        toast.error('Não foi possível carregar os produtos.');
        setLoading(false);
      });
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);

  // --- NOVIDADE 2: Função handleDelete atualizada ---
  const handleDelete = async (id: number) => {
    // Substituímos o window.confirm por Swal.fire
    const result = await Swal.fire({
      title: 'Você tem certeza?',
      text: "Você não poderá reverter esta ação!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    });

    // Se o usuário clicou em "Sim, excluir!"
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3001/api/products/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Falha ao deletar o produto');
        }

        toast.success('Produto excluído com sucesso!');
        setProducts(products.filter(p => p.id !== id));

      } catch (error) {
        console.error('Erro:', error);
        toast.error('Não foi possível excluir o produto.');
      }
    }
  };

  if (loading) {
    return <main><h1>Carregando produtos...</h1></main>;
  }

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Gerenciar Produtos</h1>
        <Link href="/admin/add-product" className="button-primary">
          + Adicionar Produto
        </Link>
      </div>

      <table style={{ width: '100%', marginTop: '2rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>ID</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Nome</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Preço</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Estoque</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}>{product.id}</td>
              <td style={{ padding: '8px' }}>{product.name}</td>
              <td style={{ padding: '8px' }}>R$ {product.price}</td>
              <td style={{ padding: '8px' }}>{product.stock}</td>
              <td style={{ padding: '8px' }}>
                <Link href={`/admin/products/edit/${product.id}`}>
                  <button className="button-secondary">Editar</button>
                </Link>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="button-danger"
                  style={{ marginLeft: '10px' }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}