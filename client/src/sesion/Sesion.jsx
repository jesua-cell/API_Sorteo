import { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
//imagenes
import borrar from "../assets/borrar.png";
import editar from "../assets/editar.png";
import sav from "../assets/sav.png";
import error from "../assets/error.png";
import reloj from "../assets/reloj.png";
import cheque from "../assets/cheque.png";
import buscar from "../assets/buscar.png";
import zoom from "../assets/zoom.png";
import users from "../assets/users.png";
import puestos from "../assets/puestos.png";
import lupa from "../assets/lupa.png";
import efectivo from "../assets/efectivo.png";

import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import Select from 'react-select'

export const Sesion = () => {

    const [jugadores, setJugadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminName, setAdminName] = useState('');

    //Estados para el filtro de busquedad
    const [search, setSearch] = useState("");
    const [filterJugadores, setFilterJugadores] = useState([]);
    const [searchTrigger, setSearchTrigger] = useState(false);

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
    // const [pagoEstados, setPagoEstados] = useState({});

    // Estados del modo de Sorteo
    const [modoSorteo, setModoSorteo] = useState('1000');

    // estados de la paginacion
    const [currentPage, setCurrentPage] = useState(0);

    // estados para el modal del modo de sorteo
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [pendingMode, setPendingMode] = useState(null);

    //estados para monto abonado
    const [abonos, setAbonos] = useState({});

    const itemsPerPage = 5;

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

    // Obtner comprobantes
    // useEffect(() => {
    //     const fetchComprobantes = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:3000//comprobante/:id')
    //         } catch (error) {
    //             console.error("Error en la obtencion del comprobante", error);
    //         }
    //     };

    //     fetchComprobantes();
    // }, []);


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

    // Funcion del filtro de busquedad
    const fechtFilterData = useCallback(async (searchTerm) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(
                `http://localhost:3000/jugadores`,
                {
                    params: { search: searchTerm },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setFilterJugadores(response.data);
            setCurrentPage(0);
        } catch (error) {
            console.error("Error en la busquedad", error);
        } finally {
            setLoading(false);
        };

    }, [jugadores]);

    // Funcion del boton de buscar
    const handleSearch = () => {
        if (!search.trim()) {
            setFilterJugadores(jugadores);
        } else {
            fechtFilterData(search);
        };
    };

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
            estado_pago: jugador.estado_pago,
            monto_abonado: jugador.monto_abonado || 0
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
                            : [],
                        monto_abonado: tempData.monto_abonado || 0
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
            setFilterJugadores(prev => prev.map(j =>
                j.id === id ? { ...j, estado_pago: tempData.estado_pago } : j
            ));

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

    //metodo de abonar
    const handleAbonar = async (jugadorId) => {

        // convertir y limpiar el input
        const montoInput = abonos[jugadorId] || '';
        const montoAbono = parseFloat(montoInput.replace(',', '.'));

        //validaciones
        if (isNaN(montoAbono)) {
            toast.error("Ingrese un valor numerico valido")
        };

        if (montoAbono <= 0) {
            toast.error("El monto debe ser mayor a cero");
            return;
        };

        const jugador = jugadores.find(j => j.id === jugadorId);
        const pendienteActual = parseFloat(jugador.monto_total) - parseFloat(jugador.monto_abonado || 0);

        if (montoAbono > pendienteActual) {
            toast.error(`Monto Completado`);
            return;
        };

        try {
            const response = await axios.put(
                `http://localhost:3000/abonar/${jugadorId}`,
                { monto_abonado: montoAbono }
            );

            const nuevoAbono = parseFloat(jugador.monto_abonado || 0) + montoAbono;

            //actualizar estado local
            const updateJugadores = jugadores.map(j =>
                j.id === jugadorId ? {
                    ...j,
                    monto_abonado: nuevoAbono,
                    estado_pago: nuevoAbono >= j.monto_total ? 'pagado' : 'pendiente'
                } : j
            );

            //actualizar estados
            setJugadores(updateJugadores);
            setFilterJugadores(updateJugadores);
            setAbonos({ ...abonos, [jugadorId]: '' })

            // Limpiar input
            setAbonos(prev => ({ ...prev, [jugadorId]: '' }));

            toast.success('Abono registrado!', {
                icon: '✅',
                style: {
                    borderRadius: '10px',
                    background: '#fff',
                    color: '#000',
                }
            });

        } catch (error) {
            alert(error.response?.data?.error || "Error al registrar abono");
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

            setFilterJugadores(prev => prev.map(j =>
                j.id === jugadorId ? { ...j, estado_pago: nuevoEstado } : j
            ));

            if (editingID === jugadorId) {
                setTempData(prev => ({
                    ...prev,
                    estado_pago: nuevoEstado
                }));
            };

        } catch (error) {
            console.error('Error en la actualizacion de datos del estado de pago', error);
        }
    };

    const actualizarModoSorteo = async (modo) => {
        // si esta seleccionado, no hacer nada
        if (modoSorteo === modo) return;

        setPendingMode(modo);
        setShowModalConfirm(true);
    };

    const confirmChange = async () => {

        if (!pendingMode) return;

        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put(
                'http://localhost:3000/modo_sorteo',
                { pendingMode },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setModoSorteo(pendingMode);
            toast(`${pendingMode} Puestos`,
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
        } finally {
            setShowModalConfirm(false);
            setPendingMode(null);
        };
    };


    const formatoLatino = (numero) => {

        // Si es null/undefined o no es número, retornar '0,00'
        if (numero === null || numero === undefined || isNaN(numero)) {
            return '0,00';
        }

        const num = typeof numero === 'string' ? parseFloat(numero) : numero;

        return num.toLocaleString('es-VE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    };


    if (loading) {
        return <div className="contFetchJugadores"><h4>Cargando Jugadores...</h4></div>
    };

    if (!isAuthenticated) {
        return <div><h4>Verificando Sesion...</h4></div>
    }

    const totalBoletos = jugadores.flatMap(j => j.boletos || []).length;

    // Manejo de la paginacion
    const offset = currentPage * itemsPerPage;
    const currentItems = filterJugadores.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filterJugadores.length / itemsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected)
    };

    //TODO* Agregar un nuevo campo de pago en efectivo
    //TODO* Colocar un boton de "pendiente" o "pago hecho" en el campo de monto total
    //TODO* Crear una funcion que muestre 100 o 1000 numeros en el archivo Sorteo.jsx
    //TODO* Agregar un componente de paginacion
    //TODO* Configurar el filtro de busquedad para por medio de una funcion, busque los datos desde el back, y los muestre en el archivo


    return (
        <>

            <Toaster
                position="top-center"
                reverseOrder={false}
            />

            <div className="cont_admins">
                <h2 className="title_inventario">Inventario</h2>

                {/* Informacion del Sorteo */}
                <div className="contInventario">
                    <div className="contInfoSorteo">
                        <div className="logoUsers">
                            <h3 className="title_infoSorteo">Jugadores:</h3>
                            <img src={users} className="img_users" />
                            <p className="infoSorteoText"><strong>{jugadores.length}</strong> de 1000</p>
                        </div>
                        <div className="dataInventario">
                            <p className="infoSorteoText">Jugadores Restantes: <strong>{1000 - jugadores.length}</strong></p>
                        </div>
                    </div>

                    <div className="contInfoSorteo">
                        <div className="logoPuestos">
                            <h3 className="title_infoSorteo">Puestos:</h3>
                            <img src={puestos} className="img_puestos" />
                            <p className="infoSorteoText"><strong>{totalBoletos}</strong> de 1000</p>
                        </div>
                        <div className="dataInventario">
                            <p className="infoSorteoText">Puestos disponibles: <strong>{Math.max(0, 1000 - totalBoletos)}</strong></p>
                        </div>
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
                            className={`btn_countPub_mil ${modoSorteo === '1000' ? 'active' : ''}`}
                            onClick={() => actualizarModoSorteo('1000')}
                        >1000
                        </button>

                        <button
                            className={`btn_countPub_cien ${modoSorteo === '100' ? 'active' : ''}`}
                            onClick={() => actualizarModoSorteo('100')}
                        >100
                        </button>
                    </div>

                    <div className="contDeleteAll">
                        <div className="box_btnDelete">
                            <h3 className="h3_DeleteAll">Eliminar todos todos los jugadores</h3>
                            <button
                                className="img_eliminar_all"
                            >
                                <img src={borrar} alt="borrar" />
                            </button>
                        </div>
                    </div>

                    {showModalConfirm && (
                        <div className="modal_overlay">
                            <div className="modal_confirm">
                                <h3>Confirmar Cambio</h3>
                                <p>
                                    ¿Estas seguro de cambiar a <strong>{pendingMode}</strong> puestos?
                                    <br />
                                    Se reiniciaran todos los numeros del sorteo!
                                </p>
                                <div className="modal_button">
                                    <button
                                        className="modal_cancel_btn"
                                        onClick={() => setShowModalConfirm(false)}
                                    >
                                        cancelar
                                    </button>
                                    <button
                                        className="modal_confirm_btn"
                                        onClick={confirmChange}
                                    >
                                        Confirmar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                <div className="contBuscador">
                    <input
                        type="text"
                        placeholder="Buscador..."
                        className="buscador_sesion"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        onClick={handleSearch}
                        className="btn_lupa"
                    >
                        <img src={lupa} />
                    </button>
                </div>

                {/** Escritoio */}
                <div className="contListaJugadores">
                    {filterJugadores.length === 0 ? (
                        <div className="no_result">
                            <p className="text_no_result">No existe el jugador con estos caracteres:  <span>"{search}"</span></p>
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
                                        <th>Monto Abonado</th>
                                        <th>Monto Pendiente</th>
                                        <th>Abono del Monto</th>
                                        <th>Fecha</th>
                                        <th style={{ width: '130px' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map(jugador => (
                                        <tr key={`jugador-${jugador.id}`} className="fila-jugador">

                                            {/*ID*/}
                                            <td className="td_id">{jugador.id}</td>
                                            <td>
                                                {/*Nombres*/}
                                                {editingID === jugador.id ? (
                                                    <textarea
                                                        type="text"
                                                        className="textArea_puestos textArea_nombres"
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
                                                    <textarea
                                                        type="text"
                                                        className="textArea_puestos textarea_celular"
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
                                                    <textarea
                                                        type="text"
                                                        className="textArea_puestos textarea_cedula"
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
                                                    <textarea
                                                        type="text"
                                                        className="textArea_puestos textarea_ciudad"
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
                                                    <textarea
                                                        type="text"
                                                        className="textArea_puestos textarea_metodoPago"
                                                        value={tempData.metodo_pago}
                                                        onChange={(e) => setTempData({ ...tempData, metodo_pago: e.target.value })}
                                                    />
                                                ) : (
                                                    jugador.metodo_pago
                                                )}
                                            </td>
                                            {/* Comprobante */}
                                            <td>
                                                {jugador.comprobante_id ? (
                                                    <div className="cont_comprobante_img">
                                                        <a
                                                            href={`http://localhost:3000/comprobante/${jugador.id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <img
                                                                src={`http://localhost:3000/comprobante/${jugador.id}`}
                                                                alt="Comprobante"
                                                                className="comprobante_img"
                                                            />
                                                        </a>
                                                    </div>
                                                ) : (
                                                    "Sin Comprobante"
                                                )}
                                            </td>
                                            <td className="td_referencia">
                                                {/* Referencia */}
                                                {editingID === jugador.id ? (
                                                    <textarea
                                                        type="text"
                                                        className="textArea_puestos textarea_referencia"
                                                        value={tempData.referenciaPago}
                                                        onChange={(e) => setTempData({ ...tempData, referenciaPago: e.target.value })}
                                                    />
                                                ) : (
                                                    jugador.referenciaPago
                                                )}
                                            </td>
                                            <td className="td_boletos">
                                                {editingID === jugador.id ? (
                                                    <textarea
                                                        type="text"
                                                        className="textArea_puestos textarea_boletos"
                                                        value={tempData.boletos}
                                                        onChange={(e) => setTempData({ ...tempData, boletos: e.target.value })}
                                                    />
                                                ) : (
                                                    <div className="cont_boletos">
                                                        {jugador.boletos && jugador.boletos.map((boleto, index) => {
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
                                                                <div key={`${jugador.id}-${index}`} className="fila_num">
                                                                    {numVisual}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </td>
                                            {/* Monto Total */}
                                            <td>
                                                <div className={jugador.estado_pago === 'pendiente' ? 'estado-pendiente' : 'estado-pagado'}>
                                                    <div className="contPagos">
                                                        <div className="contBtnPagos">
                                                            <strong>{formatoLatino(jugador.monto_total)}</strong>
                                                            <div className="btn_pagos">
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
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Monto Pendiente */}
                                            <td>
                                                {editingID === jugador.id ? (
                                                    <textarea
                                                        type="text"
                                                        className="textArea_puestos textarea_pendiente"
                                                        value={tempData.monto_abonado}
                                                        onChange={(e) => setTempData({ ...tempData, monto_abonado: e.target.value })}
                                                        placeholder="Monto"
                                                    />
                                                ) : (

                                                    <strong className="monto_res_p">{formatoLatino(jugador.monto_abonado || 0)}</strong>
                                                )}
                                            </td>

                                            {/* Monto pendiente */}
                                            <td>
                                                {
                                                    (jugador.monto_total - jugador.monto_abonado) === 0
                                                        ? <strong>Pagado</strong>
                                                        : <strong className="txt_montoAbonado">
                                                            {formatoLatino(jugador.monto_total - jugador.monto_abonado)}
                                                        </strong>
                                                }
                                            </td>

                                            {/* Abono y manejo */}
                                            <td>
                                                <div className="cont_btnMonto">
                                                    <textarea
                                                        type="number"
                                                        className="textArea_puestos textarea_abonoMonto"
                                                        min="0.01"
                                                        max="0.01"
                                                        value={abonos[jugador.id] || ''}
                                                        onChange={(e) => setAbonos({
                                                            ...abonos,
                                                            [jugador.id]: e.target.value
                                                        })}
                                                        placeholder="Monto a abonar"
                                                    />

                                                    <button
                                                        className="btn_abonarMonto"
                                                        onClick={() => handleAbonar(jugador.id)} >
                                                        <img src={efectivo} />
                                                    </button>
                                                </div>
                                            </td>

                                            <td className="td_fecha">
                                                {/*Fecha y Hora*/}
                                                <strong>{new Date(jugador.fecha_registro).toLocaleDateString()}</strong>
                                                <br />
                                                <strong>{new Date(jugador.fecha_registro).toLocaleTimeString()}</strong>
                                            </td>

                                            <td>
                                                <div className="lista_btns">
                                                    {/**Botones: */}

                                                    {/**Borrar: */}
                                                    {editingID !== jugador.id && (
                                                        <button
                                                            className="btn_eliminar_sesion"
                                                            onClick={() => handleEliminar(jugador.id)}
                                                        >
                                                            <img src={borrar} alt="borrar" />
                                                        </button>
                                                    )}

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

                            {/** Movil */}
                            {currentItems.map((jugador) => (
                                <div key={`jugador-mobile-${jugador.id}`} className="table_jugadores">
                                    {/* ID */}
                                    <div className="fila">
                                        <div className="columna">
                                            <div className="header">ID</div>
                                            <div className="contenido">
                                                {jugador.id}
                                            </div>
                                        </div>
                                    </div>

                                    {/*Nombre */}
                                    <div className="fila">
                                        <div className="columna">
                                            <div className="header">Nombre</div>
                                            <div className="contenido">
                                                {editingID === jugador.id ? (
                                                    <input
                                                        type="text"
                                                        className="input_edicion_mb"
                                                        value={tempData.nombres_apellidos}
                                                        onChange={(e) => setTempData({ ...tempData, nombres_apellidos: e.target.value })}
                                                    />
                                                ) : (
                                                    jugador.nombres_apellidos
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/*Celular */}
                                    <div className="fila">
                                        <div className="columna">
                                            <div className="header">Celular</div>
                                            <div className="contenido">
                                                {editingID === jugador.id ? (
                                                    <input
                                                        type="text"
                                                        className="input_edicion_mb"
                                                        value={tempData.celular}
                                                        onChange={(e) => setTempData({ ...tempData, celular: e.target.value })}
                                                    />
                                                ) : (
                                                    jugador.celular
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/*Cedula */}
                                    <div className="fila">
                                        <div className="columna">
                                            <div className="header">Cedula</div>
                                            <div className="contenido">
                                                {editingID === jugador.id ? (
                                                    <input
                                                        type="text"
                                                        className="input_edicion_mb"
                                                        value={tempData.cedula}
                                                        onChange={(e) => setTempData({ ...tempData, cedula: e.target.value })}
                                                    />
                                                ) : (
                                                    jugador.cedula
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/*Ciudad-Estado-Pais */}
                                    <div className="fila">
                                        <div className="columna">
                                            <div className="header">Ciudad - Pais</div>
                                            <div className="contenido">
                                                {editingID === jugador.id ? (
                                                    <input
                                                        type="text"
                                                        className="input_edicion_mb"
                                                        value={tempData.pais_estado}
                                                        onChange={(e) => setTempData({ ...tempData, pais_estado: e.target.value })}
                                                    />
                                                ) : (
                                                    jugador.pais_estado
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/*Metodo de Pago */}
                                    <div className="fila">
                                        <div className="columna">
                                            <div className="header">Metodo de Pago</div>
                                            <div className="contenido">
                                                {editingID === jugador.id ? (
                                                    <input
                                                        type="text"
                                                        className="input_edicion_mb"
                                                        value={tempData.metodo_pago}
                                                        onChange={(e) => setTempData({ ...tempData, metodo_pago: e.target.value })}
                                                    />
                                                ) : (
                                                    jugador.metodo_pago
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Comprobante */}
                                    <div className="fila">
                                        <div className="columna">
                                            <div className="header">Comprobante</div>
                                            <div className="contenido">
                                                {jugador.comprobante_id ? (
                                                    <div className="cont_comprobante_img">
                                                        <a
                                                            href={`http://localhost:3000/comprobante/${jugador.id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <img
                                                                src={`http://localhost:3000/comprobante/${jugador.id}`}
                                                                alt="Comprobante"
                                                                className="comprobante_img"
                                                            />
                                                        </a>
                                                    </div>
                                                ) : (
                                                    "Sin Comprobante"
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/*Referencia */}
                                    <div className="fila">
                                        <div className="columna">
                                            <div className="header">Referencia</div>
                                            <div className="contenido">
                                                {editingID === jugador.id ? (
                                                    <input
                                                        type="text"
                                                        className="input_edicion_mb"
                                                        value={tempData.referenciaPago}
                                                        onChange={(e) => setTempData({ ...tempData, referenciaPago: e.target.value })}
                                                    />
                                                ) : (
                                                    jugador.referenciaPago
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Boletos */}
                                    <div className="fila">
                                        <div className="columna">
                                            <div className="header">Boleto</div>
                                            <div className="contenido">
                                                {editingID === jugador.id ? (
                                                    <textarea
                                                        type="text"
                                                        className="textArea_puestos textArea_boletos_mb"
                                                        value={tempData.boletos}
                                                        onChange={(e) => setTempData({ ...tempData, boletos: e.target.value })}
                                                    />
                                                ) : (
                                                    jugador.boletos.map((boleto, index) => {
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
                                                            <div key={`${jugador.id}-${index}`} className="fila_num">
                                                                {numVisual}
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Monto Total */}
                                    <div className="fila">
                                        <div className="columna">
                                            <div className="header">Monto Total</div>
                                            <div className="contenido" style={{ padding: "0px" }}>
                                                {editingID === jugador.id ? (
                                                    <input
                                                        type="text"
                                                        className="input_edicion"
                                                        value={tempData.monto_total}
                                                        onChange={(e) => setTempData({ ...tempData, monto_total: e.target.value })}
                                                    />
                                                ) : (
                                                    <div className={jugador.estado_pago === 'pendiente' ? 'estado-pendiente' : 'estado-pagado'}>
                                                        <strong>{formatoLatino(jugador.monto_total)}</strong>
                                                        <div className="contBtnPagos">
                                                            <button
                                                                onClick={() => togglePago(jugador.id, 'pendiente')}
                                                                className="btn_pago_pendiente"
                                                            >
                                                                <img src={reloj} alt="Pendiente" className="img_btn_mb" />
                                                            </button>
                                                            <button
                                                                onClick={() => togglePago(jugador.id, 'pagado')}
                                                                className="btn_pago_pagado"
                                                            >
                                                                <img src={cheque} alt="Pagado" className="img_btn_mb" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Monto Restante */}
                                    <div className="fila">
                                        <div className="columna">
                                            <div className="header">Monto Restante</div>
                                            <div className="contenido">
                                                {editingID === jugador.id ? (
                                                    <textarea
                                                        type="text"
                                                        className="textArea_puestos textarea_pendiente"
                                                        value={tempData.monto_abonado}
                                                        onChange={(e) => setTempData({ ...tempData, monto_abonado: e.target.value })}
                                                        placeholder="Monto"
                                                    />
                                                ) : (

                                                    <strong className="monto_res_p">{formatoLatino(jugador.monto_abonado || 0)}</strong>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Monto pendiente */}
                                    <div className="fila">
                                        <div className="columna">
                                            <div className="header">Monto Pendiente</div>
                                            <div className="contenido">
                                                {
                                                    (jugador.monto_total - jugador.monto_abonado) === 0
                                                        ? <strong>Pagado</strong>
                                                        : <strong className="txt_montoAbonado">
                                                            {formatoLatino(jugador.monto_total - jugador.monto_abonado)}
                                                        </strong>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    {/* Abono y manejo */}
                                    <div className="fila">
                                        <div className="columna">
                                            <div className="header">Abono del Monto</div>
                                            <div className="contenido">
                                                <div className="cont_btnMonto">
                                                    <textarea
                                                        type="number"
                                                        className="textArea_puestos textarea_abonoMonto"
                                                        min="0.01"
                                                        max="0.01"
                                                        value={abonos[jugador.id] || ''}
                                                        onChange={(e) => setAbonos({
                                                            ...abonos,
                                                            [jugador.id]: e.target.value
                                                        })}
                                                        placeholder="Monto a abonar"
                                                    />

                                                    <button
                                                        className="btn_abonarMonto"
                                                        onClick={() => handleAbonar(jugador.id)} >
                                                        <img src={efectivo} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/*Fecha */}
                                    <div className="fila" >
                                        <div className="columna">
                                            <div className="header">Fecha</div>
                                            <div className="contenido">
                                                <div className="fecha_hora_mbl">
                                                    <strong>{new Date(jugador.fecha_registro).toLocaleDateString()}</strong>
                                                    <br />
                                                    {new Date(jugador.fecha_registro).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/**Acciones */}
                                    <div className="fila">
                                        <div className="columna">
                                            <div className="header">Acciones</div>
                                            <div className="contenido">
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
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))}

                            {pageCount > 1 && (
                                <ReactPaginate
                                    breakLabel="..."
                                    nextLabel="siguiente >"
                                    previousLabel="< anterior"
                                    onPageChange={handlePageClick}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    pageCount={pageCount}
                                    renderOnZeroPageCount={null}
                                    containerClassName={"pagination"}
                                    activeClassName={"active"}
                                    forcePage={currentPage}
                                />
                            )}
                        </div>
                    )}
                </div >
            </div >

        </>
    )
}
