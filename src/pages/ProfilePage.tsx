import { Link } from 'react-router-dom'

import { gojo } from '../data/gojo'

export function ProfilePage() {
  return (
    <main id="main-content">
      <Link to="/">返回主页</Link>
      <h1>个人档案</h1>
      <h2>{gojo.name}</h2>
      <p>{gojo.bio}</p>
    </main>
  )
}
