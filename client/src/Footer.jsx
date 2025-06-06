import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <>
            <footer className='Footer'>
            <Link to={"/contacto"}>Contacto</Link> 
            <Link to={"/login"}>Login</Link>
            </footer>
        </>
    )
}
