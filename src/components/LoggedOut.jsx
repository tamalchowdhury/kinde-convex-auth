import { useKindeAuth } from "@kinde-oss/kinde-auth-react"
import Footer from "./Footer"

export default function LoggedOut() {
  const { login, register } = useKindeAuth()
  return (
    <>
      <header>
        <nav className="nav container">
          <h1 className="text-display-3">Kinde & Convex</h1>
          <div>
            <button className="btn btn-ghost sign-in-btn" onClick={login}>
              Sign in
            </button>
            <button className="btn btn-dark" onClick={register}>
              Sign up
            </button>
          </div>
        </nav>
      </header>

      <main>
        <div className="container">
          <div className="card hero">
            <p className="text-display-1 hero-title">
              Let&apos;s start authenticating <br /> with KindeAuth & Convex
            </p>
            <p className="text-body-1 hero-tagline">Configure your app</p>

            <a
              href="https://kinde.com/docs/developer-tools/react-sdk"
              target="_blank"
              rel="noreferrer"
              className="btn btn-light btn-big"
            >
              Go to docs
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
