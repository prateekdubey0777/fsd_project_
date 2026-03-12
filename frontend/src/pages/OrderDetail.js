import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function OrderDetail() {
  const { id } = useParams();
  const [o, setO] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setO(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load order');
      }
    })();
  }, [id]);

  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  if (!o) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center">
        <h3 className="m-0">Order Detail</h3>
        <Link className="btn btn-outline-dark ms-auto" to="/orders">Back</Link>
      </div>

      <div className="border rounded p-3 mt-3">
        <div><span className="fw-bold">Status:</span> {o.status}</div>
        <div><span className="fw-bold">Total:</span> ₹{o.total}</div>
        <div className="mt-3 fw-bold">Items</div>
        {o.items.map((it, idx) => (
          <div key={idx} className="d-flex justify-content-between border-bottom py-2">
            <div>{it.name} x {it.quantity}</div>
            <div>₹{it.price * it.quantity}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
