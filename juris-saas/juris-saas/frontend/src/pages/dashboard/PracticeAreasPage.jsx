import { useEffect, useState } from 'react'
import { practiceAreaService } from '../../services/practiceAreaService'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import './DashboardPages.css'

const EMPTY_FORM = { name: '', description: '' }

function PracticeAreasPage() {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')

  function loadAreas() {
    return practiceAreaService.list().then(setAreas)
  }

  useEffect(() => {
    loadAreas()
      .catch(() => setLoadError('Não foi possível carregar as áreas de atuação.'))
      .finally(() => setLoading(false))
  }, [])

  function openNewForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(true)
  }

  function openEditForm(area) {
    setForm({ name: area.name, description: area.description || '' })
    setEditingId(area.id)
    setShowForm(true)
  }

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) {
        await practiceAreaService.update(editingId, form)
      } else {
        await practiceAreaService.create(form)
      }
      await loadAreas()
      setShowForm(false)
    } catch {
      setError('Não foi possível salvar a área de atuação.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    await practiceAreaService.remove(pendingDelete.id)
    setPendingDelete(null)
    loadAreas()
  }

  if (loading) return <div className="spinner" />
  if (loadError) return <div className="alert alert-error">{loadError}</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Áreas de atuação</h1>
          <p>Defina as especialidades jurídicas do escritório.</p>
        </div>
        <button className="btn btn-primary" onClick={openNewForm}>
          Adicionar área
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form className="card" style={{ marginBottom: '1.5rem' }} onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="pa-name">Nome da área</label>
            <input
              id="pa-name"
              required
              value={form.name}
              onChange={update('name')}
              placeholder="Ex: Direito Trabalhista"
            />
          </div>
          <div className="field">
            <label htmlFor="pa-desc">Descrição</label>
            <textarea id="pa-desc" rows={3} value={form.description} onChange={update('description')} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {areas.length === 0 && !showForm ? (
        <div className="empty-state">
          <p>Nenhuma área de atuação cadastrada ainda.</p>
          <button className="btn btn-primary" onClick={openNewForm}>
            Adicionar a primeira área
          </button>
        </div>
      ) : (
        <div className="list">
          {areas.map((area) => (
            <div className="list-item" key={area.id}>
              <div className="list-item-main">
                <strong>{area.name}</strong>
                {area.description && <span>{area.description}</span>}
              </div>
              <div className="list-item-actions">
                <button className="btn btn-secondary" onClick={() => openEditForm(area)}>
                  Editar
                </button>
                <button className="btn btn-danger" onClick={() => setPendingDelete(area)}>
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Remover área de atuação"
          message={`Tem certeza que deseja remover "${pendingDelete.name}"? Essa ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}

export default PracticeAreasPage
