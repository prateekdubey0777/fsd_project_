import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container mt-4">
      <div className="p-4 bg-light rounded border">
        <h2>SHOPEZ</h2>
        <p className="mb-3">Your one-stop shop for everything.</p>
        <Link className="btn btn-dark" to="/products">Browse Products</Link>
      </div>
    </div>
  );
}
