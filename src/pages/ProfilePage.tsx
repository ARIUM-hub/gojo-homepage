import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { FanDisclaimer } from '../components/FanDisclaimer'
import { PortraitImage } from '../components/PortraitImage'
import { gojo } from '../data/gojo'

const featuredTechniqueIds = new Set(['six-eyes', 'limitless', 'void'])

export function ProfilePage() {
  const featuredTechniques = gojo.techniques.filter(({ id }) =>
    featuredTechniqueIds.has(id),
  )

  return (
    <>
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>

      <main className="page-shell profile-page" id="main-content">
        <header className="profile-header">
          <Link className="button button-secondary" to="/">
            <ArrowLeft aria-hidden="true" size={18} />
            返回主页
          </Link>
          <span className="brand">GOJO / PERSONAL FILE</span>
        </header>

        <h1>个人档案</h1>

        <section className="profile-layout" aria-labelledby="profile-name">
          <div className="profile-portrait panel">
            <PortraitImage
              src="/images/gojo-placeholder.jpg"
              alt="五条悟档案页人物图"
              className="profile-portrait-media"
            />
            <div className="profile-portrait-overlay">
              <p className="eyebrow">SPECIAL GRADE SORCERER</p>
              <h2 id="profile-name">{gojo.name}</h2>
            </div>
          </div>

          <div className="profile-bento">
            <article className="profile-card wide">
              <p className="eyebrow">PROFILE</p>
              <h2>{gojo.title}</h2>
              <p>{gojo.bio}</p>
            </article>

            {featuredTechniques.map((technique) => (
              <article className="profile-card" key={technique.id}>
                <p className="eyebrow">{technique.label}</p>
                <h3>{technique.name}</h3>
                <p>{technique.summary}</p>
              </article>
            ))}

            <article className="profile-card">
              <p className="eyebrow">IDENTITY</p>
              <h3>教师</h3>
              <p>培养能够改变咒术界的新一代。</p>
            </article>
          </div>
        </section>

        <dl className="profile-stats">
          <div>
            <dt>生日</dt>
            <dd>{gojo.profile.birthday}</dd>
          </div>
          <div>
            <dt>身高</dt>
            <dd>{gojo.profile.height}</dd>
          </div>
          <div>
            <dt>等级</dt>
            <dd>{gojo.profile.grade}</dd>
          </div>
          <div>
            <dt>所属</dt>
            <dd>{gojo.profile.affiliation}</dd>
          </div>
        </dl>

        <FanDisclaimer />
      </main>
    </>
  )
}
