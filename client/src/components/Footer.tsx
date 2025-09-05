import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <p>&copy; {currentYear} TCShop - Todos os direitos reservados.</p>
        <p>Projeto desenvolvido com a ajuda da IA Gemini.</p>
      </div>
    </footer>
  );
};