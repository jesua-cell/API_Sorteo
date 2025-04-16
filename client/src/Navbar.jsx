import { Link } from 'react-router-dom'

export const Navbar = () => {
    return (
        <>
            <nav className='NavBar'>
                <Link to={"/"}>Inicio</Link>
                <Link to={"/login"}>Login</Link>
                <Link to={"/sorteo"}>Sorteo</Link>
            </nav>
        </>
    )
}
