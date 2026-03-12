import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setP(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load');
      }
    })();
  }, [id]);

  const addToCart = () => {
    const cartRaw = localStorage.getItem('cart');
    const cart = cartRaw ? JSON.parse(cartRaw) : [];
    const existing = cart.find((x) => x.product === id);
    if (existing) {
      existing.quantity += Number(qty);
    } else {
      cart.push({ product: id, quantity: Number(qty) });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/cart');
  };

  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  if (!p) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          {p.images?.[0] ? (
            <img src={p.images[0]} alt={p.name} className="img-fluid rounded border" />
          ) : (
            <div className="border rounded bg-light" style={{ height: 320 }} />
          )}
        </div>
        <div className="col-md-6">
          <h3>{p.name}</h3>
          <div className="text-muted">{p.category}</div>
          <div className="fw-bold fs-4 mt-2">₹{p.price}</div>
          <p className="mt-3">{p.description}</p>

          <div className="d-flex gap-2 align-items-center">
            <input
              type="number"
              min="1"
              className="form-control"
              style={{ width: 120 }}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
            <button className="btn btn-dark" onClick={addToCart} disabled={p.stock <= 0}>
              Add to Cart
            </button>
          </div>
          <div className="mt-2 text-muted">Stock: {p.stock}</div>
        </div>
      </div>
    </div>
  );
}
