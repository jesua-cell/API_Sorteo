import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from "date-fns";
import es from "date-fns/locale/es";
//Imagenes
import carro2 from '../assets/carro2.png';
import whatsapp_alt from '../assets/whatsapp_alt.png';
import telegrama_alt from '../assets/telegrama_alt.png';
import instagram_alt from '../assets/instagram_alt.png';
import tiktok from '../assets/tiktok.png';


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

    const formaDate = (dateString) => {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
        } catch (error) {
            console.error("Error en el formato de la fecha", error);
            return dateString;
        }
    };

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
                            <p className="p_fecha">{formaDate(card.fecha_juego)}</p>
                        </div>
                    ))
                ) : (
                    <div className='contContendido'>
                        <h1 className='titulo_sorteo'>Próximos Sorteo</h1>
                        <label className="label_img_inicio">Síguenos en nuestras redes</label>

                        <div className="box_img">
                            <a
                                className="a_inicio"
                                href="https://www.instagram.com/laorquidea2025?igsh=cjN5MXpqam9ja2g2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={instagram_alt}
                                    className="img_inicio"
                                    alt="instamgram"
                                />
                            </a>
                            <a
                                className="a_inicio"
                                href="https://wa.me/584121373761"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={whatsapp_alt}
                                    className="img_inicio"
                                    alt="instamgram"
                                />
                            </a>

                            <a
                                className="a_inicio"
                                href=""
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={telegrama_alt}
                                    className="img_inicio"
                                    alt="telegram"
                                />
                            </a>

                            <a
                                className="a_inicio"
                                href="https://www.tiktok.com/@la.orquidea38?_t=ZS-8xhSaTav4XR&_r=1"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={tiktok}
                                    className="img_inicio"
                                    alt="tiktok_3"
                                />
                            </a>
                        </div>
                    </div>
                )}
            </div>

        </>
    )
}
