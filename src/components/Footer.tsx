export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <strong className="text-heading-2">Kinde & Convex</strong>
        <p className="footer-tagline text-body-3">
          Visit our{" "}
          <a className="link" href="https://docs.kinde.com">
            docs page
          </a>
        </p>

        <small className="text-subtle">
          © {new Date().getFullYear()} Kinde, Inc. All rights reserved
        </small>
      </div>
    </footer>
  )
}
