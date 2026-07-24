import LinkButton from "../components/common/LinkButton";

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="lead">
        The page you are looking for does not exist. Return to the homepage to
        continue exploring ALS.
        </p>
        <div className="button-row">
          <LinkButton href="/" className="button button-primary">
            Go Home
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
