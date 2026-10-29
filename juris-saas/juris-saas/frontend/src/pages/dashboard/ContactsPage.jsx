import { useEffect, useState } from 'react'
import { socialLinkService } from '../../services/socialLinkService'
import { websiteService } from '../../services/websiteService'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import './DashboardPages.css'

const PLATFORMS = ['instagram', 'facebook', 'linkedin', 'youtube', 'tiktok']

function ContactsPage() {
  const [links, setLinks] = useState([])
  const [website, setWebsite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newLink, setNewLink] = useState({ platform: 'instagram', url: '' })
  const [pendingDelete, setPendingDelete] = useState(null)
  const [message, setMessage] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    Promise.all([socialLinkService.list(), websiteService.getMine()])
      .then(([linksData, websiteData]) => {
        setLinks(linksData)
        setWebsite(websiteData)
      })
      .catch(() => setLoadError('Não foi possível carregar os dados de contato.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleAddLink(e) {
    e.preventDefault()
    if (!newLink.url) return
    const created = await socialLinkService.create(newLink)
    setLinks((prev) => [...prev, created])
    setNewLink({ platform: 'instagram', url: '' })
  }

  async function handleDeleteLink() {
    await socialLinkService.remove(pendingDelete.id)
    setLinks((prev) => prev.filter((l) => l.id !== pendingDelete.id))
    setPendingDelete(null)
  }

  async function handleSaveWebsiteFields(e) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const updated = await websiteService.update({
        whatsapp_message: website.whatsapp_message,
        business_hours: website.business_hours,
      })
      setWebsite(updated)
      setMessage({ type: 'success', text: 'Configurações de contato salvas.' })
    } catch {
      setMessage({ type: 'error', text: 'Não foi possível salvar.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !website) {
    return loadError ? <div className="alert alert-error">{loadError}</div> : <div className="spinner" />
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Contatos</h1>
          <p>Configure o WhatsApp, horário de atendimento e redes sociais.</p>
        </div>
      </div>

      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <form className="card" style={{ marginBottom: '1.5rem' }} onSubmit={handleSaveWebsiteFields}>
        <h3>WhatsApp e horário</h3>
        <div className="field">
          <label htmlFor="wpp-msg">Mensagem pré-configurada do WhatsApp</label>
          <input
            id="wpp-msg"
            value={website.whatsapp_message}
            onChange={(e) => setWebsite((prev) => ({ ...prev, whatsapp_message: e.target.value }))}
          />
          <p className="field-hint">
            O número usado é o WhatsApp cadastrado em "Informações do escritório".
          </p>
        </div>
        <div className="field">
          <label htmlFor="hours">Horário de atendimento</label>
          <input
            id="hours"
            value={website.business_hours || ''}
            onChange={(e) => setWebsite((prev) => ({ ...prev, business_hours: e.target.value }))}
            placeholder="Seg. a Sex., 9h às 18h"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </form>

      <div className="card">
        <h3>Redes sociais</h3>
        <form onSubmit={handleAddLink} className="social-link-form">
          <select
            value={newLink.platform}
            onChange={(e) => setNewLink((prev) => ({ ...prev, platform: e.target.value }))}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            placeholder="https://..."
            value={newLink.url}
            onChange={(e) => setNewLink((prev) => ({ ...prev, url: e.target.value }))}
          />
          <button type="submit" className="btn btn-primary">
            Adicionar
          </button>
        </form>

        {links.length === 0 ? (
          <p className="field-hint">Nenhuma rede social adicionada ainda.</p>
        ) : (
          <div className="list">
            {links.map((link) => (
              <div className="list-item" key={link.id}>
                <div className="list-item-main">
                  <strong style={{ textTransform: 'capitalize' }}>{link.platform}</strong>
                  <span>{link.url}</span>
                </div>
                <div className="list-item-actions">
                  <button className="btn btn-danger" onClick={() => setPendingDelete(link)}>
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {pendingDelete && (
        <ConfirmDialog
          title="Remover rede social"
          message="Tem certeza que deseja remover este link?"
          onConfirm={handleDeleteLink}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}

export default ContactsPage
