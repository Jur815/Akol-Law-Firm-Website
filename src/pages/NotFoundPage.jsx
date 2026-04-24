import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="section not-found">
      <div className="container not-found-inner">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist. Return to the homepage to continue exploring ALS.</p>
        <Link to="/" className="btn btn-gold">
          Go Home
        </Link>
      </div>
    </section>
  );
}
