// client/src/app/cart/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import toast from 'react-hot-toast'; // Importamos para usar no botão de limpar

export default function CartPage() {
  const { cartItems, removeFromCart, updateItemQuantity, clearCart, totalPrice } = useCart();

  const handleClearCart = () => {
    clearCart();
    toast.success('Carrinho esvaziado!');
  };

  if (cartItems.length === 0) {
    return (
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Seu carrinho está vazio.</h1>
        <Link href="/" style={{ textDecoration: 'underline', color: 'blue', marginTop: '1rem', display: 'inline-block' }}>
          Comece a comprar
        </Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Seu Carrinho</h1>
      <div>
        {cartItems.map(item => (
          // Usamos item.variantId como chave, pois é único
          <div key={item.variantId} className="cart-item">
            <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h2 style={{ margin: 0 }}>{item.name}</h2>
              {/* --- NOVIDADE: Mostrando a cor do item --- */}
              <p style={{ margin: '0.2rem 0', color: '#666' }}>Cor: {item.color}</p>
              <p style={{ margin: '0.5rem 0', fontSize: '1.2rem' }}>R$ {item.price}</p>
            </div>
            <div className="cart-item-actions">
              {/* --- MUDANÇA: Passando variantId em vez de id --- */}
              <button onClick={() => updateItemQuantity(item.variantId, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateItemQuantity(item.variantId, item.quantity + 1)}>+</button>
            </div>
            {/* --- MUDANÇA: Passando variantId em vez de id --- */}
            <button onClick={() => removeFromCart(item.variantId)} className="button-danger" style={{ marginLeft: '2rem' }}>
              Remover
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h2>Total: R$ {totalPrice.toFixed(2).replace('.', ',')}</h2>
        {/* Usando a nova função handleClearCart com toast */}
        <button onClick={handleClearCart} className="button-danger">
          Limpar Carrinho
        </button>
        <Link href="/checkout">
          <button className="button-primary" style={{ marginLeft: '1rem' }}>
            Finalizar Compra
          </button>
        </Link>
      </div>
    </main>
  );
}