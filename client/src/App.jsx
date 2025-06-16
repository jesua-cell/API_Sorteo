import { Rutas } from './routes/Rutas.jsx'
import { Navbar } from './Navbar.jsx'
import { Footer } from './Footer.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import './App.css'

function App() {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <Rutas />
        <Footer />
      </AuthProvider>
    </>
  )
}

export default App
