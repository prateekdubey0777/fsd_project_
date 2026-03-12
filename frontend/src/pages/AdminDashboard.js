import { useEffect, useState } from 'react';
import api from '../api';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const [newProduct, setNewProduct] = useState({ name: '', price: 0, category: 'General', stock: 0, images: [] });

  const load = async () => {
    setError('');
    try {
      const [p, o, u] = await Promise.all([
        api.get('/products'),
        api.get('/orders'),
        api.get('/admin/users'),
      ]);
      setProducts(p.data);
      setOrders(o.data);
      setUsers(u.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load admin data');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createProduct = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...newProduct, price: Number(newProduct.price), stock: Number(newProduct.stock), images: [] };
      await api.post('/products', payload);
      setNewProduct({ name: '', price: 0, category: 'General', stock: 0, images: [] });
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Create product failed');
    }
  };

  const updateOrderStatus = async (id, status) => {
    setError('');
    try {
      await api.put(`/orders/${id}/status`, { status });
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Update status failed');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Admin Dashboard</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="border rounded p-3">
            <div className="fw-bold mb-2">Create Product</div>
            <form onSubmit={createProduct}>
              <div className="mb-2">
                <input className="form-control" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
              </div>
              <div className="row">
                <div className="col-4 mb-2">
                  <input type="number" className="form-control" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                </div>
                <div className="col-4 mb-2">
                  <input className="form-control" placeholder="Category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
                </div>
                <div className="col-4 mb-2">
                  <input type="number" className="form-control" placeholder="Stock" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
                </div>
              </div>
              <button className="btn btn-dark btn-sm" type="submit">Create</button>
            </form>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="border rounded p-3">
            <div className="fw-bold mb-2">Users</div>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead><tr><th>Email</th><th>Role</th></tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="border rounded p-3">
            <div className="fw-bold mb-2">Orders</div>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead><tr><th>Id</th><th>User</th><th>Status</th><th>Total</th><th>Action</th></tr></thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td>{o._id.slice(-6)}</td>
                      <td>{o.user?.email}</td>
                      <td>{o.status}</td>
                      <td>₹{o.total}</td>
                      <td>
                        <select className="form-select form-select-sm" value={o.status} onChange={(e) => updateOrderStatus(o._id, e.target.value)}>
                          <option value="PENDING">PENDING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="border rounded p-3">
            <div className="fw-bold mb-2">Products (latest 100)</div>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th></tr></thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>₹{p.price}</td>
                      <td>{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
