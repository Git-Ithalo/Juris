import './PublicSiteTemplate.css'

const PLATFORM_LABELS = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  tiktok: 'TikTok',
}

function buildWhatsappLink(whatsapp, message) {
  if (!whatsapp) return null
  const digits = whatsapp.replace(/\D/g, '')
  const text = encodeURIComponent(message || '')
  return `https://wa.me/55${digits}?text=${text}`
}

/**
 * Renderiza o site público de um escritório.
 * Usado em dois lugares:
 *  1. Preview ao vivo no editor de personalização (dashboard)
 *  2. Página pública real em /site/:slug
 * Manter um único componente garante que o preview NUNCA diverge do site publicado.
 */
function PublicSiteTemplate({ company, website, lawyers = [], practiceAreas = [], socialLinks = [] }) {
  const whatsappLink = buildWhatsappLink(company?.whatsapp, website?.whatsapp_message)

  const style = {
    '--site-primary': website.primary_color,
    '--site-secondary': website.secondary_color,
    '--site-font': website.font === 'Source Serif 4' ? "'Source Serif 4', serif" : `'${website.font}', sans-serif`,
    '--site-radius': website.button_style === 'rounded' ? '999px' : website.button_style === 'outline' ? '6px' : '4px',
  }

  return (
    <div className="site-root" style={style}>
      <header className="site-header">
        <div className="site-header-inner">
          <span className="site-logo">{company?.name || 'Seu Escritório'}</span>
          <nav className="site-nav">
            {website.show_about && <a href="#sobre">Sobre</a>}
            {website.show_practice_areas && <a href="#areas">Áreas de atuação</a>}
            {website.show_team && <a href="#equipe">Equipe</a>}
            {website.show_contact && <a href="#contato">Contato</a>}
          </nav>
          {website.show_contact && (
            <a href="#contato" className="btn-site btn-site-primary">
              Fale conosco
            </a>
          )}
        </div>
      </header>

      {website.show_hero && (
        <section className="site-hero">
          <h1>{website.hero_title || 'Advocacia estratégica para proteger seus direitos.'}</h1>
          {website.hero_subtitle && <p>{website.hero_subtitle}</p>}
          {website.slogan && <p className="site-slogan">{website.slogan}</p>}
          {website.show_contact && (
            <a href="#contato" className="btn-site btn-site-primary">
              Fale com um advogado
            </a>
          )}
        </section>
      )}

      {website.show_about && (
        <section id="sobre" className="site-section">
          <h2>Sobre o escritório</h2>
          <p>{company?.description || 'Conte aqui a história e os valores do escritório.'}</p>
        </section>
      )}

      {website.show_practice_areas && practiceAreas.length > 0 && (
        <section id="areas" className="site-section site-section-alt">
          <h2>Áreas de atuação</h2>
          <div className="site-grid">
            {practiceAreas.map((area) => (
              <div className="site-card" key={area.id}>
                <h3>{area.name}</h3>
                {area.description && <p>{area.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {website.show_team && lawyers.length > 0 && (
        <section id="equipe" className="site-section">
          <h2>Equipe</h2>
          <div className="site-grid">
            {lawyers.map((lawyer) => (
              <div className="site-card site-lawyer-card" key={lawyer.id}>
                <h3>{lawyer.name}</h3>
                {lawyer.oab && <span className="site-lawyer-oab">{lawyer.oab}</span>}
                {lawyer.specialization && <p className="site-lawyer-spec">{lawyer.specialization}</p>}
                {lawyer.bio && <p>{lawyer.bio}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {website.show_differentials && website.differentials && (
        <section className="site-section site-section-alt">
          <h2>Diferenciais</h2>
          <div className="site-grid">
            {website.differentials
              .split('\n')
              .filter(Boolean)
              .map((item, idx) => (
                <div className="site-card" key={idx}>
                  <p>{item}</p>
                </div>
              ))}
          </div>
        </section>
      )}

      {website.show_contact && (
        <section id="contato" className="site-section">
          <h2>Contato</h2>
          <div className="site-contact-grid">
            {company?.phone && <p>Telefone: {company.phone}</p>}
            {company?.email && <p>E-mail: {company.email}</p>}
            {company?.address && <p>Endereço: {company.address}</p>}
            {website.business_hours && <p>Horário: {website.business_hours}</p>}
          </div>
          {whatsappLink && (
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn-site btn-site-whatsapp">
              Conversar no WhatsApp
            </a>
          )}
        </section>
      )}

      <footer className="site-footer">
        <p>{company?.name}</p>
        <div className="site-social-links">
          {socialLinks.map((link) => (
            <a href={link.url} target="_blank" rel="noreferrer" key={link.id}>
              {PLATFORM_LABELS[link.platform] || link.platform}
            </a>
          ))}
        </div>
        <p className="site-footer-legal">© {new Date().getFullYear()} {company?.name}. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}

export default PublicSiteTemplate
