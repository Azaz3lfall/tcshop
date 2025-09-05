import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <main style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>🎉 Obrigado pela sua compra! 🎉</h1>
      <p>Seu pedido foi recebido e está sendo processado.</p>
      <Link href="/" style={{ textDecoration: 'underline', color: 'blue', marginTop: '2rem', display: 'inline-block' }}>
        Voltar para a página inicial
      </Link>
    </main>
  );
}