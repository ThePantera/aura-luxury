"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) setError("Email o contraseña incorrectos.");
    else router.push("/mi-cuenta");
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-16">
      <h1 className="font-display text-2xl text-luxury-warm text-center mb-2">Ingresá a tu cuenta</h1>
      <p className="text-xs text-luxury-muted text-center mb-6">Recordá tu 20% OFF de primera compra.</p>

      <button
        onClick={() => signIn("google", { callbackUrl: "/mi-cuenta" })}
        className="w-full bg-white text-gray-900 font-semibold py-2.5 rounded-full hover:bg-gray-100 transition flex items-center justify-center gap-3 mb-4 text-sm"
      >
        Continuar con Google
      </button>

      <div className="relative flex py-2 items-center mb-4 text-xs text-luxury-muted">
        <div className="flex-grow border-t border-white/10" />
        <span className="mx-4">o con email</span>
        <div className="flex-grow border-t border-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-xl p-2.5 text-sm bg-luxury-surface border border-white/10 text-luxury-warm placeholder:text-luxury-muted focus:outline-none focus:border-luxury-gold"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          placeholder="Contraseña"
          className="w-full rounded-xl p-2.5 text-sm bg-luxury-surface border border-white/10 text-luxury-warm placeholder:text-luxury-muted focus:outline-none focus:border-luxury-gold"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full font-semibold text-sm text-black bg-gradient-to-br from-[var(--color-gold)] to-[#9c7a44] disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      <p className="text-xs text-luxury-muted text-center mt-4">
        <a href="/recuperar-password" className="hover:text-luxury-gold-light">¿Olvidaste tu contraseña?</a>
      </p>
      <p className="text-xs text-luxury-muted text-center mt-2">
        ¿No tenés cuenta? <a href="/registro" className="text-luxury-gold-light">Registrate</a>
      </p>
    </div>
  );
}

export function RegisterForm() {
  const [values, setValues] = useState({ name: "", username: "", email: "", password: "", confirm: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (values.password !== values.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/register", { method: "POST", body: JSON.stringify(values) });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "No pudimos crear tu cuenta.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "No pudimos crear tu cuenta.");
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-sm mx-auto px-5 py-16 text-center">
        <h1 className="font-display text-2xl text-luxury-warm mb-3">¡Ya casi!</h1>
        <p className="text-sm text-luxury-muted">
          Te enviamos un email para verificar tu cuenta. Una vez verificada, tu 20% OFF de primera compra
          queda disponible automáticamente.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-16">
      <h1 className="font-display text-2xl text-luxury-warm text-center mb-2">Creá tu cuenta</h1>
      <p className="text-xs text-luxury-muted text-center mb-6">✨ 20% OFF en tu primera compra, sin cupón.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        {(["name", "username", "email"] as const).map((field) => (
          <input
            key={field}
            required
            type={field === "email" ? "email" : "text"}
            placeholder={{ name: "Nombre completo", username: "Nombre de usuario", email: "Email" }[field]}
            value={values[field]}
            onChange={(e) => setValues((v) => ({ ...v, [field]: e.target.value }))}
            className="w-full rounded-xl p-2.5 text-sm bg-luxury-surface border border-white/10 text-luxury-warm placeholder:text-luxury-muted focus:outline-none focus:border-luxury-gold"
          />
        ))}
        <input
          required
          type="password"
          placeholder="Contraseña"
          value={values.password}
          onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          className="w-full rounded-xl p-2.5 text-sm bg-luxury-surface border border-white/10 text-luxury-warm placeholder:text-luxury-muted focus:outline-none focus:border-luxury-gold"
        />
        <input
          required
          type="password"
          placeholder="Confirmar contraseña"
          value={values.confirm}
          onChange={(e) => setValues((v) => ({ ...v, confirm: e.target.value }))}
          className="w-full rounded-xl p-2.5 text-sm bg-luxury-surface border border-white/10 text-luxury-warm placeholder:text-luxury-muted focus:outline-none focus:border-luxury-gold"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-3 rounded-full font-semibold text-sm text-black bg-gradient-to-br from-[var(--color-gold)] to-[#9c7a44] disabled:opacity-50"
        >
          {status === "loading" ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
}
