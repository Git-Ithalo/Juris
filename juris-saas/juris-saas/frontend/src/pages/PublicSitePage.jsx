import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { websiteService } from '../services/websiteService'
import PublicSiteTemplate from '../components/PublicSiteTemplate.jsx'

function PublicSitePage() {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    websiteService
      .getPublic(slug)
      .then((res) => {
        setData(res)
        // SEO básico: título e descrição da aba do navegador (item 14)
        if (res.website.seo_title) document.title = res.website.seo_title
        else document.title = res.company.name
        const metaDesc = document.querySelector('meta[name="description"]')
        if (metaDesc && res.website.seo_description) {
          metaDesc.setAttribute('content', res.website.seo_description)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <h1>Site não encontrado</h1>
        <p>Este site não existe ou ainda não foi publicado.</p>
      </div>
    )
  }

  return (
    <PublicSiteTemplate
      company={data.company}
      website={data.website}
      lawyers={data.lawyers}
      practiceAreas={data.practice_areas}
      socialLinks={data.social_links}
    />
  )
}

export default PublicSitePage
