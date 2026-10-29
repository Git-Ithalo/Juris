import { useEffect, useState } from 'react'
import { websiteService } from '../../services/websiteService'
import { companyService } from '../../services/companyService'
import { lawyerService } from '../../services/lawyerService'
import { practiceAreaService } from '../../services/practiceAreaService'
import { socialLinkService } from '../../services/socialLinkService'
import PublicSiteTemplate from '../../components/PublicSiteTemplate.jsx'
import './CustomizationPage.css'

const TABS = ['Conteúdo', 'Aparência', 'Seções']

const SECTION_TOGGLES = [
  { key: 'show_hero', label: 'Hero' },
  { key: 'show_about', label: 'Sobre' },
  { key: 'show_practice_areas', label: 'Áreas de atuação' },
  { key: 'show_team', label: 'Equipe' },
  { key: 'show_differentials', label: 'Diferenciais' },
  { key: 'show_testimonials', label: 'Depoimentos' },
  { key: 'show_contact', label: 'Contato' },
]

const FONT_OPTIONS = ['Inter', 'Source Serif 4']
const BUTTON_STYLES = [
  { value: 'solid', label: 'Sólido' },
  { value: 'outline', label: 'Contornado' },
  { value: 'rounded', label: 'Arredondado' },
]

function CustomizationPage() {
  const [website, setWebsite] = useState(null)
  const [company, setCompany] = useState(null)
  const [lawyers, setLawyers] = useState([])
  const [practiceAreas, setPracticeAreas] = useState([])
  const [socialLinks, setSocialLinks] = useState([])
  const [tab, setTab] = useState('Conteúdo')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState(null)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    Promise.all([
      websiteService.getMine(),
      companyService.getMine(),
      lawyerService.list(),
      practiceAreaService.list(),
      socialLinkService.list(),
    ])
      .then(([w, c, l, pa, sl]) => {
        setWebsite(w)
        setCompany(c)
        setLawyers(l)
        setPracticeAreas(pa)
        setSocialLinks(sl)
      })
      .catch(() => setLoadError('Não foi possível carregar o editor. Tente recarregar a página.'))
      .finally(() => setLoading(false))
  }, [])

  function updateField(field) {
    return (e) => setWebsite((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function toggleField(field) {
    return () => setWebsite((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const updated = await websiteService.update(website)
      setWebsite(updated)
      setMessage({ type: 'success', text: 'Alterações salvas.' })
    } catch {
      setMessage({ type: 'error', text: 'Não foi possível salvar as alterações.' })
    } finally {
      setSaving(false)
    }
  }

  async function handlePublishToggle() {
    setPublishing(true)
    try {
      const updated = website.published ? await websiteService.unpublish() : await websiteService.publish()
      setWebsite(updated)
      setMessage({
        type: 'success',
        text: updated.published ? 'Site publicado com sucesso!' : 'Site despublicado.',
      })
    } finally {
      setPublishing(false)
    }
  }

  if (loading) return <div className="spinner" />
  if (loadError) return <div className="alert alert-error">{loadError}</div>
  if (!website) return null

  return (
    <div className="customize-page">
      <div className="page-header">
        <div>
          <h1>Personalização</h1>
          <p>Edite o conteúdo e veja a pré-visualização ao lado.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar rascunho'}
          </button>
          <button className="btn btn-primary" onClick={handlePublishToggle} disabled={publishing}>
            {publishing ? 'Aguarde...' : website.published ? 'Despublicar' : 'Publicar site'}
          </button>
        </div>
      </div>

      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <div className="customize-layout">
        <div className="customize-editor card">
          <div className="customize-tabs">
            {TABS.map((t) => (
              <button
                key={t}
                className={`customize-tab ${tab === t ? 'is-active' : ''}`}
                onClick={() => setTab(t)}
                type="button"
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'Conteúdo' && (
            <div>
              <div className="field">
                <label htmlFor="slogan">Slogan</label>
                <input id="slogan" value={website.slogan || ''} onChange={updateField('slogan')} />
              </div>
              <div className="field">
                <label htmlFor="hero_title">Título de destaque (hero)</label>
                <input id="hero_title" value={website.hero_title || ''} onChange={updateField('hero_title')} />
              </div>
              <div className="field">
                <label htmlFor="hero_subtitle">Subtítulo do hero</label>
                <textarea
                  id="hero_subtitle"
                  rows={2}
                  value={website.hero_subtitle || ''}
                  onChange={updateField('hero_subtitle')}
                />
              </div>
              <div className="field">
                <label htmlFor="differentials">Diferenciais (um por linha)</label>
                <textarea
                  id="differentials"
                  rows={4}
                  value={website.differentials || ''}
                  onChange={updateField('differentials')}
                  placeholder={'Atendimento personalizado\nMais de 20 anos de experiência\nEquipe multidisciplinar'}
                />
              </div>
              <div className="field">
                <label htmlFor="seo_title">Título do site (SEO)</label>
                <input id="seo_title" value={website.seo_title || ''} onChange={updateField('seo_title')} />
              </div>
              <div className="field">
                <label htmlFor="seo_description">Descrição do site (SEO)</label>
                <textarea
                  id="seo_description"
                  rows={2}
                  value={website.seo_description || ''}
                  onChange={updateField('seo_description')}
                />
              </div>
            </div>
          )}

          {tab === 'Aparência' && (
            <div>
              <div className="field">
                <label>Cor principal</label>
                <div className="color-swatch-row">
                  <input
                    type="color"
                    value={website.primary_color}
                    onChange={updateField('primary_color')}
                  />
                  <span>{website.primary_color}</span>
                </div>
              </div>
              <div className="field">
                <label>Cor secundária</label>
                <div className="color-swatch-row">
                  <input
                    type="color"
                    value={website.secondary_color}
                    onChange={updateField('secondary_color')}
                  />
                  <span>{website.secondary_color}</span>
                </div>
              </div>
              <div className="field">
                <label htmlFor="font">Fonte</label>
                <select id="font" value={website.font} onChange={updateField('font')}>
                  {FONT_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="button_style">Estilo dos botões</label>
                <select id="button_style" value={website.button_style} onChange={updateField('button_style')}>
                  {BUTTON_STYLES.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {tab === 'Seções' && (
            <div>
              {SECTION_TOGGLES.map((section) => (
                <div className="toggle-row" key={section.key}>
                  <span>{section.label}</span>
                  <input
                    type="checkbox"
                    checked={website[section.key]}
                    onChange={toggleField(section.key)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="customize-preview">
          <div className="customize-preview-frame">
            <PublicSiteTemplate
              company={company}
              website={website}
              lawyers={lawyers}
              practiceAreas={practiceAreas}
              socialLinks={socialLinks}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomizationPage
