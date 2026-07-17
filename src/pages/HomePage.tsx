import { FanDisclaimer } from '../components/FanDisclaimer'
import { HeroCard } from '../components/HeroCard'
import { RelationshipTabs } from '../components/RelationshipTabs'
import { SiteHeader } from '../components/SiteHeader'
import { StoryTimeline } from '../components/StoryTimeline'
import { TechniqueGrid } from '../components/TechniqueGrid'
import { gojo } from '../data/gojo'

export function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <div className="page-shell">
        <SiteHeader />
      </div>
      <main className="page-shell" id="main-content">
        <HeroCard />

        <section
          className="home-section profile-summary"
          id="profile-summary"
          aria-labelledby="profile-title"
        >
          <p className="eyebrow">PROFILE</p>
          <h2 id="profile-title">{gojo.title}</h2>
          <p className="lead">{gojo.bio}</p>
          <dl className="quick-stats">
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
        </section>

        <section
          className="home-section"
          id="techniques"
          aria-labelledby="techniques-title"
        >
          <p className="eyebrow">ABILITIES</p>
          <h2 id="techniques-title">术式能力</h2>
          <TechniqueGrid techniques={gojo.techniques} />
        </section>

        <section
          className="home-section"
          id="relationships"
          aria-labelledby="relationships-title"
        >
          <p className="eyebrow">RELATIONSHIPS</p>
          <h2 id="relationships-title">人物关系</h2>
          <RelationshipTabs relationships={gojo.relationships} />
        </section>

        <section
          className="home-section"
          id="story"
          aria-labelledby="story-title"
        >
          <p className="eyebrow">STORY</p>
          <h2 id="story-title">关键经历</h2>
          <StoryTimeline entries={gojo.timeline} />
        </section>

        <blockquote className="quote-block">
          “天上天下，唯我独尊。”
        </blockquote>
        <FanDisclaimer />
      </main>
    </>
  )
}
