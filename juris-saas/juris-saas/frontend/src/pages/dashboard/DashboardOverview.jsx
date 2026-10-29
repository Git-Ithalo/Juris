import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { websiteService } from '../../services/websiteService'
import './DashboardPages.css'

function DashboardOverview() {
  const [website, setWebsite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    websiteService
      .getMine()
      .then(setWebsite)
      .catch(() => setError('Não foi possível carregar o status do site.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner" />

  const publicUrl = website ? `${import.meta.env.VITE_PLATFORM_URL || window.location.origin}/site/${website.slug}` : ''

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Visão geral</h1>
          <p>Acompanhe o status do site do seu escritório.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {website && (
        <>
          <div className="overview-grid">
            <div className="card">
              <div className="overview-stat-label">Status do site</div>
              <span className={`badge ${website.published ? 'badge-published' : 'badge-draft'}`}>
                {website.published ? 'Publicado' : 'Rascunho'}
              </span>
            </div>
            <div className="card">
              <div className="overview-stat-label">Plano atual</div>
              <div className="overview-stat-value">Básico</div>
            </div>
            <div className="card">
              <div className="overview-stat-label">Template</div>
              <div className="overview-stat-value">Advocacia Clássico</div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3>Atalhos</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/dashboard/personalizacao" className="btn btn-primary">
                Personalizar site
              </Link>
              <Link to="/dashboard/escritorio" className="btn btn-secondary">
                Editar informações
              </Link>
              {website.published && (
                <a href={publicUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
                  Ver site publicado
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardOverview
