import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Products() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    try {
      const res = await api.get('/products', { params: q ? { q } : {} });
      setItems(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load products');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex gap-2 align-items-center mb-3">
        <h3 className="m-0">Products</h3>
        <div className="ms-auto d-flex gap-2">
          <input
            className="form-control"
            placeholder="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ maxWidth: 320 }}
          />
          <button className="btn btn-outline-dark" onClick={load}>Search</button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {items.map((p) => (
          <div key={p._id} className="col-md-4 mb-3">
            <div className="card h-100">
              {p.images?.[0] && (
                <img
                  src={p.images[0]}
                  className="card-img-top"
                  alt={p.name}
                  style={{ height: 220, objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <div className="text-muted">{p.category}</div>
                <div className="fw-bold mt-2">₹{p.price}</div>
                <Link className="btn btn-dark btn-sm mt-3" to={`/products/${p._id}`}>View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !error && (
        <div className="text-muted">No products yet. (Create some using Admin account.)</div>
      )}
    </div>
  );
}
