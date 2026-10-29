import { useEffect, useState } from 'react'
import { websiteService } from '../../services/websiteService'
import './DashboardPages.css'

function DomainPage() {
  const [website, setWebsite] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    websiteService
      .getMine()
      .then(setWebsite)
      .catch(() => setError('Não foi possível carregar o endereço do site.'))
  }, [])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Domínio</h1>
          <p>Endereço do seu site na plataforma.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3>Endereço atual</h3>
        {error && <div className="alert alert-error">{error}</div>}
        {website ? (
          <p>
            <code>{`${window.location.origin}/site/${website.slug}`}</code>
          </p>
        ) : !error ? (
          <div className="spinner" />
        ) : null}
      </div>

      <div className="card">
        <h3>Domínio próprio</h3>
        <p style={{ color: 'var(--color-muted)' }}>
          Em breve você poderá conectar um domínio próprio, como
          <code> www.seuescritorio.com.br</code>, diretamente ao seu site.
          Essa funcionalidade está em desenvolvimento.
        </p>
        <button className="btn btn-secondary" disabled>
          Conectar domínio (em breve)
        </button>
      </div>
    </div>
  )
}

export default DomainPage
