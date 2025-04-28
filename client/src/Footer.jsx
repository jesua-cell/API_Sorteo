import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <>
            <footer className='Footer'>
            <Link to={"/cuentas_de_pago"}>Cuentas de Pago</Link>
            <Link to={"/login"}>Login</Link>
            </footer>
        </>
    )
}
