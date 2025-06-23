import { Link } from 'react-router-dom';
import carro2 from '../assets/carro2.png';

export const Inicio = () => {
    return (
        <>
            <div className='contTarjeta'>
                <div className='contContendido'>
                    <h1 className='titulo_sorteo'>Sorteo</h1> 
                    <img src={carro2} alt='Carro' />
                    <h2>Toyota</h2>
                    <p>
                        23, Marzo del 2025
                    </p>
                    <button className='btn-inicio' type="button"><Link to={"/sorteo"}>Lista de Boletos</Link></button>
                </div>
            </div>
        </>
    )
}
