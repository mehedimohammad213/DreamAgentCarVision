import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-padding">
      <div className="page-container text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The page you are looking for does not exist or is not published yet.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
