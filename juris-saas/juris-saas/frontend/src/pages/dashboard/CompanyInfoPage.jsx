import { useEffect, useState } from 'react'
import { companyService } from '../../services/companyService'
import './DashboardPages.css'

function CompanyInfoPage() {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    companyService
      .getMine()
      .then(setForm)
      .catch(() => setLoadError('Não foi possível carregar as informações do escritório.'))
      .finally(() => setLoading(false))
  }, [])

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const updated = await companyService.update({
        name: form.name,
        description: form.description,
        phone: form.phone,
        whatsapp: form.whatsapp,
        email: form.email,
        address: form.address,
      })
      setForm(updated)
      setMessage({ type: 'success', text: 'Informações salvas.' })
    } catch {
      setMessage({ type: 'error', text: 'Não foi possível salvar. Tente novamente.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="spinner" />
  if (loadError) return <div className="alert alert-error">{loadError}</div>
  if (!form) return null

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Informações do escritório</h1>
          <p>Esses dados aparecem no seu site público.</p>
        </div>
      </div>

      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field field-full">
            <label htmlFor="name">Nome do escritório</label>
            <input id="name" required value={form.name || ''} onChange={update('name')} />
          </div>
          <div className="field field-full">
            <label htmlFor="description">Descrição / Sobre o escritório</label>
            <textarea
              id="description"
              rows={5}
              value={form.description || ''}
              onChange={update('description')}
              placeholder="Conte a história e os valores do escritório."
            />
          </div>
          <div className="field">
            <label htmlFor="phone">Telefone</label>
            <input id="phone" value={form.phone || ''} onChange={update('phone')} placeholder="(41) 3000-0000" />
          </div>
          <div className="field">
            <label htmlFor="whatsapp">WhatsApp</label>
            <input
              id="whatsapp"
              value={form.whatsapp || ''}
              onChange={update('whatsapp')}
              placeholder="(41) 99999-9999"
            />
          </div>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" value={form.email || ''} onChange={update('email')} />
          </div>
          <div className="field">
            <label htmlFor="address">Endereço</label>
            <input id="address" value={form.address || ''} onChange={update('address')} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </form>
    </div>
  )
}

export default CompanyInfoPage
