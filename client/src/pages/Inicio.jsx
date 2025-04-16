import { Link } from 'react-router-dom';
import  carro2  from '../assets/carro2.png';

export const Inicio = () => {
    return (
        <>
            <div className='contTarjeta'>
                <h1>Sorteo</h1>
                <div className='contContendido'>
                    <img src={carro2} alt='Carro' />
                    <h2>Carro</h2>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores reprehenderit ea deleniti, corrupti quaerat quas hic! Neque aspernatur ducimus culpa accusamus. Rerum voluptatem animi laboriosam quidem esse quo pariatur vero.
                    </p>
                    <button type="button"><Link to={"/sorteo"}>Sorteo</Link></button>
                </div>
            </div>
        </>
    )
}
