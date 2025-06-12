import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
      if(isOpen){
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      };
    
      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [isOpen])
    


    const closeMenu = () => setIsOpen(false);

    return (
        <>
            <nav className='NavBar'>
                <div className="nav_logo">Sorteo La Rosa</div>
                
                <div className={`nav_backdrop ${isOpen && "open"}`} onClick={closeMenu}/>

                <div className={`nav_item ${isOpen && "open"}`}>
                    <Link to={"/"} onClick={closeMenu}>Inicio</Link>
                    <Link to={"/sorteo"} onClick={closeMenu}>Sorteo</Link>
                    <Link to={"/cuentas_de_pago"} onClick={closeMenu}>Cuentas de Pagos</Link>
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
