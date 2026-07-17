import { Link } from 'react-router-dom'

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" to="/">
        GOJO / SATORU
      </Link>
      <nav aria-label="主要导航">
        <a href="/#profile-summary">档案</a>
        <a href="/#techniques">术式</a>
        <a href="/#relationships">关系</a>
        <a href="/#story">经历</a>
      </nav>
    </header>
  )
}
