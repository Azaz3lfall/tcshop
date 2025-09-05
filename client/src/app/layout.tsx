import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/contexts/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TCShop - Sua Loja de Eletrônicos",
  description: "Os melhores produtos de tecnologia estão aqui.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <div className="page-wrapper">
          <CartProvider>
            {/* --- NOVIDADE 2: Adicionar o componente Toaster --- */}
            {/* Ele pode ficar em qualquer lugar aqui dentro, mas o topo é um bom lugar. */}
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            
            <Header />
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </div>
      </body>
    </html>
  );
}