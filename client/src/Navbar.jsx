import { Link } from 'react-router-dom'

export const Navbar = () => {
    return (
        <>
            <nav className='NavBar'>
                <h1>Navbar</h1>
                <Link to={"/inicio"}>Inicio</Link>
                <Link to={"/login"}>Login</Link>
                <Link to={"/sorteo"}>Sorteo</Link>
            </nav>
        </>
    )
}
