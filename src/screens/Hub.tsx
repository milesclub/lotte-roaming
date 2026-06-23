import { Link } from 'react-router-dom'
import { Smartphone, Plane, ChevronRight, Sparkles } from 'lucide-react'
import Container from '../components/site/Container'
import { useUI } from '../content'

// Home hub — the two product pillars: everyday MVNO plans and travel roaming.
export default function Hub() {
  const UI = useUI()
  return (
    <Container size="wide" className="page-pad">
      <section className="hub-intro">
        <span className="hub-intro__eyebrow">
          <Sparkles size={14} /> {UI.brand.affiliate}
        </span>
        <h1 className="hub-intro__title">{UI.hub.title}</h1>
        <p className="hub-intro__sub">{UI.hub.subtitle}</p>
      </section>

      <div className="hub-grid">
        <Link to="/plans" className="hub-card hub-card--mvno">
          <span className="hub-card__icon">
            <Smartphone size={26} strokeWidth={2.1} />
          </span>
          <div className="hub-card__body">
            <span className="hub-card__eyebrow">{UI.hub.mvno.eyebrow}</span>
            <h2 className="hub-card__title">{UI.hub.mvno.title}</h2>
            <p className="hub-card__desc">{UI.hub.mvno.desc}</p>
          </div>
          <span className="hub-card__cta">
            {UI.hub.mvno.cta}
            <ChevronRight size={18} />
          </span>
        </Link>

        <Link to="/roaming" className="hub-card hub-card--roaming">
          <span className="hub-card__icon">
            <Plane size={26} strokeWidth={2.1} />
          </span>
          <div className="hub-card__body">
            <span className="hub-card__eyebrow">{UI.hub.roaming.eyebrow}</span>
            <h2 className="hub-card__title">{UI.hub.roaming.title}</h2>
            <p className="hub-card__desc">{UI.hub.roaming.desc}</p>
          </div>
          <span className="hub-card__cta">
            {UI.hub.roaming.cta}
            <ChevronRight size={18} />
          </span>
        </Link>
      </div>

      <p className="hub-note">{UI.hub.note}</p>
    </Container>
  )
}
