import './DashboardPages.css'

const PLANS = [
  { name: 'Básico', price: 'R$ 49/mês', features: ['1 site', 'Template padrão', 'Suporte por e-mail'] },
  { name: 'Profissional', price: 'R$ 99/mês', features: ['1 site', 'Todos os templates', 'Domínio próprio', 'Suporte prioritário'] },
  { name: 'Premium', price: 'R$ 199/mês', features: ['Múltiplos sites', 'Analytics avançado', 'Suporte dedicado'] },
]

function SubscriptionPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Assinatura</h1>
          <p>Seu plano atual é o Básico. Pagamentos ainda não estão habilitados nesta versão.</p>
        </div>
      </div>

      <div className="overview-grid">
        {PLANS.map((plan) => (
          <div className="card" key={plan.name}>
            <h3>{plan.name}</h3>
            <p className="overview-stat-value">{plan.price}</p>
            <ul style={{ paddingLeft: '1.1rem', color: 'var(--color-muted)' }}>
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button className="btn btn-secondary" disabled>
              {plan.name === 'Básico' ? 'Plano atual' : 'Em breve'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubscriptionPage
