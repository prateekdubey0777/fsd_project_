import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Cart() {
  const navigate = useNavigate();
  const [lines, setLines] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const detailed = [];
      for (const it of cart) {
        const res = await api.get(`/products/${it.product}`);
        detailed.push({ product: it.product, quantity: it.quantity, p: res.data });
      }
      setLines(detailed);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load cart');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateQty = (product, quantity) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const it = cart.find((x) => x.product === product);
    if (it) it.quantity = Number(quantity);
    localStorage.setItem('cart', JSON.stringify(cart));
    load();
  };

  const remove = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    localStorage.setItem('cart', JSON.stringify(cart.filter((x) => x.product !== product)));
    load();
  };

  const checkout = () => {
    navigate('/checkout');
  };

  const subtotal = lines.reduce((sum, l) => sum + l.p.price * l.quantity, 0);

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center">
        <h3 className="m-0">Cart</h3>
        <div className="ms-auto">
          <Link className="btn btn-outline-dark" to="/products">Continue Shopping</Link>
        </div>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {lines.length === 0 && !error ? (
        <div className="mt-3 text-muted">Cart is empty.</div>
      ) : (
        <div className="mt-3">
          {lines.map((l) => (
            <div key={l.product} className="border rounded p-3 mb-2 d-flex align-items-center gap-3">
              <div className="fw-bold" style={{ width: 260 }}>{l.p.name}</div>
              <div>₹{l.p.price}</div>
              <input
                type="number"
                min="1"
                className="form-control"
                style={{ width: 120 }}
                value={l.quantity}
                onChange={(e) => updateQty(l.product, e.target.value)}
              />
              <button className="btn btn-outline-danger btn-sm" onClick={() => remove(l.product)}>Remove</button>
            </div>
          ))}

          <div className="mt-3 d-flex align-items-center">
            <div className="fw-bold">Subtotal: ₹{subtotal}</div>
            <button className="btn btn-dark ms-auto" onClick={checkout}>Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}
