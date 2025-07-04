import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import logoutIcon from "./assets/cerrar-sesion.png";
import logo from "./assets/logo_or.png";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {

  const navigate = useNavigate();

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
    localStorage.removeItem('jwtToken');
    navigate('/');
    closeMenu();
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

          {/* Enlaces Publicos */}
          <Link
            to={"/"}
            onClick={closeMenu}
          >Inicio</Link>

          <Link
            to={"/sorteo"}
            onClick={closeMenu}
          >Sorteo</Link>

          <Link
            to={"/cuentas_de_pago"}
            onClick={closeMenu}
          >Cuentas de Pago</Link>

          <Link
            to={"/verificador"}
            onClick={closeMenu}
          >Verificador</Link>

          {/* Enlaces Privados */}
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
