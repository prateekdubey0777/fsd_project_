import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Checkout() {
  const navigate = useNavigate();
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('India');
  const [error, setError] = useState('');

  const placeOrder = async (e) => {
    e.preventDefault();
    setError('');

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      const res = await api.post('/orders', {
        items: cart,
        shippingAddress: { line1, city, state, zip, country },
        paymentMode: 'COD',
      });
      localStorage.removeItem('cart');
      navigate(`/orders/${res.data._id}`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Order failed');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 720 }}>
      <h3>Checkout</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={placeOrder}>
        <div className="mb-3">
          <label className="form-label">Address Line 1</label>
          <input className="form-control" value={line1} onChange={(e) => setLine1(e.target.value)} required />
        </div>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">City</label>
            <input className="form-control" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">State</label>
            <input className="form-control" value={state} onChange={(e) => setState(e.target.value)} required />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">ZIP</label>
            <input className="form-control" value={zip} onChange={(e) => setZip(e.target.value)} required />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Country</label>
          <input className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </div>
        <button className="btn btn-dark" type="submit">Place Order (COD)</button>
      </form>
    </div>
  );
}
