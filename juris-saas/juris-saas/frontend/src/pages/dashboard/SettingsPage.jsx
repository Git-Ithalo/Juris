import { useAuth } from '../../hooks/useAuth.jsx'
import './DashboardPages.css'

function SettingsPage() {
  const { user } = useAuth()

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Configurações</h1>
          <p>Dados da sua conta de acesso.</p>
        </div>
      </div>

      <div className="card">
        <div className="field">
          <label>Nome</label>
          <input value={user?.name || ''} disabled />
        </div>
        <div className="field">
          <label>E-mail</label>
          <input value={user?.email || ''} disabled />
        </div>
        <p className="field-hint">Edição de conta e troca de senha estarão disponíveis em breve.</p>
      </div>
    </div>
  )
}

export default SettingsPage
