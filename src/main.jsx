import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CakeSlice, ShoppingCart, Plus, Minus, Trash2, CheckCircle2, Truck, CreditCard } from 'lucide-react';
import './styles.css';

const PRODUCTS = [
  { id: 1, name: 'Cupcake Chocolate Supreme', category: 'Chocolate', price: 9.90, desc: 'Massa de chocolate, recheio cremoso e cobertura de ganache.' },
  { id: 2, name: 'Cupcake Red Velvet', category: 'Especial', price: 11.90, desc: 'Massa red velvet com creme suave e decoração artesanal.' },
  { id: 3, name: 'Cupcake Baunilha Clássico', category: 'Tradicional', price: 8.90, desc: 'Massa de baunilha com buttercream e confeitos coloridos.' },
  { id: 4, name: 'Cupcake Morango Gourmet', category: 'Frutas', price: 10.90, desc: 'Recheio de morango, cobertura leve e finalização premium.' },
  { id: 5, name: 'Cupcake Ninho com Nutella', category: 'Especial', price: 12.90, desc: 'Combinação de leite ninho, creme de avelã e massa fofinha.' },
  { id: 6, name: 'Cupcake Limão Siciliano', category: 'Frutas', price: 9.50, desc: 'Sabor cítrico equilibrado com cobertura cremosa.' }
];

const DELIVERY_FEE = 8;

function money(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function App() {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', payment: 'Pix' });
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
  const total = cart.length ? subtotal + DELIVERY_FEE : 0;

  function addToCart(product) {
    setOrder(null);
    setCart(current => {
      const found = current.find(item => item.id === product.id);
      if (found) return current.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...current, { ...product, qty: 1 }];
    });
  }

  function changeQty(id, delta) {
    setCart(current => current
      .map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item)
    );
  }

  function removeItem(id) {
    setCart(current => current.filter(item => item.id !== id));
  }

  function finishOrder() {
    setError('');
    if (!cart.length) return setError('Adicione pelo menos um cupcake ao carrinho.');
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      return setError('Preencha nome, telefone e endereço para finalizar o pedido.');
    }
    setOrder({
      id: Math.floor(Math.random() * 9000) + 1000,
      date: new Date().toLocaleString('pt-BR'),
      customer,
      items: cart,
      subtotal,
      delivery: DELIVERY_FEE,
      total
    });
  }

  function resetOrder() {
    setCart([]);
    setCustomer({ name: '', phone: '', address: '', payment: 'Pix' });
    setOrder(null);
    setError('');
  }

  return (
    <main className="app">
      <section className="hero">
        <div className="badge"><CakeSlice size={18} /> Loja virtual gourmet</div>
        <h1>Cupcake Express</h1>
        <p>Vitrine virtual, pedido eletrônico, pagamento simulado e entrega para uma loja de cupcakes gourmet.</p>
      </section>

      <section className="layout">
        <div className="products">
          <h2>Vitrine de cupcakes</h2>
          <div className="product-grid">
            {PRODUCTS.map(product => (
              <article className="product-card" key={product.id}>
                <div className="cupcake-icon"><CakeSlice size={42} /></div>
                <span>{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.desc}</p>
                <strong>{money(product.price)}</strong>
                <button onClick={() => addToCart(product)}><Plus size={16} /> Adicionar</button>
              </article>
            ))}
          </div>
        </div>

        <aside className="checkout">
          <h2><ShoppingCart size={22} /> Carrinho</h2>

          {cart.length === 0 ? <p className="muted">Nenhum item no carrinho.</p> : (
            <div className="cart-list">
              {cart.map(item => (
                <div className="cart-item" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{money(item.price)} cada</small>
                  </div>
                  <div className="qty">
                    <button onClick={() => changeQty(item.id, -1)}><Minus size={14} /></button>
                    <span>{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)}><Plus size={14} /></button>
                    <button className="remove" onClick={() => removeItem(item.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="totals">
            <span>Subtotal: <strong>{money(subtotal)}</strong></span>
            <span><Truck size={16} /> Entrega: <strong>{cart.length ? money(DELIVERY_FEE) : money(0)}</strong></span>
            <span className="total">Total: <strong>{money(total)}</strong></span>
          </div>

          <h2>Dados de entrega</h2>
          <input placeholder="Nome do cliente" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
          <input placeholder="Telefone/WhatsApp" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
          <textarea placeholder="Endereço completo" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />

          <label className="label"><CreditCard size={16} /> Forma de pagamento</label>
          <select value={customer.payment} onChange={e => setCustomer({ ...customer, payment: e.target.value })}>
            <option>Pix</option>
            <option>Cartão na entrega</option>
            <option>Dinheiro na entrega</option>
          </select>

          {error && <div className="error">{error}</div>}

          <button className="finish" onClick={finishOrder}><CheckCircle2 size={18} /> Finalizar pedido</button>
        </aside>
      </section>

      {order && (
        <section className="summary">
          <h2>Pedido #{order.id} recebido!</h2>
          <p><strong>Cliente:</strong> {order.customer.name} - {order.customer.phone}</p>
          <p><strong>Endereço:</strong> {order.customer.address}</p>
          <p><strong>Pagamento:</strong> {order.customer.payment}</p>
          <p><strong>Total:</strong> {money(order.total)}</p>
          <p>O pedido foi registrado de forma simulada para fins acadêmicos.</p>
          <button onClick={resetOrder}>Novo pedido</button>
        </section>
      )}

      <footer>Projeto acadêmico de Engenharia de Software • React + Vite • Vercel</footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
