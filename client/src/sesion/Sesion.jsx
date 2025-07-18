import { useEffect, useState } from "react";
//imagenes
import borrar from "../assets/borrar.png";
import editar from "../assets/editar.png";
import sav from "../assets/sav.png";
import error from "../assets/error.png";
import reloj from "../assets/reloj.png";
import cheque from "../assets/cheque.png";
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

    //Estados de los botones toggle del "monto total"
    const [pagoEstados, setPagoEstados] = useState({});

    // Estados del modo de Sorteo
    const [modoSorteo, setModoSorteo] = useState('1000');

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

                //Datos iniciales del estado_pago
                const estadosIniciales = {};
                response.data.forEach(jugador => {
                    estadosIniciales[jugador.id] = jugador.estado_pago || 'pendiente'
                });
                setPagoEstados(estadosIniciales);
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


    useEffect(() => {

        const fetchModoSorteo = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get('http://localhost:3000/modo_sorteo', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setModoSorteo(response.data.modo || '1000')
            } catch (error) {
                console.error("Error en la obtencion del modo del Sorteo");
            };
        };

        fetchModoSorteo();
    }, [])

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
            boletos: jugador.boletos.join(", "),
            monto_total: jugador.monto_total,
            estado_pago: jugador.estado_pago
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
                        monto_total: tempData.monto_total,
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

    // funcion toggle del campo de monto total
    const togglePago = async (jugadorId, nuevoEstado) => {

        try {

            const token = localStorage.getItem('jwtToken');
            await axios.put(
                `http://localhost:3000/jugador/${jugadorId}/estado_pago`,
                { estado_pago: nuevoEstado },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            //Actualizar lista de estado
            setJugadores(prev => prev.map(j =>
                j.id === jugadorId ? { ...j, estado_pago: nuevoEstado } : j
            ));
        } catch (error) {
            console.error('Error en la actualizacion de datos del estado de pago', error);
        }
    };

    const actualizarModoSorteo = async (modo) => {

        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put(
                'http://localhost:3000/modo_sorteo',
                { modo },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast(`${modo} Puestos`,
                {
                    icon: '',
                    style: {
                        borderRadius: '20px',
                        background: '#f8f5f5',
                        color: '#070707',
                        border: '2px solid #070707',
                        padding: '10px 20px',
                        textAlign: 'center',
                        position: 'top-center',
                    },
                }
            );

            //TODO colocar un ventana de alerta al cambiar la cantidad de numeros
        } catch (error) {
            console.error("Error en al cambio de modo", error);
            toast.error("Error en el cambio de modo");
        }
    }

    const formatoLatino = (numero) => {

        if (numero == null) return '';

        return numero.toLocaleString('es-VE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    };

    if (loading) {
        return <div><h4>Cargando Jugadores...</h4></div>
    };

    if (!isAuthenticated) {
        return <div><h4>Verificando Sesion...</h4></div>
    }

    const totalBoletos = jugadores.flatMap(j => j.boletos || []).length;

    //TODO* Agregar un nuevo campo de pago en efectivo
    //TODO* Colocar un boton de "pendiente" o "pago hecho" en el campo de monto total
    //TODO* Crear una funcion que muestre 100 o 1000 numeros en el archivo Sorteo.jsx

    //TODO Agregar un componente de paginacion
    //TODO Configurar el filtro de busquedad para por medio de una funcion, busque los datos desde el back, y los muestre en el archivo


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
                <h2 className="title_inventario">Inventario</h2>

                {/* Informacion del Sorteo */}
                <div className="contInventario">
                    <div className="contInfoSorteo">
                        <p className="infoSorteoText">Numero Jugadores: <strong>{jugadores.length}</strong> de 1000</p>
                        <p className="infoSorteoText">Puestos Jugadores pendientes: <strong>{1000 - jugadores.length}</strong></p>
                        <p className="infoSorteoText">Numeros seleccionados: <strong>{totalBoletos}</strong> de 1000</p>
                        <p className="infoSorteoText">Numeros disponibles: <strong>{Math.max(0, 1000 - totalBoletos)}</strong> de 1000</p>
                    </div>

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
                                <label className="label_valor">Valor del VES: <strong>{formatoLatino(valor)}</strong></label>
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

                    <div className="countNumSorteoPub">
                        <h3 className="title_countNumSorteoPub">Cantidad de Puestos:</h3>
                        <button
                            className="btn_countPub_mil"
                            onClick={() => actualizarModoSorteo('1000')}
                        >1000
                        </button>

                        <button
                            className="btn_countPub_cien"
                            onClick={() => actualizarModoSorteo('100')}
                        >100
                        </button>
                    </div>

                </div>
                <input
                    type="text"
                    placeholder="Buscador..."
                    className="buscador_sesion"
                    value={search}
                    onChange={searcher}
                />

                <div className="contListaJugadores">
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
                        <div className="contJugadores">
                            <table className="inventario">
                                <thead>
                                    <tr className="th_titulos">
                                        <th>ID</th>
                                        <th>Nombres</th>
                                        <th>Celular</th>
                                        <th>Cédula</th>
                                        <th>Ciudad/Estado</th>
                                        <th>Método Pago</th>
                                        <th>Comprobante</th>
                                        <th>Referencia</th>
                                        <th>Boletos</th>
                                        <th>Monto Total</th>
                                        <th>Fecha</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filterJugadores.map(jugador => (
                                        <tr key={`jugador-${jugador.id}`} className="fila-jugador">

                                            {/*ID*/}
                                            <td className="td_id">{jugador.id}</td>
                                            <td>
                                                {/*Nombres*/}
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
                                            </td>
                                            <td>
                                                {/* Celular*/}
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
                                            </td>
                                            <td>
                                                {/* Cedula */}
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
                                            </td>
                                            <td>
                                                {/* Ciudad-Pais */}
                                                {editingID === jugador.id ? (
                                                    <input
                                                        type="text"
                                                        className="input_edicion"
                                                        value={tempData.pais_estado}
                                                        onChange={(e) => setTempData({ ...tempData, pais_estado: e.target.value })}
                                                    />
                                                ) : (
                                                    jugador.pais_estado
                                                )}
                                            </td>
                                            <td>
                                                {/* Metodo de pago */}
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
                                            </td>
                                            <td>
                                                {/*Comporbante de Pago*/}
                                                {jugador.comprobante_url ? (
                                                    <div className="cont_comprobante_img">
                                                        <a
                                                            className="targe_comprobante"
                                                            href={jugador.comprobante_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <img src={zoom} className="zoom_comprobante" />
                                                            <img
                                                                className="comprobante_img"
                                                                src={jugador.comprobante_url}
                                                                alt="Comprobante"
                                                            />
                                                        </a>
                                                    </div>
                                                ) : (
                                                    "Sin Comprobante"
                                                )}
                                            </td>
                                            <td>
                                                {/* Referencia */}
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
                                            </td>
                                            <td>
                                                {editingID === jugador.id ? (
                                                    <input
                                                        type="text"
                                                        className="input_edicion"
                                                        value={tempData.boletos}
                                                        onChange={(e) => setTempData({ ...tempData, boletos: e.target.value })}
                                                    />
                                                ) : (
                                                    jugador.boletos && jugador.boletos.map((boleto, index) => {
                                                        const num = parseInt(boleto);

                                                        let numVisual;
                                                        if (modoSorteo === '100') {
                                                            if (num === 0) {
                                                                numVisual = '00';
                                                            } else if (num <= 99) {
                                                                numVisual = String(num).padStart(2, '0');
                                                            } else {
                                                                numVisual = boleto.padStart(3, '0');
                                                            }
                                                        } else {
                                                            numVisual = boleto.padStart(3, '0');
                                                        }

                                                        return (
                                                            <span key={`${jugador.id}-${index}`} className="fila_num">
                                                                {numVisual}
                                                            </span>
                                                        );
                                                    })
                                                )}
                                            </td>
                                            {/* Monto Total */}
                                            <td>
                                                <div className={jugador.estado_pago === 'pendiente' ? 'estado-pendiente' : 'estado-pagado'}>
                                                    {editingID === jugador.id ? (
                                                        <input
                                                            type="text"
                                                            className="input_edicion"
                                                            value={tempData.monto_total}
                                                            onChange={(e) => setTempData({ ...tempData, monto_total: e.target.value })}
                                                            placeholder="Monto"
                                                        />
                                                    ) : (
                                                        <div className="contPagos">
                                                            <strong>{formatoLatino(jugador.monto_total)}</strong>
                                                            <div className="contBtnPagos">
                                                                <button
                                                                    className="btn_pago_pendiente"
                                                                    onClick={() => togglePago(jugador.id, 'pendiente')}
                                                                >
                                                                    <img src={reloj} className="img_btn_pendiente" alt="Pendiente" />
                                                                </button>
                                                                <button
                                                                    className="btn_pago_pagado"
                                                                    onClick={() => togglePago(jugador.id, 'pagado')}
                                                                >
                                                                    <img src={cheque} className="img_btn_pagado" alt="Pagado" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                {/*Fecha y Hora*/}
                                                <strong>{new Date(jugador.fecha_registro).toLocaleDateString()}</strong>
                                                <br />
                                                {new Date(jugador.fecha_registro).toLocaleTimeString()}
                                            </td>
                                            <td>
                                                <div className="lista_btns">
                                                    {/**Botones: */}
                                                    {/**Borrar: */}
                                                    <button
                                                        className="btn_eliminar_sesion"
                                                        onClick={() => handleEliminar(jugador.id)}
                                                    >
                                                        <img src={borrar} alt="borrar" />
                                                    </button>
                                                    {/**Editar */}
                                                    {editingID === jugador.id ? (
                                                        <>
                                                            <button
                                                                className="btn_guardar_sesion"
                                                                onClick={() => handleguardarCambios(jugador.id)}
                                                            >
                                                                <img src={sav} alt="guardar" />
                                                            </button>

                                                            <button
                                                                className="btn_cancel_sesion"
                                                                onClick={handleCancelEditar}
                                                            >
                                                                <img src={error} alt="cancelar" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            className="btn_editar_sesion"
                                                            onClick={() => handleActivarEdicion(jugador)}
                                                        >
                                                            <img src={editar} alt="editar" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* {filterJugadores.map(jugador => (
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

                                        <div key={`${jugador.id}-monto`} className={`fila_monto ${jugador.estado_pago === 'pendiente' ? 'estado-pendiente' : 'estado-pagado'}`}>
                                            <dt>Monto Total:</dt>
                                            <dd>
                                                {editingID === jugador.id ? (
                                                    <input
                                                        type="text"
                                                        className="input_edicion"
                                                        value={tempData.monto_total}
                                                        onChange={(e) => setTempData({ ...tempData, monto_total: e.target.value })}
                                                        placeholder="Monto Total"
                                                    />
                                                ) : (
                                                    <div className="contPagos">
                                                        <strong>{formatoLatino(jugador.monto_total)}</strong>
                                                        <div className={`contBtnPagos`}>
                                                            <button
                                                                className="btn_pago_pendiente"
                                                                onClick={() => togglePago(jugador.id, 'pendiente')}
                                                            >
                                                                <img
                                                                    src={reloj}
                                                                    className="img_btn_pendiente"
                                                                />
                                                            </button>
                                                            <div className="contBotonesPago">
                                                                <button
                                                                    className="btn_pago_pagado"
                                                                    onClick={() => togglePago(jugador.id, 'pagado')}
                                                                >
                                                                    <img
                                                                        src={cheque}
                                                                        className="img_btn_pagado"
                                                                    />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
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
                            ))} */}
                        </div>
                    )}
                </div>
            </div >

        </>
    )
}
