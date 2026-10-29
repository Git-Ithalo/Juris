import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import './DashboardLayout.css'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Visão geral', end: true },
  { to: '/dashboard/personalizacao', label: 'Personalização' },
  { to: '/dashboard/escritorio', label: 'Informações do escritório' },
  { to: '/dashboard/advogados', label: 'Advogados' },
  { to: '/dashboard/areas-de-atuacao', label: 'Áreas de atuação' },
  { to: '/dashboard/contatos', label: 'Contatos' },
  { to: '/dashboard/dominio', label: 'Domínio' },
  { to: '/dashboard/assinatura', label: 'Assinatura' },
  { to: '/dashboard/configuracoes', label: 'Configurações' },
]

function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="dash-shell">
      <header className="dash-topbar">
        <button
          className="dash-menu-toggle"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          ☰
        </button>
        <span className="dash-wordmark">Juris SaaS</span>
      </header>

      <aside className={`dash-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="dash-sidebar-header">
          <span className="dash-wordmark">Juris SaaS</span>
          {user && <p className="dash-sidebar-user">{user.name}</p>}
        </div>
        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `dash-nav-link ${isActive ? 'is-active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="dash-logout" onClick={handleLogout}>
          Sair
        </button>
      </aside>

      {menuOpen && <div className="dash-overlay" onClick={() => setMenuOpen(false)} />}

      <main className="dash-content">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
