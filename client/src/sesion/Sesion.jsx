import { useEffect, useState } from "react";
import borrar from "../assets/borrar.png";
import editar from "../assets/editar.png";
import zoom from "../assets/zoom.png";
import axios from "axios";

export const Sesion = () => {

    const [jugadores, setJugadores] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchJugadores = async () => {
            try {
                const response = await axios.get('http://localhost:3000/jugadores');
                console.log("datos recibidos", response.data);
                setJugadores(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener jugadores en el Admin", error);
                setLoading(false);
            }
        };
        fetchJugadores();
    }, [])

    if (loading) {
        return <div><h4>Cargando Jugadores...</h4></div>
    }

    return (
        <>
            <div className="cont_admins">
                <h2>Inventario</h2>
                <input type="text"
                    placeholder="Buscador..."
                    className="buscador_sesion"
                />

                {jugadores.map(jugador => (

                    <div className="box_jugador" key={jugador.id}>
                        <dl className="lista-datos">
                            <div className="fila">
                                <dt>ID:</dt>
                                <dd>{jugador.id}</dd>
                            </div>
                            <div className="fila">
                                <dt>Nombres:</dt>
                                <dd><strong>{jugador.nombres_apellidos}</strong></dd>
                            </div>
                            <div className="fila">
                                <dt>Celular:</dt>
                                <dd>{jugador.celular}</dd>
                            </div>
                            <div className="fila">
                                <dt>Cédula:</dt>
                                <dd>{jugador.cedula}</dd>
                            </div>
                            <div className="fila">
                                <dt>Ciudad y Estado:</dt>
                                <dd>{jugador.pais_estado}</dd>
                            </div>
                            <div className="fila">
                                <dt>Método de Pago:</dt>
                                <dd>{jugador.metodo_pago}</dd>
                            </div>
                            <div className="fila">
                                <dt>Comprobante:</dt>
                                <dd>
                                    {jugador.comprobante_url ? (
                                        <div className="cont_comprobante_img">
                                            <a
                                                className="targe_comprobante"
                                                href={jugador.comprobante_url}
                                                target="_blank"
                                                rel="moopener noreferrer"
                                            >
                                                <img
                                                    src={zoom}
                                                    className="zoom_comprobante"
                                                />
                                                <img
                                                    className="comprobante_img"
                                                    src={jugador.comprobante_url}
                                                    alt="Comprobante de pago"
                                                />
                                            </a>
                                        </div>
                                    ) : (
                                        "Comprobante de pago"
                                    )}
                                </dd>
                            </div>
                            <div className="fila">
                                <dt>Referencia:</dt>
                                <dd>{jugador.referenciaPago}</dd>
                            </div>
                            <div className="fila">
                                <dt>Numeros de Boletos:</dt>
                                <dd>
                                    {jugador.boletos && jugador.boletos.map((boleto, index) => (
                                        <p className="fila_num" key={index}>{boleto}</p>
                                    ))}
                                </dd>
                            </div>
                            <div className="fila">
                                <dt>Fecha:</dt>
                                <dd><strong>{new Date(jugador.fecha_registro).toLocaleDateString()}</strong>
                                    <br />
                                    {new Date(jugador.fecha_registro).toLocaleTimeString()}
                                </dd>
                            </div>
                            <div className="lista_btns">
                                <button className="btn_eliminar_sesion"><img src={borrar} alt="Borrar" /></button>
                                <button className="btn_editar_sesion"><img src={editar} alt="Borrar" /></button>
                            </div>
                        </dl>
                    </div>
                ))}
            </div>
        </>
    )
}
