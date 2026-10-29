import { Link } from 'react-router-dom'
import './LandingPage.css'

const STEPS = [
  { title: 'Crie sua conta', text: 'Cadastre seu escritório em menos de dois minutos, sem cartão de crédito.' },
  { title: 'Personalize seu site', text: 'Escolha cores, adicione sua equipe e áreas de atuação pelo editor visual.' },
  { title: 'Publique', text: 'Coloque seu site no ar com um clique e comece a receber contatos.' },
]

const FEATURES = [
  { title: 'Site responsivo', text: 'Layout adaptado para celular, tablet e desktop.' },
  { title: 'Editor visual', text: 'Edite conteúdo e aparência sem escrever uma linha de código.' },
  { title: 'Botão de WhatsApp', text: 'Receba contatos diretamente pelo WhatsApp do escritório.' },
  { title: 'Domínio personalizado', text: 'Conecte o domínio do seu escritório (em breve).' },
  { title: 'Otimizado para SEO', text: 'Estrutura pensada para aparecer bem nas buscas.' },
  { title: 'Painel completo', text: 'Gerencie equipe, áreas de atuação e conteúdo em um só lugar.' },
]

const PLANS = [
  { name: 'Básico', price: 'R$ 49', features: ['1 site', 'Template padrão', 'Suporte por e-mail'] },
  { name: 'Profissional', price: 'R$ 99', features: ['Todos os templates', 'Domínio próprio', 'Suporte prioritário'] },
  { name: 'Premium', price: 'R$ 199', features: ['Múltiplos sites', 'Analytics avançado', 'Suporte dedicado'] },
]

function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-header">
        <div className="container landing-header-inner">
          <span className="landing-wordmark">Juris SaaS</span>
          <div className="landing-header-actions">
            <Link to="/login">Entrar</Link>
            <Link to="/registrar" className="btn btn-primary">
              Começar agora
            </Link>
          </div>
        </div>
      </header>

      <section className="landing-hero">
        <div className="container">
          <h1>Seu escritório merece um site profissional.</h1>
          <p>
            Crie, personalize e publique o site do seu escritório de advocacia sem
            precisar contratar um desenvolvedor.
          </p>
          <Link to="/registrar" className="btn btn-primary landing-hero-cta">
            Começar agora
          </Link>
        </div>
      </section>

      <section className="landing-section">
        <div className="container landing-problem-solution">
          <div>
            <h2>O problema</h2>
            <p>
              A maioria dos escritórios de advocacia ainda não tem presença digital
              profissional — ou depende de sites caros, lentos para atualizar e difíceis
              de manter.
            </p>
          </div>
          <div>
            <h2>Nossa solução</h2>
            <p>
              Uma plataforma feita para advogados: escolha um modelo, personalize com seus
              dados e publique um site profissional em poucos minutos, sem programar.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-alt">
        <div className="container">
          <h2>Como funciona</h2>
          <div className="landing-steps">
            {STEPS.map((step, idx) => (
              <div className="landing-step" key={step.title}>
                <span className="landing-step-number">{idx + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="container">
          <h2>Recursos</h2>
          <div className="landing-features">
            {FEATURES.map((f) => (
              <div className="card landing-feature-card" key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-alt">
        <div className="container">
          <h2>Planos</h2>
          <div className="landing-plans">
            {PLANS.map((plan) => (
              <div className="card landing-plan-card" key={plan.name}>
                <h3>{plan.name}</h3>
                <p className="landing-plan-price">{plan.price}<span>/mês</span></p>
                <ul>
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link to="/registrar" className="btn btn-secondary btn-block">
                  Escolher plano
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Juris SaaS. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
