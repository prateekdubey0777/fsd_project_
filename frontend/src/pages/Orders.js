import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Orders() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/orders/mine');
        setItems(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load orders');
      }
    })();
  }, []);

  return (
    <div className="container mt-4">
      <h3>My Orders</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      {items.map((o) => (
        <div key={o._id} className="border rounded p-3 mb-2">
          <div className="d-flex">
            <div className="fw-bold">Order #{o._id.slice(-6)}</div>
            <div className="ms-auto">{o.status}</div>
          </div>
          <div className="text-muted">Total: ₹{o.total}</div>
          <Link className="btn btn-outline-dark btn-sm mt-2" to={`/orders/${o._id}`}>View</Link>
        </div>
      ))}

      {items.length === 0 && !error && <div className="text-muted">No orders yet.</div>}
    </div>
  );
}
