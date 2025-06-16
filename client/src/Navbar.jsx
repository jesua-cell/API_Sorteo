import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import  logoutIcon  from "./assets/cerrar-sesion.png";

export const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [adminName, setAdminName] = useState('');

  useEffect(() => {

    //verificar sesion
    const savedAdmin = localStorage.getItem('adminSession');
    try {

      if (savedAdmin) {
        const { nombre } = JSON.parse(savedAdmin);
        setAdminName(nombre);
      }
    } catch (error) {
      console.error("Error en el AdminSession del NabVar", error)
    };

    //Menu hamburguesa
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    };

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('jwtToken')
    window.location.href = '/';
  };

  return (
    <>
      <nav className='NavBar'>

        <div className="nav_logo">Sorteo La Rosa</div>

        <div className={`nav_backdrop ${isOpen && "open"}`} onClick={closeMenu} />

        <div className={`nav_item ${isOpen && "open"}`}>

              <Link to={"/"} onClick={closeMenu}>Inicio</Link>
              <Link to={"/sorteo"} onClick={closeMenu}>Sorteo</Link>
              <Link to={"/cuentas_de_pago"} onClick={closeMenu}>Cuentas de Pago</Link>

          {adminName && (
            <>
              <button onClick={handleLogout} className='logout-btn'>
                <img className='icon-logout' src={logoutIcon}/
                > Cerrar sesion</button>
              <span className='admin-name'>{adminName}</span>
            </>
          )}
        
        </div>

        <div className={`nav_toggle ${isOpen && "open"}`} onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

      </nav>
    </>
  )
}
