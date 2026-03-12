import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { setAuth } from '../auth';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setAuth(res.data.token, res.data.user);
      navigate('/products');
    } catch (err) {
      setError(err?.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 520 }}>
      <h3>Register</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary w-100" type="submit">Create account</button>
      </form>
      <div className="mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
