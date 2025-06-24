import { Link } from 'react-router-dom';
import carro2 from '../assets/carro2.png';
import axios from 'axios';
import { useState, useEffect } from "react";

export const Inicio = () => {

    const [cardData, setCardData] = useState([]);

    useEffect(() => {
        const fetchCardData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/cardpub');
                setCardData(response.data);
            } catch (error) {
                console.error('Error en la obtencion de datos del CardGet', error);
            }
        }
        fetchCardData();
    }, []);


    return (
        <>
            <div className='contTarjeta'>
                <div className='contContendido'>
                    <h1 className='titulo_sorteo'>Sorteo</h1>
                    <img src={carro2} alt='Carro' />
                    <h2 className='subtitulo_inicio'>Toyota</h2>
                    <p className='descrip_inicio'>
                        23, Marzo del 2025
                    </p>
                    <button className='btn-inicio' type="button"><Link to={"/sorteo"}>Lista de Boletos</Link></button>
                </div>
            
            {cardData.map((card, index) => (
                    <div key={index} className='contContendido'>
                        <h1 className='titulo_sorteo'>{card.titulo_p}</h1>
                        <img
                            src={`data:image/*;base64,${card.imagen_pub}`}
                            alt='Imagen del sorteo'
                        />
                        <h2>{card.subtitulo_p}</h2>
                        <p>{card.descripcion_p}</p>
                        <button className='btn-inicio' type="button">
                            <Link to={"/sorteo"}>Lista de Boletos</Link>
                        </button>
                    </div>
            ))}
            </div>

        </>
    )
}
