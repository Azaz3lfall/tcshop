// client/src/components/Header.tsx

'use client'; 

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import React from 'react';

export const Header = () => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/" className="logo-link">
          <Image
            src="/logo.jpeg" 
            alt="TCShop Logo"
            width={120}
            height={120}
            priority
          />
        </Link>
        <nav className="main-nav">
          <Link href="/">Home</Link>
          <Link href="/admin">Admin</Link>
          {/* --- MUDANÇA AQUI --- */}
          {/* Trocamos <a> por <Link> para navegação otimizada */}
          <Link href="/#categorias">Categorias</Link>
        </nav>
        <div className="header-actions">
          <Link href="/cart" className="cart-link">
            🛒 Carrinho ({totalItems})
          </Link>
        </div>
      </div>
    </header>
  );
};