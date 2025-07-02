import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
//Imagenes
import carro2 from '../assets/carro2.png';
import whatsapp from '../assets/whatsapp.png';
import telegrama from '../assets/telegrama.png';
import instagram from '../assets/instagram.png';

import whatsapp_alt from '../assets/whatsapp_alt.png';
import telegrama_alt from '../assets/telegrama_alt.png';
import instagram_alt from '../assets/instagram_alt.png';


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

                {cardData.length > 0 ? (
                    cardData.map((card, index) => (
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
                    ))
                ) : (
                    <div className='contContendido'>
                        <h1 className='titulo_sorteo'>Próximos Sorteo</h1>
                        <label className="label_img_inicio">Síguenos en nuestras redes</label>
                       
                        <div className="box_img">
                            <img src={instagram_alt} className="img_inicio" alt="instamgram" />
                            <img src={whatsapp_alt} className="img_inicio" alt="instamgram" />
                            <img src={telegrama_alt} className="img_inicio" alt="telegram" />
                        </div>
                    </div>
                )}
            </div>

        </>
    )
}
