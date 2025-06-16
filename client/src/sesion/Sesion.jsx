import { useEffect, useState } from "react";
import borrar from "../assets/borrar.png";
import editar from "../assets/editar.png";
import zoom from "../assets/zoom.png";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

export const Sesion = () => {

    const [jugadores, setJugadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminName, setAdminName] = useState('');
    const [search, setSearch] = useState(""); //Valor de Filtro()
    const [filterJugadores, setFilterJugadores] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedAdmin = localStorage.getItem('adminSession');
        const token = localStorage.getItem('jwtToken');

        // Verificar si es el token, si no redireccionar
        if (!token || !savedAdmin) {
            setTimeout(() => {
                navigate('/login')
            }, 100)
            return;
        };

        try {
            const { nombre } = JSON.parse(savedAdmin);
            setAdminName(nombre);
        } catch (error) {
            console.error("Error en el Parsing del Admin"), error;
        }

        setIsAuthenticated(true)

        const fetchJugadores = async () => {

            try {
                const response = await axios.get('http://localhost:3000/jugadores', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("datos recibidos", response.data);
                setJugadores(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener jugadores en el Admin", error);
                setLoading(false);

                if (error.response?.status === 401) {
                    localStorage.removeItem('adminSession');
                    localStorage.removeItem('jwtToken');
                    navigate('/login');
                };
            };
        };
        fetchJugadores();
    }, [navigate])

    //Filtro:
    const searcher = (e) => {
        setSearch(e.target.value);
    }

    useEffect(() => {
    
        //Funcion del filtro:
        if (!search.trim()) {
              setFilterJugadores(jugadores);
        } else {
            const term = search.toLowerCase();
            const result = jugadores.filter((jugador) => 
                jugador.nombres_apellidos.toLowerCase().includes(term)
            )
            setFilterJugadores(result)
        };
    
    }, [search, jugadores])


    const handleEliminar = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/jugador/${id}`);
            const deleteJugador = jugadores.filter(jugador => jugador.id !== id);
            setJugadores(deleteJugador);
            setFilterJugadores(deleteJugador);
            toast.success("Jugador eliminado");
        } catch (error) {
            console.error("Error al eliminar el jugador");
            toast.error("Error al eliminar al jugador");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminSession');
        localStorage.removeItem('jwtToken');
        navigate('/');
    };

    if (loading) {
        return <div><h4>Cargando Jugadores...</h4></div>
    };

    if (!isAuthenticated) {
        return <div><h4>Verificando Sesion...</h4></div>
    }

    return (
        <>

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    position: 'top-center',
                    icon: '🗑️',
                    style: {
                        borderRadius: '10px',
                        background: '#ff5454',
                        color: '#fff',
                    },
                }}
            />

            <div className="cont_admins">
                <div className="session-header">
                    <h2>Admin:</h2>
                    <div className="admin-info">
                        <span className="name-admin">{adminName}</span>
                    </div>
                </div>

                <h2 className="title_inventario">Inventario</h2>
                <input
                    type="text"
                    placeholder="Buscador..."
                    className="buscador_sesion"
                    value={search}
                    onChange={searcher}
                />


                {filterJugadores.map(jugador => (

                    <div className="box_jugador" key={`jugador-${jugador.id}`}>
                        <dl className="lista-datos" key={`lista-datos-${jugador.id}`}>
                            <div className="fila" key={`${jugador.id}-id`}>
                                <dt>ID:</dt>
                                <dd>{jugador.id}</dd>
                            </div>
                            <div className="fila" key={`${jugador.id}-nombres`}>
                                <dt>Nombres:</dt>
                                <dd><strong>{jugador.nombres_apellidos}</strong></dd>
                            </div>
                            <div className="fila" key={`${jugador.id}-celular`}>
                                <dt>Celular:</dt>
                                <dd>{jugador.celular}</dd>
                            </div>
                            <div className="fila" key={`${jugador.id}-cedula`}>
                                <dt>Cédula:</dt>
                                <dd>{jugador.cedula}</dd>
                            </div>
                            <div className="fila" key={`${jugador.id}-ciudad`}>
                                <dt>Ciudad y Estado:</dt>
                                <dd>{jugador.pais_estado}</dd>
                            </div>
                            <div className="fila" key={`${jugador.id}-metodo`}>
                                <dt>Método de Pago:</dt>
                                <dd>{jugador.metodo_pago}</dd>
                            </div>
                            <div className="fila" key={`${jugador.id}-comprobante`}>
                                <dt>Comprobante:</dt>
                                <dd>
                                    {jugador.comprobante_url ? (
                                        <div className="cont_comprobante_img">
                                            <a
                                                className="targe_comprobante"
                                                href={jugador.comprobante_url}
                                                target="_blank"
                                                rel="moopener noreferrer"
                                                key={`comprobante-link${jugador.id}`}
                                            >
                                                <img
                                                    src={zoom}
                                                    className="zoom_comprobante"
                                                    key={`comprobante-link-zoom-${jugador.id}`}
                                                />
                                                <img
                                                    className="comprobante_img"
                                                    src={jugador.comprobante_url}
                                                    alt="Comprobante de pago"
                                                    key={`comprobante-img-${jugador.id}`}
                                                />
                                            </a>
                                        </div>
                                    ) : (
                                        "Comprobante de pago"
                                    )}
                                </dd>
                            </div>
                            <div className="fila" key={`${jugador.id}-referencia`}>
                                <dt>Referencia:</dt>
                                <dd>{jugador.referenciaPago}</dd>
                            </div>
                            <div className="fila" key={`${jugador.id}-boletos`}>
                                <dt>Numeros de Boletos:</dt>
                                <dd>
                                    {jugador.boletos && jugador.boletos.map((boleto, index) => (
                                        <p className="fila_num" key={`${jugador.id}-${index}`}>{boleto}</p>
                                    ))}
                                </dd>
                            </div>
                            <div className="fila" key={`${jugador.id}-fecha`}>
                                <dt>Fecha:</dt>
                                <dd><strong>{new Date(jugador.fecha_registro).toLocaleDateString()}</strong>
                                    <br />
                                    {new Date(jugador.fecha_registro).toLocaleTimeString()}
                                </dd>
                            </div>
                            <div className="lista_btns" key={`${jugador.id}-botones`}>
                                <button
                                    className="btn_eliminar_sesion"
                                    onClick={() => handleEliminar(jugador.id)}
                                    key={`$btn-eliminar-${jugador.id}`}
                                >
                                    <img
                                        src={borrar}
                                        alt="Borrar"
                                        key={`img-eliminar-${jugador.id}`}
                                    />
                                </button>

                                <button
                                    className="btn_editar_sesion"
                                    key={`btn-editar-${jugador.id}`}
                                >
                                    <img
                                        src={editar}
                                        alt="Borrar"
                                        key={`img-editar-${jugador.id}`}
                                    />
                                </button>
                            </div>
                        </dl>
                    </div>
                ))}
            </div>
        </>
    )
}
