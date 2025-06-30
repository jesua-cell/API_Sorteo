import { useEffect, useState } from "react";
//imagenes
import borrar from "../assets/borrar.png";
import editar from "../assets/editar.png";
import sav from "../assets/sav.png";
import error from "../assets/error.png";
import buscar from "../assets/buscar.png";
import zoom from "../assets/zoom.png";

import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import Select from 'react-select'

export const Sesion = () => {

    const [jugadores, setJugadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminName, setAdminName] = useState('');
    const [search, setSearch] = useState(""); //Valor de Filtro()
    const [filterJugadores, setFilterJugadores] = useState([]);

    const [select, setSelect] = useState();

    //estados de actualizacion
    const [editingID, setEditingID] = useState(null);
    const [tempData, setTempData] = useState({});

    //Estados del Input VALOR_VES
    const [valor, setValor] = useState(0);
    const [inputValor, setInputValor] = useState('');
    //Estados de VALOR_VES
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');
    const [currentId, setCurrentId] = useState(null);

    const navigate = useNavigate();

    //Estado de acceso al Admin
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

        //Estado para obtener los datos de los jugadores de la BD
        const fetchJugadores = async () => {

            try {
                const response = await axios.get('http://localhost:3000/jugadores', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("datos recibidos", response.data);
                setJugadores(response.data);
                setFilterJugadores(response.data);
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
    /*TOFO: Agregar valores numericos */
    useEffect(() => {

        //Funcion del filtro:
        if (!search.trim()) {
            setFilterJugadores(jugadores);
        } else {
            const term = search.toLowerCase();
            const result = jugadores.filter((jugador) => {
                return (
                    jugador.nombres_apellidos?.toLowerCase().includes(term) ||
                    jugador.celular?.toString().toLowerCase().includes(term) ||
                    jugador.cedula?.toString().toLowerCase().includes(term) ||
                    jugador.pais_estado?.toLowerCase().includes(term) ||
                    jugador.metodo_pago?.toLowerCase().includes(term) ||
                    jugador.referenciaPago?.toLowerCase().includes(term) ||
                    (jugador.boletos && jugador.boletos.some(boleto =>
                        boleto.toString().includes(term)
                    )) ||
                    new Date(jugador.fecha_registro).toLocaleDateString().toLowerCase().includes(term) ||
                    new Date(jugador.fecha_registro).toLocaleTimeString().toLowerCase().includes(term)
                );
            });
            setFilterJugadores(result)
        };

    }, [search, jugadores])


    //Funcion para activar Edicion
    const handleActivarEdicion = (jugador) => {
        setEditingID(jugador.id);
        setTempData({
            nombres_apellidos: jugador.nombres_apellidos,
            celular: jugador.celular,
            cedula: jugador.cedula.toString(),
            pais_estado: jugador.pais_estado,
            metodo_pago: jugador.metodo_pago,
            referenciaPago: jugador.referenciaPago,
            boletos: jugador.boletos.join(", ")
        });
    };

    //Funcion para guardar cambios
    const handleguardarCambios = async (id) => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put(`http://localhost:3000/jugador/${id}`, tempData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            //actualizar estado local
            const updateJugadores = jugadores.map(j => {
                if (j.id === id) {

                    return {
                        ...j,
                        ...tempData,
                        boletos: tempData.boletos
                            ? tempData.boletos.split(",")
                                .map(b => b.trim())
                                .filter(b => b !== "")
                            : []
                    };
                }
                return j;
            });

            setJugadores(updateJugadores);
            setFilterJugadores(updateJugadores);
            setEditingID(null);
            toast('Cambios Guardados',
                {
                    icon: '💾',
                    style: {
                        borderRadius: '20px',
                        background: '#9fb3ff',
                        color: '#000467',
                        padding: '8px'
                    },
                }
            );

        } catch (error) {
            console.error("Error en la actualizacion", error);
            toast.error("Error al guardar los cambios");
        }
    };

    const handleCancelEditar = () => {
        setEditingID(null)
    };

    //Funcion de eliminar jugadores
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

    //Obtener valor del VES a la BD
    const fetchValorVes = async () => {
        try {
            const response = await axios.get('http://localhost:3000/valor');
            setValor(response.data.valor);
            setCurrentId(response.data.id);
        } catch (error) {
            console.error('Error al obtener el valor del VES', error);
        }
    };

    //Muestra el valor del VES al cargar el componente
    useEffect(() => {
        fetchValorVes();
    }, []);

    //Enviar valor del VES a la BD
    const enviarValor = async () => {
        try {
            // Convertir a número y validar
            const valorNumerico = parseFloat(inputValor);
            if (isNaN(valorNumerico)) {
                console.error('Valor no numérico');
                return;
            };

            //enviar al back-bd
            await axios.post(
                'http://localhost:3000/valor',
                { valor: valorNumerico }
            );

            fetchValorVes();
            setInputValor('');
        } catch (error) {
            console.error('Error en el evnio del valor:', error);
        }
    };

    const normalizarNumero = (valorStr) => {

        if (!valorStr) return '';

        const sinPuntos = valorStr.replace(/\,/g, '');

        const conPuntoDecimal = sinPuntos.replace(',', '.');

        return conPuntoDecimal;
    };

    //Funcion para actulizar el  valor del VALOR_VES
    const handleUpdate = async () => {
        try {

            //Valor de la actualizacion: valor(UPDATE)

            const valorNormalizado = normalizarNumero(editValue)

            const valorNumerico = parseFloat(valorNormalizado); //Convertir a decimal
            if (isNaN(valorNumerico)) {
                console.error('Valor no numerico');
                return;
            };

            await axios.put(
                `http://localhost:3000/valor`,
                { valor: valorNumerico }
            );

            setValor(valorNumerico); //Estado del valor editado
            setIsEditing(false);
            setEditValue(''); //Estado del input en Edicion
            toast('Cambios del valor del VES Guardados',
                {
                    icon: '💾',
                    style: {
                        borderRadius: '20px',
                        background: '#9fb3ff',
                        color: '#000467',
                        padding: '8px',
                        textAlign: 'center'
                    },
                }
            );
        } catch (error) {
            console.error('Error en la actualizacion del valor', error);
        }
    };

    const formatoLatino = (numero) => {
        
        if (numero == null) return '';

        return numero.toLocaleString('es-VE', {
            minimumFractionDigits: 2,
            minimumFractionDigits: 2
        })
    };

    if (loading) {
        return <div><h4>Cargando Jugadores...</h4></div>
    };

    if (!isAuthenticated) {
        return <div><h4>Verificando Sesion...</h4></div>
    }

    const totalBoletos = jugadores.flatMap(j => j.boletos || []).length;

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

                {/* Informacion del Sorteo */}
                <div className="contInfoSorteo">
                    <p className="infoSorteoText">Numero Jugadores: <strong>{jugadores.length}</strong> de 1000</p>
                    <p className="infoSorteoText">Jugadores pendientes: <strong>{jugadores.length - 1000}</strong></p>
                    <p className="infoSorteoText">Numeros seleccionados: <strong>{totalBoletos}</strong> de 1000</p>
                    <p className="infoSorteoText">Numeros disponibles: <strong>{Math.max(0, 1000 - totalBoletos)}</strong> de 1000</p>
                </div>

                {/* Filter */}

                <div className="boxValor">
                    {isEditing ? (
                        <div className="conntValorVef">
                            <input
                                type="number"
                                className="input_bcv"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                placeholder="Nuevo Valor del VES"
                                style={{ marginBottom: '14px', marginTop: '15px' }}
                            />
                            <div className="btns_vef">
                                <button onClick={handleUpdate} className="btn_save_ves">Guardar</button>
                                <button onClick={() => setIsEditing(false)} className="btn_cancel_ves">Cancelar</button>
                            </div>
                        </div>
                    ) : (
                        <div className="conntValorVef">
                            <label className="label_valor">Valor del VES: <strong>${formatoLatino(valor)}</strong></label>
                            <button
                                onClick={() => {
                                    setEditValue(valor.toString());
                                    setIsEditing(true);
                                }}
                                className="btn_edit_ves"
                            >
                                Editar
                            </button>
                        </div>
                    )}
                </div>

                <input
                    type="text"
                    placeholder="Buscador..."
                    className="buscador_sesion"
                    value={search}
                    onChange={searcher}
                />

                {filterJugadores.length === 0 ? (
                    <div className="no_result">
                        <p className="text_no_result">No existe el jugador con estos caracteres:  <span>"{search}"</span></p>
                        <button
                            className="btn_no_result"
                            onClick={() => setSearch('')}
                        >
                            Limpiar Busquedad
                        </button>
                    </div>
                ) : (
                    filterJugadores.map(jugador => (
                        <div className="box_jugador" key={`jugador-${jugador.id}`}>
                            <dl className="lista-datos" key={`lista-datos-${jugador.id}`}>
                                <div className="fila" key={`${jugador.id}-id`}>
                                    <dt>ID:</dt>
                                    <dd>{jugador.id}</dd>
                                </div>
                                <div className="fila" key={`${jugador.id}-nombres`}>
                                    <dt>Nombres:</dt>
                                    <dd>
                                        {editingID === jugador.id ? (
                                            <input
                                                type="text"
                                                className="input_edicion"
                                                value={tempData.nombres_apellidos}
                                                onChange={(e) => setTempData({ ...tempData, nombres_apellidos: e.target.value })}
                                            />
                                        ) : (
                                            <strong>{jugador.nombres_apellidos}</strong>
                                        )}
                                    </dd>
                                </div>
                                <div className="fila" key={`${jugador.id}-celular`}>
                                    <dt>Celular:</dt>
                                    <dd>
                                        {editingID === jugador.id ? (
                                            <input
                                                type="text"
                                                className="input_edicion"
                                                value={tempData.celular}
                                                onChange={(e) => setTempData({ ...tempData, celular: e.target.value })}
                                            />
                                        ) : (
                                            jugador.celular
                                        )}
                                    </dd>
                                </div>
                                <div className="fila" key={`${jugador.id}-cedula`}>
                                    <dt>Cédula:</dt>
                                    <dd>
                                        {editingID === jugador.id ? (
                                            <input
                                                type="text"
                                                className="input_edicion"
                                                value={tempData.cedula}
                                                onChange={(e) => setTempData({ ...tempData, cedula: e.target.value })}
                                            />
                                        ) : (
                                            jugador.cedula
                                        )}
                                    </dd>
                                </div>
                                <div className="fila" key={`${jugador.id}-ciudad`}>
                                    <dt>Ciudad y Estado:</dt>
                                    <dd>
                                        {editingID === jugador.id ? (
                                            <input
                                                type="text"
                                                value={tempData.pais_estado}
                                                className="input_edicion"
                                                onChange={(e) => setTempData({ ...tempData, pais_estado: e.target.value })}
                                            />
                                        ) : (
                                            jugador.pais_estado
                                        )}
                                    </dd>
                                </div>
                                <div className="fila" key={`${jugador.id}-metodo`}>
                                    <dt>Método de Pago:</dt>
                                    <dd>
                                        {editingID === jugador.id ? (
                                            <input
                                                type="text"
                                                className="input_edicion"
                                                value={tempData.metodo_pago}
                                                onChange={(e) => setTempData({ ...tempData, metodo_pago: e.target.value })}
                                            />
                                        ) : (
                                            jugador.metodo_pago
                                        )}
                                    </dd>
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
                                                    rel="noopener noreferrer"
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
                                    <dd>
                                        {editingID === jugador.id ? (
                                            <input
                                                type="text"
                                                className="input_edicion"
                                                value={tempData.referenciaPago}
                                                onChange={(e) => setTempData({ ...tempData, referenciaPago: e.target.value })}
                                            />
                                        ) : (
                                            jugador.referenciaPago
                                        )}
                                    </dd>
                                </div>
                                <div className="fila" key={`${jugador.id}-boletos`}>
                                    <dt>Numeros de Boletos:</dt>
                                    <dd>
                                        {editingID === jugador.id ? (
                                            <textarea
                                                type="text"
                                                key={`${jugador.id}-textarea${editingID === jugador.id}`}
                                                className="input_edicion_area"
                                                value={tempData.boletos}
                                                onChange={(e) => setTempData({ ...tempData, boletos: e.target.value })}
                                                placeholder="Separar por comas (ej: 0123, 0789)"
                                            />
                                        ) : (
                                            jugador.boletos && jugador.boletos.map((boleto, index) => (
                                                <p className="fila_num" key={`${jugador.id}-${index}`}>{boleto}</p>
                                            ))
                                        )}
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
                                    {editingID === jugador.id ? (
                                        <>
                                            <button
                                                className="btn_guardar_sesion"
                                                onClick={() => handleguardarCambios(jugador.id)}
                                            >
                                                <img src={sav} />
                                            </button>

                                            <button
                                                className="btn_cancel_sesion"
                                                onClick={handleCancelEditar}
                                            >
                                                <img src={error} />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className="btn_editar_sesion"
                                            onClick={() => handleActivarEdicion(jugador)}
                                        >
                                            <img
                                                src={editar}
                                                alt="Borrar"
                                            />
                                        </button>
                                    )}
                                </div>
                            </dl>
                        </div>
                    ))
                )}
            </div >

        </>
    )
}
