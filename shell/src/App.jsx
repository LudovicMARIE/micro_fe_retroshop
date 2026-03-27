import React, { useState, useEffect, Suspense, lazy } from 'react';
import './App.css';
import eventBus from 'shared/eventBus';

const ProductGrid = lazy(() => import('mfeProduct/./ProductGrid'));
const Cart = lazy(() => import('mfeCart/./Lobby'));
const Recommendations = lazy(() =>
  import('mfeReco/./Recommendations').catch((err) => {
    console.error('MFE Recommendations indisponible:', err);
    return new Promise(() => {});
  })
);

const LoadingFallback = ({ name }) => (
  <div className="loading-fallback">Chargement {name}...</div>
);

const WithSuspense = ({ name, children }) => (
  <Suspense fallback={<LoadingFallback name={name} />}>
    {children}
  </Suspense>
);

function App() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    return eventBus.on('CART_UPDATED', (items) => setCartCount(items.length));
  }, []);

  return (
    <div className="shell">
      <header className="shell-header">
        <h1 className="logo">RetroShop</h1>
        <div className="cart-badge">Panier ({cartCount})</div>
      </header>
      <main className="shell-main">
        <section className="product-area">
          <WithSuspense name="Products"><ProductGrid /></WithSuspense>
        </section>
        <aside className="cart-area">
          <WithSuspense name="Cart"><Cart /></WithSuspense>
        </aside>
      </main>
      <section className="reco-area">
        <WithSuspense name="Recommendations"><Recommendations /></WithSuspense>
      </section>
    </div>
  );
}

export default App;