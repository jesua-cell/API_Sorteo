import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import logoutIcon from "./assets/cerrar-sesion.png";
import logo from "./assets/logo_or.png";

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
    setAdminName('');
  };

  return (
    <>
      <nav className='NavBar'>
        <div className="cont_logo">
          <img src={logo} className='logo_orquidea' />
        </div>
        <div className="nav_logo">

        </div>


        <div className={`nav_backdrop ${isOpen && "open"}`} onClick={closeMenu} />

        <div className={`nav_item ${isOpen && "open"}`}>

          <Link 
          to={"/"} 
          onClick={()=>{
            closeMenu();
            if(adminName) handleLogout();
          }}
          
          >Inicio</Link>
          <Link 
          to={"/sorteo"} 
          onClick={()=>{
            closeMenu();
            if(adminName) handleLogout();
          }}
          
          >Sorteo</Link>
          <Link 
          to={"/cuentas_de_pago"} 
          onClick={()=>{
            closeMenu();
            if(adminName) handleLogout();
          }}
          
          >Cuentas de Pago</Link>

          {adminName && (
            <>
              <Link className='enlaces_admin' to={"/card_post"} onClick={closeMenu}>Publicación de Sorteo</Link>
              <Link className='enlaces_admin' to={"/sesion"} onClick={closeMenu}>Sesion Admin</Link>
              <button onClick={handleLogout} className='logout-btn'>
                <img className='icon-logout' src={logoutIcon} />
                Cerrar sesion
              </button>
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
