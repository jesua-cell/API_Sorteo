import React, { useState, useRef, useEffect } from 'react'
import axios from "axios";
//Imagenes:
import zelle from '../assets/zelle.png'
import nequi from '../assets/nequi.png'
import bancolombia from '../assets/bancolombia.png'
import paypal from '../assets/paypal.png'
import pagomovil from '../assets/pagomovil.png'
import bancovenezuela from '../assets/bancovenezuela.png'
import pago_efectivo from '../assets/pago_efectivo.png'

import { createJugador, getUsedNumbers } from "../api/submit.server.js";
import { Modal } from '../components/Modal.jsx'
import SelectImage from "../components/SelectImage.jsx";
import toast from 'react-hot-toast';

export const Sorteo = () => {

    const [searchTerm, setSearchTerm] = useState(''); // Estados  de busquedad
    const [rawInput, setRawInput] = useState(''); // Estados de valor crudo
    const [selectNumbers, setSelectNumbers] = useState([]); // Estados del contenedor de los numeros seleccionados
    const [previewImage, setPreviewImage] = useState(null); // Estados del inputFile
    const [activeTab, setActiveTab] = useState(0); // Estados del contenedor de pestañas de los metodo de pago
    const listaRef = useRef(); // Lista de los numeros

    // Estados de la ventana Modal
    const [showModal, setShowModal] = useState(false);
    // const [modalMessList, setModalMessList] = useState('')
    const [nameJugador, setNameJugador] = useState('')
    const [numerosElegidos, setNumerosElegidos] = useState([])
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);

    //Estados para obtener los valores de la tabla valores_ves
    const [currentId, setCurrentId] = useState(null);
    const [valor, setValor] = useState(0);

    //Estados de los numeros usados
    const [usedNumbers, setUsedNumbers] = useState([]);

    // Estados para los mil o cien puestos
    const [modoSorteo, setModoSorteo] = useState('1000');

    //Funcion para seleccionar y desseleccionar
    const toggleNumberSelec = (numMostrado) => {

        const numAlmacenar = convFormAlmacemiento(numMostrado)
        setSelectNumbers(prev =>
            prev.includes(numAlmacenar)
                ? prev.filter(n => n !== numAlmacenar)
                : [...prev, numAlmacenar]
        );

        setRawInput('');
        setSearchTerm('');
    };

    //Funcion para bloquear los numeros elegidos
    useEffect(() => {
        const fetchUsedNumbers = async () => {
            try {
                const usedNumbers = await getUsedNumbers();
                setUsedNumbers(usedNumbers);
            } catch (error) {
                console.log("error obteniedo los numeros usados", error);
                setUsedNumbers([]);
            }
        };
        fetchUsedNumbers();
    }, [])

    // Actualizar periodicamente los numeros
    useEffect(() => {
        const interval = setInterval(()=>{
            getUsedNumbers().then(nums => setUsedNumbers(nums));
        }, 10000);
        return () => clearInterval(interval);
    }, [])
    
    //Filtro(input) para buscar numeros de la "lista"
    const handleSearch = (e) => {

        const inputValue = e.target.value;

        setRawInput(inputValue);

        const searchValue = inputValue === '' ? '' : String(inputValue).padStart(3, '0');

        // Solo 3 digitos y solo numeros
        const valueClean = inputValue.replace(/\D/g, '').slice(0, 3);

        setRawInput(valueClean);
        setSearchTerm(valueClean);

        setSearchTerm(searchValue);
        console.log(searchValue);

        // if (listaRef.current) {
        //     Array.from(listaRef.current.children).forEach(child => {
        //         const numero = child.textContent;
        //         child.style.display = searchValue === '' || numero.includes(searchValue) ? 'block' : 'none';
        //     })
        // };
    };

    const handleImageUpload = (file) => {
        if (file && file instanceof Blob) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result)
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        if (previewImage) URL.revokeObjectURL(previewImage);
        setPreviewImage(null);
        setSelectedFile(null);
    };


    const seleccionar = (index) => {
        setActiveTab(index);
    };

    const removeNumSelect = () => {
        setSelectNumbers([]);
    };


    // Obentener los valores y enviarlos al servidor
    const [nombre, setNombre] = useState('');
    const [celular, setCelular] = useState('')
    const [paisEstado, setPaisEstado] = useState('')
    const [referenciaPago, setReferenciaPago] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [cedula, setCedula] = useState('')

    useEffect(() => {
        let timer;
        if (showModal) {
            timer = setTimeout(() => setShowModal(false), 3000)
        }
        return () => clearTimeout(timer);
    }, [showModal])

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

    //Conversion del numero(VES)
    const normalizarNumero = (valorStr) => {

        if (!valorStr) return '';

        const sinPuntos = valorStr.replace(/\,/g, '');

        const conPuntoDecimal = sinPuntos.replace(',', '.');

        return conPuntoDecimal;
    };

    useEffect(() => {
        fetchValorVes();
    }, [])

    // Funcion para obtener el Modo al cargar
    useEffect(() => {

        const fetchModoSorteo = async () => {
            try {
                const response = await axios.get('http://localhost:3000/modo_sorteo');
                setModoSorteo(response.data.modo || '1000');
            } catch (error) {
                console.error("Error obteniendo la cantidad de los puestos", error);
            }
        };

        fetchModoSorteo();
    }, [])

    // Funcion para generar numeros para mostrar
    const triggerNum = () => {

        if (modoSorteo === '100') {
            return Array.from({ length: 100 }, (_, i) => {
                return i === 99 ? '00' : String(i + 1).padStart(2, '0');
            });
        } else {
            return Array.from({ length: 1000 }, (_, i) => {
                return String(i).padStart(3, '0')
            });
        };
    };

    // Funcion para convertir a formato de almacenamiento de tres digitos
    const convFormAlmacemiento = (numMostrado) => {

        const num = parseInt(numMostrado)

        if (modoSorteo === '100') {
            if (num === 0 || numMostrado === '00') return '000';
            return String(num).padStart(3, '0');
        }
        return numMostrado.padStart(3, '0');
    };

    // Funcion para convertir de almacenamiento a visualizacion
    const convFormVisual = (numAlmacenado) => {
        if (modoSorteo === '100') {
            const num = parseInt(numAlmacenado);
            if (num === 0) return '00';
            return num <= 99 ? String(num).padStart(2, '0') : numAlmacenado
        }
        return numAlmacenado.padStart(3, '0');
    };

    // Calculo total de boletos

    //Funcion para calcular el monto total de pago segun el metodo de pago
    const calcularMontoTotal = () => {

        let cantidadNumeros = selectNumbers.length; //Variable que almacena los numeros elegidos

        let montoTotal = '';
        switch (activeTab) {
            case 0: //Zelle
            case 3: //Paypal
                montoTotal = (cantidadNumeros * 9);
                break;
            case 1: //Nequi
            case 2: //Bancolombia
                montoTotal = (cantidadNumeros * 35000);
                break;
            case 4: //PagoMovil
            case 5: //Banco Venezuela
                montoTotal = (cantidadNumeros * valor);
                break;
            case 6:
                montoTotal = (cantidadNumeros * 35000);
                break;
            default:
                return montoTotal = 0;
        }
        return montoTotal;
    };

    //Funcionar para enviar datos a la BD
    const handleLogin = async (e) => {

        e.preventDefault();

        const metodosPago = ["Zelle", "Nequi", "Bancolombia", "PayPal", "PagoMovil", "Banco Venezuela", "Pago Efectivo"];

        const metodoPago = metodosPago[activeTab] || "Desconocido";

        const montoTotal = calcularMontoTotal();

        if (selectNumbers.length === 0) {
            setModalMessage('Selecciona un numero');
            setIsError(true)
            return setShowModal(true);
        };

        try {

            const formData = new FormData();
            formData.append("nombres_apellidos", nombre);
            formData.append("celular", celular);
            formData.append("cedula", cedula);
            formData.append("pais_estado", paisEstado);
            formData.append("referenciaPago", referenciaPago);
            formData.append("metodo_pago", metodoPago);
            formData.append("comprobante_pago", selectedFile);
            formData.append("numeros", JSON.stringify(selectNumbers));
            formData.append("monto_total", montoTotal);

            const response = await createJugador(formData);

            if (response.success) {

                //Refrescar numeros usados
                const refreshUsedNumbers = await getUsedNumbers();
                setUsedNumbers(refreshUsedNumbers);

                //Ventana modal de registro exitodo de jugador
                setModalMessage("Registro Exitoso!");
                setNameJugador(nombre);
                setNumerosElegidos([...selectNumbers]);
                resetForm()
                setIsError(false);
                setShowModal(true)
            };

        } catch (error) {
            console.error("Error en el envio", error);
        };

        console.log({
            jugador: {
                username: nombre,
                celular: celular,
                pais_estado: paisEstado,
                referenciaPago: referenciaPago,
                numerosBoletos: selectNumbers,
                metodo_pago: metodoPago,
                comprobante_pago: selectedFile,
                monto_total: montoTotal,
                cedula: cedula
            }
        });
    };

    const resetForm = () => {
        setNombre('');
        setCelular('');
        setCedula('');
        setPaisEstado('');
        setReferenciaPago('');
        setSelectedFile(null);
        setPreviewImage(null);
        setSelectNumbers([]);
    };

    return (
        <>
            <div className='contSorteo'>
                <div className='contenidoSorteo'>

                    <h1 className='tituloSorteo'>Lista de Boletos</h1>

                    <h3>Numeros de Boletos: </h3>

                    <input
                        type="number"
                        placeholder='Buscar'
                        className='btnBuscar'
                        value={rawInput}
                        onChange={handleSearch}
                        min="1"
                        max="1000"
                        onWheel={(e) => e.target.blur()}
                    />



                    <div className='numUsedCount'>
                        <label className='usedNumSorteo'>Numeros disponibles: {modoSorteo === '100' ? 100 : 1000 - usedNumbers.length}</label>
                    </div>
                    <div className="lista" ref={listaRef}>
                        {triggerNum().map((numMostrado) => {
                            const numAlmacenar = convFormAlmacemiento(numMostrado);
                            const isUsed = usedNumbers.includes(convFormVisual(numAlmacenar));
                            const isSelected = selectNumbers.includes(numAlmacenar);
                            const isVisible =
                                searchTerm === '' ||
                                numMostrado.includes(searchTerm) ||
                                numMostrado.replace(/^0+/, '').includes(searchTerm);

                            return (
                                <div
                                    className={`listaNumero ${isUsed ? 'used' : ''} ${isSelected ? 'selected' : ''} ${!isVisible ? 'hidden' : ''}`}
                                    key={numMostrado}
                                    data-used={isUsed}
                                    onClick={() => !isUsed && toggleNumberSelec(numMostrado)}
                                >
                                    {numMostrado}
                                </div>
                            );
                        })}
                    </div>

                    <div className='numerosSeleccionados'>
                        <div className='contentSeleccionados'>
                            <h4>Numeros Seleccionados:</h4>
                            <h5>{selectNumbers.length}</h5>

                        </div>
                        {selectNumbers.length > 0 && (
                            <button
                                onClick={removeNumSelect}
                                className='btnRemoveNum'
                            >
                                x
                            </button>
                        )}

                        <div className='btnSeleccionado'>
                            <div className="num_select">
                                {selectNumbers.map((numero, index) => (
                                    <span
                                        key={index}
                                        className='num-item'
                                        onClick={() => toggleNumberSelec(numero)}
                                    >
                                        {convFormVisual(numero)}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="precioNumbers">
                            {`COP: ${(selectNumbers.length * 35000).toLocaleString('es-CO')}`}
                        </div>
                    </div>
                    {/* //TODO agregarle una animacion al contenedor cuando haya numeros */}

                    <form className='formDatos'>
                        <label className='labelForm'>Nombres y Apellidos:</label>
                        <input
                            type="text"
                            placeholder='Nombres y Apellidos'
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />

                        <label className='labelForm'>Celular:</label>
                        <input
                            type="text"
                            placeholder='Celular'
                            value={celular}
                            onChange={(e) => setCelular(e.target.value)}
                            required
                        />

                        <label className='labelForm'>Cédula:</label>
                        <input
                            type="number"
                            placeholder='Cédula'
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            required
                        />

                        <label className='labelForm'>País o Estado:</label>
                        <input
                            type="text"
                            placeholder='País o Estados'
                            value={paisEstado}
                            onChange={(e) => setPaisEstado(e.target.value)}
                            required
                        />

                        <label className='labelForm'>Referencia de Pago:</label>
                        <input
                            type="text"
                            value={referenciaPago}
                            placeholder='(Ulitmos cuatro digítos)'
                            onChange={(e) => setReferenciaPago(e.target.value)}
                            required
                        />

                        <span className='titulo_medioPago'>Modos de Pago:</span>
                        <span className='span_medioPago'>Elige una opcion</span>
                        <ul className="tabs">
                            <li className={activeTab == 0 ? "active" : ""} onClick={() => seleccionar(0)}>
                                <img className='imgPago' src={zelle} alt="Zelle" />
                            </li>
                            <li className={activeTab == 1 ? "active" : ""} onClick={() => seleccionar(1)}>
                                <img className='imgPago' src={nequi} alt="Nequi" />
                            </li>
                            <li className={activeTab == 2 ? "active" : ""} onClick={() => seleccionar(2)}>
                                <img className='imgPago' src={bancolombia} alt="Bancolombia" />
                            </li>
                            <li className={activeTab == 3 ? "active" : ""} onClick={() => seleccionar(3)}>
                                <img className='imgPago' src={paypal} alt="PayPal" />
                            </li>
                            <li className={activeTab == 4 ? "active" : ""} onClick={() => seleccionar(4)}>
                                <img className='imgPago' src={pagomovil} alt="Pagomovil" />
                            </li>
                            <li className={activeTab == 5 ? "active" : ""} onClick={() => seleccionar(5)}>
                                <img className='imgPago' src={bancovenezuela} alt="BancoVenezuela" />
                            </li>
                            <li className={activeTab == 6 ? "active" : ""} onClick={() => seleccionar(6)}>
                                <img className='imgPago' src={pago_efectivo} alt="PagoEfectivo" />
                            </li>
                            <span className='indicador'></span>
                        </ul>

                        <div className="tab_content">
                            {activeTab === 0 &&
                                <div className="modoPago">
                                    <h4 className='nombrePago'>Zelle</h4>
                                    <h4 className='cuenta'>Cuenta:</h4>
                                    <h4 className='numeroCuenta'>6153625428</h4>
                                    <h4 className='titular'>Titular:</h4>
                                    <h4 className='remitente'>Francisco Javier Caicedo</h4>
                                    <div className="preciosConversionNumbers">
                                        <h4>Pago:</h4>
                                        {`$${(selectNumbers.length * 9).toLocaleString('es-US')}`}
                                    </div>
                                </div>
                            }
                            {activeTab === 1 &&
                                <div className="modoPago">
                                    <h4 className='nombrePago'>Nequi</h4>
                                    <h4 className='cuenta'>Cuenta:</h4>
                                    <h4 className='numeroCuenta'>3223223329</h4>
                                    <h4 className='titular'>Titular:</h4>
                                    <h4 className='remitente'>Maria Alejandra Garcia</h4>
                                    <div className="preciosConversionNumbers">
                                        <h4>Pago:</h4>
                                        {`$${(selectNumbers.length * 35000).toLocaleString('es-CO')}`}
                                    </div>
                                </div>
                            }
                            {activeTab === 2 &&
                                <div className="modoPago">
                                    <h4 className='nombrePago'>Bancolombia</h4>
                                    <h4 className='cuenta'>Cuenta Ahorro:</h4>
                                    <h4 className='numeroCuenta'>82000002819</h4>
                                    <h4 className='titular'>Titular:</h4>
                                    <h4 className='remitente'>Vanessa Rincón</h4>
                                    <div className="preciosConversionNumbers">
                                        <h4>Pago:</h4>
                                        {`$${(selectNumbers.length * 35000).toLocaleString('es-CO')}`}
                                    </div>
                                </div>
                            }
                            {activeTab === 3 &&
                                <div className="modoPago">
                                    <h4 className='nombrePago'>PayPal</h4>
                                    <h4 className='cuenta'>Cuenta:</h4>
                                    <h4 className='numeroCuenta'>magc290598@gmail.com</h4>
                                    <h4 className='titular'>Titular:</h4>
                                    <h4 className='remitente'>María Alejandra Garcia</h4>
                                    <div className="preciosConversionNumbers">
                                        <h4>Pago:</h4>
                                        {`$${selectNumbers.length * 9}`}
                                    </div>
                                </div>
                            }{activeTab === 4 &&
                                <div className="modoPago">
                                    <h4 className='nombrePago'>Pagomovil</h4>
                                    <h4 className='cuenta'>Cuenta:</h4>
                                    <h4 className='numeroCuenta'>04147014646</h4>
                                    <h4 className='titular'>Titular:</h4>
                                    <h4 className='remitente'>Vanessa Rincón</h4>
                                    <h4 className='remitente'>Cedúla:</h4>
                                    <h4 className='remitente'>21453387</h4>
                                    <div className="preciosConversionNumbers">
                                        <h4>Pago:</h4>
                                        {`$${selectNumbers.length * normalizarNumero(valor)}`}
                                    </div>
                                </div>
                            }
                            {activeTab === 5 &&
                                <div className="modoPago">
                                    <h4 className='nombrePago'>Banco de Venezuela</h4>
                                    <h4 className='cuenta'>Cuenta:</h4>
                                    <h4 className='numeroCuenta'>21453387</h4>
                                    <h4 className='titular'>Titular:</h4>
                                    <h4 className='remitente'>Vanessa Rincón</h4>
                                    <div className="preciosConversionNumbers">
                                        <h4>Pago:</h4>
                                        {`$${selectNumbers.length * normalizarNumero(valor)}`}
                                    </div>
                                </div>
                            }
                            {activeTab === 6 &&
                                <div className="modoPago">
                                    <h4 className='nombrePago'>Pago en Efectivo</h4>

                                    <div className="preciosConversionNumbers">
                                        <h4>Pago:</h4>
                                        {`$${(selectNumbers.length * 35000).toLocaleString('es-CO')}`}
                                    </div>
                                </div>
                            }
                        </div>

                        <div className="contComprobantePago">
                            <label className='labelForm'>Comprobante de Pago:</label>
                            <SelectImage
                                previewImage={previewImage}
                                onFileChange={handleImageUpload}
                                onRemoveImage={removeImage}
                                buttonLabel='Subir: Foto / Captura de Pantalla'
                            />
                        </div>
                        <input
                            type="submit"
                            className='btnEnviar'
                            onClick={handleLogin}
                        />
                    </form>

                </div>

            </div>

            {showModal && (
                <Modal
                    nombre={nameJugador}
                    numerosBoletos={numerosElegidos.join(', ')}
                    message={modalMessage}
                    isError={isError}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    )
}

/**
 * *TODO: Colocar en un contenedor la cantidad de numeros seleccionados.
 * *TODO: Configurar el precio total por cada numero elegido dependiendo la modena de la entidad de pago
 * *TODO: Considerar guardar el total del pago en un string en el servidor
 * *TODO: Colocar un contenedor para que el usuario verifique su juego
 * TODO: Validación de formulario y feedback
 * //* TODO: Sistema de paginación para los números
 * //* TODO: Persistencia en LocalStorage
 */