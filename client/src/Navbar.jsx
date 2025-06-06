import { Link } from 'react-router-dom'

export const Navbar = () => {
    return (
        <>
            <nav className='NavBar'>
                <Link to={"/"}>Inicio</Link>
                <Link to={"/sorteo"}>Sorteo</Link>
                <Link to={"/cuentas_de_pago"}>Cuentas de Pagos</Link>
                </nav>
        </>
    )
}
