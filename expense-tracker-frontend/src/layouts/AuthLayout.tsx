import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen auth-shell text-white">
      <div className="absolute inset-0 auth-glow"></div>
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-12 lg:mb-0 lg:max-w-md animate-slide-in-left">
          <p className="uppercase tracking-[0.35em] text-xs text-white/60">
            Finely tuned
          </p>
          <h1 className="mt-4 text-5xl font-bold leading-tight md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300">
            Track every expense with clarity.
          </h1>
          <p className="mt-6 text-white/70 text-lg leading-relaxed">
            Keep your budget on course, categorize your spending, and
            see how every decision moves your balance. Gain complete financial visibility.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em]">
            <span className="chip">Real-time summary</span>
            <span className="chip">Smart categories</span>
            <span className="chip">Secure login</span>
          </div>
        </div>
        <div className="w-full max-w-md animate-slide-in-right">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
