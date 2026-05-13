import 'bootstrap/dist/css/bootstrap.min.css'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <h1 className='WebPageTitle'>Movie Recommender</h1>
    <App />
  </>,
)
