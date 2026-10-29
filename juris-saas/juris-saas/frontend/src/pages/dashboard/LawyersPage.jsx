import { useEffect, useState } from 'react'
import { lawyerService } from '../../services/lawyerService'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import './DashboardPages.css'

const EMPTY_FORM = { name: '', oab: '', specialization: '', bio: '' }

function LawyersPage() {
  const [lawyers, setLawyers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')

  function loadLawyers() {
    return lawyerService.list().then(setLawyers)
  }

  useEffect(() => {
    loadLawyers()
      .catch(() => setLoadError('Não foi possível carregar os advogados.'))
      .finally(() => setLoading(false))
  }, [])

  function openNewForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(true)
  }

  function openEditForm(lawyer) {
    setForm({
      name: lawyer.name,
      oab: lawyer.oab || '',
      specialization: lawyer.specialization || '',
      bio: lawyer.bio || '',
    })
    setEditingId(lawyer.id)
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
        await lawyerService.update(editingId, form)
      } else {
        await lawyerService.create(form)
      }
      await loadLawyers()
      setShowForm(false)
    } catch {
      setError('Não foi possível salvar o advogado.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    await lawyerService.remove(pendingDelete.id)
    setPendingDelete(null)
    loadLawyers()
  }

  if (loading) return <div className="spinner" />
  if (loadError) return <div className="alert alert-error">{loadError}</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Advogados</h1>
          <p>Adicione a equipe que aparecerá no site.</p>
        </div>
        <button className="btn btn-primary" onClick={openNewForm}>
          Adicionar advogado
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form className="card" style={{ marginBottom: '1.5rem' }} onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="lw-name">Nome</label>
              <input id="lw-name" required value={form.name} onChange={update('name')} />
            </div>
            <div className="field">
              <label htmlFor="lw-oab">OAB</label>
              <input id="lw-oab" value={form.oab} onChange={update('oab')} placeholder="OAB/PR 12345" />
            </div>
            <div className="field">
              <label htmlFor="lw-spec">Especialidade</label>
              <input id="lw-spec" value={form.specialization} onChange={update('specialization')} />
            </div>
            <div className="field field-full">
              <label htmlFor="lw-bio">Descrição</label>
              <textarea id="lw-bio" rows={3} value={form.bio} onChange={update('bio')} />
            </div>
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

      {lawyers.length === 0 && !showForm ? (
        <div className="empty-state">
          <p>Nenhum advogado cadastrado ainda.</p>
          <button className="btn btn-primary" onClick={openNewForm}>
            Adicionar o primeiro advogado
          </button>
        </div>
      ) : (
        <div className="list">
          {lawyers.map((lawyer) => (
            <div className="list-item" key={lawyer.id}>
              <div className="list-item-main">
                <strong>{lawyer.name}</strong>
                <span>
                  {[lawyer.oab, lawyer.specialization].filter(Boolean).join(' · ') || 'Sem detalhes adicionais'}
                </span>
              </div>
              <div className="list-item-actions">
                <button className="btn btn-secondary" onClick={() => openEditForm(lawyer)}>
                  Editar
                </button>
                <button className="btn btn-danger" onClick={() => setPendingDelete(lawyer)}>
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Remover advogado"
          message={`Tem certeza que deseja remover ${pendingDelete.name}? Essa ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}

export default LawyersPage
