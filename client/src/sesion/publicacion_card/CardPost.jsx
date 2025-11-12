import axios from 'axios'
import { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import SelectImage from "../../components/SelectImage.jsx";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import es from "date-fns/locale/es";

import imageCard from "../../assets/ima_sorteo_card_ejemplo.png";

import borrar from "../../assets/borrar.png";
import error from "../../assets/error.png";
import boton_editar2 from "../../assets/boton_editar2.png";
import subir from "../../assets/subir.png"
import guardar_carpeta2 from "../../assets/guardar_carpeta2.png"

export const CardPost = () => {

  //Estado para la creacion, seletImage 
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // valores del formulario
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  //Estados de la peticion GET de la BD
  const [cardData, setCardData] = useState([]);

  //Estados de Edicion (UPDATE)
  const [editingID, setEditingID] = useState(null);
  const [editPreviewImage, setEditPreviewImage] = useState(null);
  const [ediSelectedFile, setEdiSelectedFile] = useState(null);
  const [tempData, setTempData] = useState({
    titulo_p: '',
    subtitulo_p: '',
    descripcion_p: '',
    imagen_pub: null,
    fecha_juego: new Date()
  });

  //Estado para bloquear la creacuib durante la edicion
  const [isEditing, setIsEditing] = useState(false);

  //Estados del componente Calendario
  const [starDate, setStarDate] = useState(new Date());
  const [animClass, setAnimClass] = useState("");

  //Input de la seleccion de la imagen
  const handleImageUpload = (file) => {

    //verificar el archivo
    if (file && file instanceof Blob) {
      setSelectedFile(file);
      const reader = new FileReader(); //leer el archivo y almacenarlo
      reader.onloadend = () => {
        setPreviewImage(reader.result) //Archivo leido almacenado
      };
      reader.readAsDataURL(file); //Leer el archivo recibido como parametro
    }
  };

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

  //Funcion de remover imagen
  const removeImage = () => {
    if (previewImage) URL.revokeObjectURL(previewImage); //metodo que libera la URL de la imagen
    setPreviewImage(null);
    setSelectedFile(null);
  };

  //Enviar datos a la BD
  const handleSubmit = async () => {

    if (isEditing) {
      toast.error("Termina la edición actual antes de crear una nueva publicación");
      return;
    }

    if (selectedFile && selectedFile.size > 2 * 1024 * 1024) {
      toast.error("La imagen excede el tamaña permitdo(Maximo 2MB)")
    }

    //Validaciones del formulario
    const errors = {};
    if (!titulo.trim()) {
      toast.error("Titulo Requerido");
      return;
    }

    if (!subtitulo.trim()) {
      toast.error("Subtitulo Requerido");
      return;
    }

    if (!descripcion.trim()) {
      toast.error("Descripcion Requerida");
      return;
    }

    if (!selectedFile) {
      toast.error("Imagen Requerida");
      return;
    }

    if (Object.keys(errors).length > 0) {
      console.error("Error en la validacion", errors);
      toast.error("Completar los campos correctamente")
    };

    // fecha en español
    const fechaISO = format(starDate, "yyyy-MM-dd");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('titulo_p', titulo);
      formData.append('subtitulo_p', subtitulo);
      formData.append('descripcion_p', descripcion);
      formData.append('imagen', selectedFile);
      formData.append('fecha_juego', fechaISO);
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(
        '/api/cardpub',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      console.log({
        Publicacion: {
          titulo: titulo,
          subtitulo_p: subtitulo,
          descripcion_p: descripcion,
          imagen: selectedFile,
          fecha_juego: fechaISO
        }
      });

      setCardData(prevData => [...prevData, response.data]);

      toast('Publicacion Creada y Subida',
        {
          icon: '✅',
          style: {
            borderRadius: '10px',
            background: '#fcfdffff',
            color: '#000000ff',
          },
        }
      );

      setTitulo('');
      setSubtitulo('');
      setDescripcion('');
      removeImage('');

    } catch (error) {
      console.error('Error al guardar el Card-Pub:', error);
      toast.error("Error al subir la publicacion");
    }
  };

  //obtener los datos de la BD
  useEffect(() => {

    const fetchCardData = async () => {
      try {
        const response = await axios.get('/api/cardpub');
        setCardData(response.data || []);
      } catch (error) {
        console.error('Error en la obtencion de datos del CardGet', error);
        setCardData([]);
      }
    }
    fetchCardData();
  }, []);

  //Consulta para eliminar 
  const handleDelete = async (id) => {
    try {

      const token = localStorage.getItem('jwtToken');
      await axios.delete(`/api/cardpub/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setCardData(cardData.filter(card => card.id !== id));

      toast('Publicacion Eliminada',
        {
          icon: '🗑️',
          style: {
            borderRadius: '10px',
            background: '#fff',
            color: '#fd0d0d',
          },
        }
      );

    } catch (error) {
      console.error("Error al eliminar datos del CardPub");
    }
  };

  //Funciones para editar

  //Activar Edicion
  const handleActivateEdit = (card) => {

    setIsEditing(true);

    setEditingID(card.id);
    setTempData({
      titulo_p: card.titulo_p,
      subtitulo_p: card.subtitulo_p,
      descripcion_p: card.descripcion_p,
      imagen_pub: null,
      fecha_juego: card.fecha_juego ? new Date(card.fecha_juego) : new Date()
    });
    //Mostrar imagenes en la previsualizacion
    if (card.imagen_pub) {
      setEditPreviewImage(`/api/cardpub/${card.imagen_pub}`);
    } else {
      setEditPreviewImage(null);
    };

    setEdiSelectedFile(null);
  };

  // activar edicion del contenedor SorteoPub
  const handleActivateDescEdit = (card) => {
    setEditingDescId(card.id);
    setTempDesc(card.descripcion_p);
  };

  //Guardar Cambios
  const handleSaveEdit = async (id) => {

    setIsEditing(false);

    try {
      const formData = new FormData();
      formData.append('titulo_p', tempData.titulo_p);
      formData.append('subtitulo_p', tempData.subtitulo_p);
      formData.append('descripcion_p', tempData.descripcion_p);
      formData.append('fecha_juego', format(tempData.fecha_juego, "yyyy-MM-dd"));

      if (ediSelectedFile) {
        formData.append('imagen', ediSelectedFile);
      };

      const token = localStorage.getItem('jwtToken');

      const response = await axios.put(`/api/cardpub/${id}`, formData, {
        headers:
        {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      //Actualizar estado local
      setCardData(cardData.map(card =>
        card.id === id ? {
          ...card,
          titulo_p: tempData.titulo_p,
          subtitulo_p: tempData.subtitulo_p,
          descripcion_p: tempData.descripcion_p,
          imagen_pub: response.data.imagen_pub || card.imagen_pub,
          fecha_juego: response.data.fecha_juego
        } : card

      ));

      setEditingID(null);
      setEditPreviewImage(null);
      setEdiSelectedFile(null);
      toast('Publicacion Editada',
        {
          icon: '✅',
          style: {
            borderRadius: '10px',
            background: '#fffefeff',
            color: '#0f0f0fff',
            fontWeight: '500'
          },
        }
      );

    } catch (error) {
      console.error('Error en la edicion del CardPub', error);
    }
  };

  //Funcion de Select en Edicion
  const handleEditImageUpload = (file) => {
    console.log('Archivo Seleccinado para Edicion', file);
    if (file && file instanceof Blob) { //Verificar el archivo
      setEdiSelectedFile(file) // alamcenar los valores nuevos en el estado de edicion
      const reader = new FileReader();

      //previsualizacion
      reader.onload = () => {
        console.log("Previsualización generada:", reader.result);
        setEditPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //Remover la imagen en Edicion
  const removeEditImage = () => {
    if (editPreviewImage) URL.revokeObjectURL(editPreviewImage);
    setEditPreviewImage(null);
    setEdiSelectedFile(null);
    setTempData({ ...tempData, imagen_pub: null });
  };

  //Funcion de cancelar la edicion
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingID(null);
  };

  registerLocale('es', es); // Modo español del calendario

  //TODO Cambiar la edicion de tarjetas y mostrar y manejar todo en un contenedor

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      <div className="contContenidoCardPub" style={{ opacity: isEditing ? 0.5 : 1, pointerEvents: isEditing ? 'none' : 'all' }}>
        <h1 className="title_card_post">Publicaciones del Sorteo</h1>
        <div className='contContendidoCard'>
          <textarea
            type="text"
            name="titulo_card"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="input_card"
            placeholder="Titulo Principal:"
          />

          <div className="contentCard">
            <SelectImage
              previewImage={previewImage}
              onFileChange={handleImageUpload}
              onRemoveImage={removeImage}
              buttonLabel='Subir: Foto'
            />
          </div>

          <textarea
            type="text"
            name="sub_titulo_card"
            value={subtitulo}
            onChange={(e) => setSubtitulo(e.target.value)}
            className="input_card"
            placeholder="Sub-titulo:"
          />

          <textarea
            type="text"
            name="parrafo_card"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="input_card"
            placeholder="Descripción:"
          />

          <DatePicker
            selected={starDate}
            onChange={(date) => setStarDate(date)}
            locale={es}
            dateFormat="dd 'de' MMMM 'del' yyyy"
            className='DatePicker_calendario'
            calendarClassName={`calendario-animado`}
          />

          <div className="cont_inputs_card">
            <button
              type="submit"
              className="btn-cardPost"
              value='Subir'
              onClick={handleSubmit}
            >
              <img src={subir} className='img_btnCardPost' />
            </button>
          </div>
        </div>
        <h1 className='title_card_post'>Publicado:</h1>
      </div>

      {/* Lista de publicaciones existentes */}
      <div className="contPubUpload">
        {cardData.length > 0 ? (
          <>
            {/* Bloque principal */}
            <div className="card">
              {cardData.map((card, index) => (
                <div key={index} className='contContendidoPub'>
                  {editingID === card.id ? (
                    // MODO EDICIÓN
                    <>
                      <textarea
                        value={tempData.titulo_p}
                        onChange={(e) => setTempData({ ...tempData, titulo_p: e.target.value })}
                        className="input_card"
                        placeholder="Título Principal"
                        style={{ marginBottom: '0px', marginTop: '25px' }}
                      />

                      <div className="contentCard">
                        <SelectImage
                          key={`edit-${card.id}`}
                          previewImage={editPreviewImage}
                          onFileChange={handleEditImageUpload}
                          onRemoveImage={removeEditImage}
                          buttonLabel='Cambiar Imagen'
                        />
                      </div>

                      <textarea
                        value={tempData.subtitulo_p}
                        onChange={(e) => setTempData({ ...tempData, subtitulo_p: e.target.value })}
                        className="input_card"
                        placeholder="Sub-título"
                        style={{ marginBottom: '25px', marginTop: '18px' }}
                      />

                      <textarea
                        value={tempData.descripcion_p}
                        onChange={(e) => setTempData({ ...tempData, descripcion_p: e.target.value })}
                        className="input_card"
                        placeholder="Descripción"
                        style={{ marginBottom: '25px' }}
                      />

                      <DatePicker
                        selected={tempData.fecha_juego}
                        onChange={(date) => setTempData({ ...tempData, fecha_juego: date })}
                        locale={es}
                        dateFormat="dd 'de' MMMM 'del' yyyy"
                        className='DatePicker_calendario'
                        calendarClassName='calendario-animado'
                      />

                      <div className="cont_inputs_card">
                        <button
                          className="btn-cardPost-guardar"
                          onClick={() => handleSaveEdit(card.id)}
                        >
                          <img src={guardar_carpeta2} className='img_cardPost-guardar' />
                        </button>
                        <button
                          className="btn-cardPost-cancelar"
                          onClick={handleCancelEdit}
                        >
                          <img src={error} />
                        </button>
                      </div>
                    </>
                  ) : (
                    // MODO VISUALIZACIÓN
                    <>
                      <h2 className='indices_sorteoPub'>Titulo:</h2>
                      <h1 className='title_sorteo_Pub'>{card.titulo_p}</h1>
                      {card.imagen_pub && (
                        <img
                          src={`/api/cardpub/${card.imagen_pub}`}
                          alt='Imagen del sorteo'
                          className='img_SorteoPub'
                        />
                      )}
                      <h2 className='indices_sorteoPub'>Subtitulo:</h2>
                      <h2 className='subt_sorteo_Pub'>{card.subtitulo_p}</h2>

                      <h2 className='indices_sorteoPub'>Descripcion:</h2>
                      <p className='desc_sorteo_Pub'>{card.descripcion_p}</p>

                      <h2 className='indices_sorteoPub'>Fecha</h2>
                      <p className='fecha_juego'>
                        {card.fecha_juego instanceof Date
                          ? format(card.fecha_juego, "dd 'de' MMMM 'de' yyyy", { locale: es })
                          : format(new Date(card.fecha_juego), "dd 'de' MMMM 'de' yyyy", { locale: es })
                        }
                      </p>

                      <div className="cont_inputs_card">
                        <button
                          className="btn-cardPost-editar"
                          onClick={() => handleActivateEdit(card)}
                        >
                          <img src={boton_editar2} />
                        </button>
                        <button
                          className="btn-cardPost-eliminar"
                          onClick={() => handleDelete(card.id)}
                        >
                          <img src={borrar} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no_pub">
            <p className='p_noPub'>No hay Publicaciones guardadas</p>
          </div>
        )}
      </div>
    </>
  )
}
