import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success"|"error", text }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setEmail("");
        setPassword("");
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-2">Create Account</h2>
          <p className="text-base-content/60 mb-4">Sign up to start taking notes</p>

          {message && (
            <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"} mb-4`}>
              <span>{message.text}</span>
            </div>
          )}

          {/* Show this after successful registration */}
          {message?.type === "success" ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📬</div>
              <p className="font-medium">Check your inbox!</p>
              <p className="text-base-content/60 text-sm mt-1">
                We sent a verification link to <strong>{email || "your email"}</strong>.
                Click it to activate your account.
              </p>
              <Link to="/login" className="btn btn-primary mt-6 w-full">
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  className="input input-bordered w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full mt-2"
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner" /> : "Create Account"}
              </button>
            </form>
          )}

          {message?.type !== "success" && (
            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Log in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}