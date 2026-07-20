import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { gojo } from '../data/gojo'
import { PortraitImage } from './PortraitImage'

export function HeroCard() {
  return (
    <section className="hero panel" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">{gojo.identity}</p>
        <h1 id="hero-title">{gojo.name}</h1>
        <blockquote>“{gojo.quote}”</blockquote>
        <Link className="button" to="/profile">
          进入个人档案
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
      <figure className="hero-visual">
        <PortraitImage
          className="hero-portrait"
          src="/images/gojo-placeholder.jpg"
          alt="五条悟人物主视觉"
        />
        <figcaption className="asset-note">
          网络图片 · 非官方同人展示
        </figcaption>
      </figure>
    </section>
  )
}
