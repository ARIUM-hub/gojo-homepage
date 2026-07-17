import { Link } from 'react-router-dom'

import { gojo } from '../data/gojo'

export function HomePage() {
  return (
    <main id="main-content">
      <p>{gojo.identity}</p>
      <h1>{gojo.name}</h1>
      <p>“{gojo.quote}”</p>
      <Link to="/profile">进入个人档案</Link>
    </main>
  )
}
