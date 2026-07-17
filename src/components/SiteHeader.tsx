import { Link } from 'react-router-dom'

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" to="/">
        GOJO / SATORU
      </Link>
      <nav aria-label="主要导航">
        <Link to="/#profile-summary">档案</Link>
        <Link to="/#techniques">术式</Link>
        <Link to="/#relationships">关系</Link>
        <Link to="/#story">经历</Link>
      </nav>
    </header>
  )
}
