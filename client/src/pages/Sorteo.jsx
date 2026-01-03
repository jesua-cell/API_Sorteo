import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useVirtualizer } from "@tanstack/react-virtual";
import axios, { toFormData } from "axios";
//Imagenes:
import zelle from '../assets/zelle.png'
import nequi from '../assets/nequi.png'
import bancolombia from '../assets/bancolombia.png'
import paypal from '../assets/paypal.png'
import pagomovil from '../assets/pagomovil.png'
import bancovenezuela from '../assets/bancovenezuela.png'
import pago_efectivo from '../assets/pago_efectivo.png'
import carroToyota from '../assets/carroToyota.webp'

import { createJugador, getUsedNumbers } from "../api/submit.server.js";
import { Modal } from '../components/Modal.jsx'
import SelectImage from "../components/SelectImage.jsx";
import { Toaster, toast } from "react-hot-toast";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

  // Obentener los valores y enviarlos al servidor
  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('')
  const [paisEstado, setPaisEstado] = useState('')
  const [referenciaPago, setReferenciaPago] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [cedula, setCedula] = useState('')

  //Estados para obtener los valores de la tabla valores_ves
  const [currentId, setCurrentId] = useState(null);
  const [valor, setValor] = useState(0);
  const [valores, setValores] = useState({
    valor_ves: 0,
    valor_cop: 30000,
    valor_usd: 7
  });

  //Estados de los numeros usados
  const [usedNumbers, setUsedNumbers] = useState([]);

  // Estados para los mil o cien puestos
  const [modoSorteo, setModoSorteo] = useState('1000');

  //estado de la publicacion del CardPub
  const [cardData, setCardData] = useState([]);

  // ListaRef Virtualizada
  const listaVirtualRef = useRef();

  const [itemPerRow, setItemPerRow] = useState(5);

  // Funcion para generar numeros para mostrar
  const triggerNum = () => {

    if (modoSorteo === '100') {
      return Array.from({ length: 100 }, (_, i) => {
        return i === 99 ? '00' : String(i + 1).padStart(2, '0');
      });
    } else if (modoSorteo === '1000') {
      return Array.from({ length: 1000 }, (_, i) => {
        return String(i).padStart(3, '0')
      });
    } else if (modoSorteo === '10000') {
      return Array.from({ length: 10000 }, (_, i) => {
        return String(i).padStart(4, '0')
      })
    };
  };

  // Funcion para convertir a formato de almacenamiento de tres digitos
  const convFormAlmacemiento = (numMostrado) => {

    const num = parseInt(numMostrado)

    if (modoSorteo === '100') {
      if (num === 0 || numMostrado === '00') return '000';
      return String(num).padStart(3, '0');
    } else if (modoSorteo === '1000') {
      return numMostrado.padStart(3, '0')
    } else if (modoSorteo === '10000') {
      return numMostrado.padStart(4, '0')
    };
    // return numMostrado.padStart(3, '0');
  };

  // Funcion para convertir de almacenamiento a visualizacion
  const convFormVisual = (numAlmacenado) => {
    if (modoSorteo === '100') {
      const num = parseInt(numAlmacenado);
      if (num === 0) return '00';
      return num <= 99 ? String(num).padStart(2, '0') : numAlmacenado
    } else if (modoSorteo === '1000') {
      return numAlmacenado.padStart(3, '0');
    } else if (modoSorteo === '10000') {
      return numAlmacenado.padStart(4, '0')
    }
    // return numAlmacenado.padStart(3, '0');
  };

  // Manejo de disposicion de numeros en el contenedor '.lista'
  useEffect(() => {
    const handleResize = () => {

      const width = window.innerWidth;
      console.log('Ancho: ', width);

      if (width >= 1397) {
        setItemPerRow(16);
      } else {
        setItemPerRow(5);
      };
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Funcion para los numeros visibles:
  const visibleNumbers = useMemo(() => {
    // return triggerNum().filter(numMostrado => {
    //   return searchTerm === '' ||
    //     numMostrado.includes(searchTerm) ||
    //     numMostrado.replace(/^0+/, '').includes(searchTerm);
    // });

    const todosNumeros = triggerNum();

    if (searchTerm === '') {
      return todosNumeros
    };

    if (modoSorteo === '10000' && searchTerm.length === 4) {
      const exactMatch = todosNumeros.find(num => num === searchTerm);
      return exactMatch ? [exactMatch] : [];
    }

    return todosNumeros.filter(numMostrado => {
      return numMostrado.includes(searchTerm) ||
        numMostrado.replace(/^0+/, '').includes(searchTerm);
    });
  }, [searchTerm, modoSorteo]);

  // Constantes para las filas y columnas de la virtualizacion
  const ROW_HEIGTH = 40;
  const COLUMN_WIDTH = 52;
  const ITEM_PER_ROW = 5;

  const virtualizer = useVirtualizer({

    count: Math.ceil(visibleNumbers.length / itemPerRow),
    getScrollElement: () => listaVirtualRef.current,
    estimateSize: () => ROW_HEIGTH,
    overscan: 5

  })

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
    const interval = setInterval(() => {
      getUsedNumbers().then(nums => setUsedNumbers(nums));
    }, 10000);
    return () => clearInterval(interval);
  }, [])

  //Filtro(input) para buscar numeros de la "lista"
  const handleSearch = (e) => {

    // const inputValue = e.target.value;

    // setRawInput(inputValue);

    // const searchValue = inputValue === '' ? '' : String(inputValue).padStart(4, '0');

    // // Solo 3 digitos y solo numeros
    // const valueClean = inputValue.replace(/\D/g, '').slice(0, 4);

    // setRawInput(valueClean);
    // setSearchTerm(valueClean);

    // setSearchTerm(searchValue);
    // console.log(searchValue);

    const inputValue = e.target.value;

    const valueClean = inputValue.replace(/\D/g, '').slice(0, 4);

    setRawInput(valueClean);
    setSearchTerm(valueClean);
  };
  /**
  useEffect(() => {
    console.log('=== ESTADO ACTUAL ===');
    console.log('Modo sorteo:', modoSorteo);
    console.log('SearchTerm:', searchTerm);
    console.log('RawInput:', rawInput);
    console.log('UsedNumbers count:', usedNumbers.length);
    console.log('UsedNumbers ejemplos:', usedNumbers.slice(0, 5));
    console.log('VisibleNumbers count:', visibleNumbers.length);
    console.log('VisibleNumbers ejemplos:', visibleNumbers.slice(0, 5));
  }, [searchTerm, visibleNumbers, usedNumbers, modoSorteo]);
   */

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

  // Funcion para traer los datos del CardPud
  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await axios.get('/api/cardpub');
        setCardData(response.data);
      } catch (error) {
        console.error('Error en la obtencion de datos del CardGet', error);
      }
    }
    fetchCardData();
  }, []);

  const formaDate = (dateString) => {
    if (!dateString) return 'Fecha no definifa';

    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
    } catch (error) {
      console.error("Error en el formato de la fecha", error);
      return dateString;
    }
  };

  useEffect(() => {
    let timer;
    if (showModal) {
      timer = setTimeout(() => setShowModal(false), 3000)
    }
    return () => clearTimeout(timer);
  }, [showModal])

  //Obtener valor del VES a la BD
  const fetchValores = async () => {
    try {
      const response = await axios.get('/api/valores');
      setValores({
        valor_ves: response.data.valor_ves,
        valor_cop: response.data.valor_cop,
        valor_usd: response.data.valor_usd
      });
    } catch (error) {
      console.error('Error al obtener los valores de las monedas', error);
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
    fetchValores();
  }, []);


  // Funcion para obtener el Modo al cargar
  useEffect(() => {

    const fetchModoSorteo = async () => {
      try {
        const response = await axios.get('/api/modo_sorteo');
        setModoSorteo(response.data.modo || '1000');
      } catch (error) {
        console.error("Error obteniendo la cantidad de los puestos", error);
      }
    };

    fetchModoSorteo();
  }, [])

  /**
  // Funcion para ver detalles de la lista
  const analizeList = () => {
    const elementosVisibles = visibleNumbers.length;
    const elementosUsados = visibleNumbers.filter(num => {
      const numAlmacenar = convFormAlmacemiento(num);
      return usedNumbers.includes(convFormVisual(numAlmacenar));
    }).length;
    const elementosSeleccionados = visibleNumbers.filter(num => {
      const numAlmacenar = convFormAlmacemiento(num);
      return selectNumbers.includes(numAlmacenar);
    }).length;
 
    console.log('=== ANÁLISIS DETALLADO DE LISTA VIRTUALIZADA ===');
    console.log(`Total elementos visibles: ${elementosVisibles}`);
    console.log(`Usados: ${elementosUsados}`);
    console.log(`Seleccionados: ${elementosSeleccionados}`);
    console.log(`Disponibles: ${elementosVisibles - elementosUsados - elementosSeleccionados}`);
    console.log(`Elementos virtualizados renderizados: ${virtualizer ? virtualizer.getVirtualItems().length : 0}`);
    console.log('===================================');
  };

  analizeList();
   */

  // Calculo total de boletos

  //Funcion para calcular el monto total de pago segun el metodo de pago
  const calcularMontoTotal = () => {

    let cantidadNumeros = selectNumbers.length; //Variable que almacena los numeros elegidos

    let montoTotal = '';
    switch (activeTab) {
      case 0: //Zelle
      case 3: //Paypal
        montoTotal = (cantidadNumeros * valores.valor_usd);
        break;
      case 1: //Nequi
      case 2: //Bancolombia
        montoTotal = (cantidadNumeros * valores.valor_cop);
        break;
      case 4: //PagoMovil
      case 5: //Banco Venezuela
        montoTotal = (cantidadNumeros * valores.valor_ves);
        break;
      case 6:
        montoTotal = (cantidadNumeros * valores.valor_cop);
        break;
      default:
        return montoTotal = 0;
    }
    return montoTotal;
  };

  //Funcionar para enviar datos a la BD
  const handleLogin = async (e) => {

    e.preventDefault();

    //validacion de todos los campos vacios:
    const allVoid = !nombre.trim() &&
      !celular.trim() &&
      !cedula.trim() &&
      !paisEstado.trim() &&
      !referenciaPago.trim() &&
      !selectedFile &&
      selectNumbers.length === 0;

    if (allVoid) {
      toast.error("Por favor, complete todos los campos");
      return;
    }

    //Validacion de envio del sorteo
    let hasError = false;
    if (!nombre.trim()) {
      toast.error("Nombre Requerido");
      hasError = true;
    };

    if (!celular.trim()) {
      toast.error("Celular Requerido");
      hasError = true;
    };

    if (!cedula.trim()) {
      toast.error("Cedúla Requerida");
      hasError = true;
    };

    if (!paisEstado.trim()) {
      toast.error("Ciudad y País Requeridos");
      hasError = true;
    };

    if (activeTab !== 6 && !referenciaPago.trim()) {
      toast.error("Referencia de Pago Requerido");
      hasError = true;
    };

    if (activeTab !== 6 && !selectedFile) {
      toast.error("Foto o Capruta de Pantalla Requerida");
      hasError = true;
    };

    if (selectNumbers.length === 0) {
      toast.error("Elegir minímo un puesto");
      hasError = true;
    };

    if (hasError) return;

    const metodosPago = ["Zelle", "Nequi", "Bancolombia", "PayPal", "PagoMovil", "Banco Venezuela", "Pago Efectivo"];

    const metodoPago = metodosPago[activeTab] || "Desconocido";

    const montoTotal = calcularMontoTotal();

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

    // console.log({
    //   jugador: {
    //     username: nombre,
    //     celular: celular,
    //     pais_estado: paisEstado,
    //     referenciaPago: referenciaPago,
    //     numerosBoletos: selectNumbers,
    //     metodo_pago: metodoPago,
    //     comprobante_pago: selectedFile,
    //     monto_total: montoTotal,
    //     cedula: cedula
    //   }
    // });
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
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      <div className='contSorteo'>
        <div className='contenidoSorteo'>

          {cardData.length > 0 && cardData.map((card, index) => (
            <div className="contPubSorteo" key={index}>
              <div className="pubLog">
                {/* Si necesitas la imagen aquí también */}
                {card.imagen_pub && (
                  <div className="contImageSorteoPub">
                    <img
                      src={`/api/cardpub/${card.imagen_pub}`}
                      className='img_pubSorteo'
                      alt="Publicidad del sorteo"
                    />
                  </div>
                )}
                <h2 className='title_sorteoPub'>{card.titulo_p}</h2>
                <h3 className='fecha_sorteoPub'>{formaDate(card.fecha_juego)}</h3>
                <p className='p_sorteoPub'>{card.descripcion_p}</p>
              </div>
            </div>
          ))}

          <h1 className='tituloSorteo'>Lista de Boletos</h1>

          <h3>Numeros de Boletos: </h3>

          <input
            type="text"
            inputMode='numeric'
            placeholder='Buscar'
            className='btnBuscar'
            value={rawInput}
            onChange={handleSearch}
            min="1"
            max={modoSorteo === '100' ? '100' : (modoSorteo === '1000' ? '1000' : '10000')}
            onWheel={(e) => e.target.blur()}
          />

          <div className='numUsedCount'>
            <label className='usedNumSorteo'>Numeros disponibles: {
              modoSorteo === '100' ? 100 :
                modoSorteo === '1000' ? 1000 - usedNumbers.length :
                  9999 - usedNumbers.length
            }</label>
            <meter
              className='meter'
              min={0}
              max={modoSorteo === '100' ? 100 : modoSorteo === '1000' ? 1000 : 10000}
              value={usedNumbers.length}
            ></meter>
          </div>

          <div className="lista" ref={listaVirtualRef}>
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualizer.getVirtualItems().map((virtualItem) => {
                const startIndex = virtualItem.index * itemPerRow;
                const endIndex = Math.min(startIndex + itemPerRow, visibleNumbers.length);
                const rowItems = visibleNumbers.slice(startIndex, endIndex);

                return (
                  <div
                    key={virtualItem.index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                      display: 'flex',
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    {rowItems.map((numMostrado) => {
                      const numAlmacenar = convFormAlmacemiento(numMostrado);
                      const visualNumber = convFormVisual(numAlmacenar);
                      const isUsed = usedNumbers.includes(convFormVisual(numAlmacenar));
                      const isSelected = selectNumbers.includes(numAlmacenar);

                      return (
                        <div
                          key={numMostrado}
                          className={`listaNumero ${isUsed ? 'used' : ''} ${isSelected ? 'selected' : ''}`}
                          data-used={isUsed}
                          onClick={() => !isUsed && toggleNumberSelec(numMostrado)}
                        >
                          {numMostrado}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
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
              {`COP: ${(selectNumbers.length * valores.valor_cop).toLocaleString('es-CO')}`}
            </div>
          </div>

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
              onWheel={(e) => e.target.blur()}
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
                  <h4 className='numeroCuenta'>6159318492</h4>
                  <h4 className='titular'>Titular:</h4>
                  <h4 className='remitente'>Lisbeth Sanchez</h4>
                  <div className="preciosConversionNumbers">
                    <h4>Pago:</h4>
                    {`$${(selectNumbers.length * valores.valor_usd).toLocaleString('es-US')}`}
                  </div>
                </div>
              }
              {activeTab === 1 &&
                <div className="modoPago">
                  <h4 className='nombrePago'>Nequi</h4>
                  <h4 className='cuenta'>Cuenta:</h4>
                  <h4 className='numeroCuenta'>3107827089</h4>
                  <h4 className='titular'>Titular:</h4>
                  <h4 className='remitente'>Vanessa Rincon</h4>
                  <div className="preciosConversionNumbers">
                    <h4>Pago:</h4>
                    {`$${(selectNumbers.length * valores.valor_cop).toLocaleString('es-CO')}`}
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
                    {`$${(selectNumbers.length * valores.valor_cop).toLocaleString('es-CO')}`}
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
                    {`$${selectNumbers.length * valores.valor_usd}`}
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
                    {`$${selectNumbers.length * normalizarNumero(valores.valor_ves)}`}
                  </div>
                </div>
              }
              {activeTab === 5 &&
                <div className="modoPago">
                  <h4 className='nombrePago'>Banco de Venezuela</h4>
                  <h4 className='cuenta'>Cuenta:</h4>
                  <h4 className='numeroCuenta'>21453387</h4>
                  <h4 className='titular'>Número</h4>
                  <h4 className='remitente'>04147014646</h4>
                  <h4 className='titular'>Titular:</h4>
                  <h4 className='remitente'>Vanessa Rincón</h4>
                  <div className="preciosConversionNumbers">
                    <h4>Pago:</h4>
                    {`$${selectNumbers.length * normalizarNumero(valores.valor_ves)}`}
                  </div>
                </div>
              }
              {activeTab === 6 &&
                <div className="modoPago">
                  <h4 className='nombrePago'>Pago en Efectivo</h4>

                  <div className="preciosConversionNumbers">
                    <h4>Pago:</h4>
                    {`$${(selectNumbers.length * valores.valor_cop).toLocaleString('es-CO')}`}
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