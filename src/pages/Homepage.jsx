import { Link } from 'react-router-dom'
import PageNav from '../components/PageNav'

function Homepage() {
  return (
    <div>
      <PageNav />
      <h1 className="test"> Worldwise</h1>
      <Link to="/app">go to App</Link>
    </div>
  )
}

export default Homepage
