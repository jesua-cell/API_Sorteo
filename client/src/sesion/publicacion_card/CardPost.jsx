import axios from 'axios'
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import SelectImage from "../../components/SelectImage.jsx";
import imageCard from "../../assets/ima_sorteo_card_ejemplo.png";

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
        imagen_pub: null
    });

    //Estado para bloquear la creacuib durante la edicion
    const [isEditing, setIsEditing] = useState(false);

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

    //Funcion de remover imagen
    const removeImage = () => {
        if (previewImage) URL.revokeObjectURL(previewImage); //metodo que libera la URL de la imagen
        setPreviewImage(null);
        setSelectedFile(null);
    };

    //Enviar datos a la BD
    const handleSubmit = async () => {

        if(isEditing){
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

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('titulo_p', titulo);
            formData.append('subtitulo_p', subtitulo);
            formData.append('descripcion_p', descripcion);
            formData.append('imagen', selectedFile);

            const response = await axios.post(
                'http://localhost:3000/cardpub',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            console.log('Publicacion Guardada', response.data);

            toast('Publicacion Creada y Subida',
                {
                    icon: '✅',
                    style: {
                        borderRadius: '10px',
                        background: '#0035a3',
                        color: '#e5eeff',
                    },
                }
            );

            setTitulo('');
            setSubtitulo('');
            setDescripcion('');
            removeImage('');

            window.location.reload();
        } catch (error) {
            console.error('Error al guardar el Card-Pub:', error);
            toast.error("Error al subir la publicacion");
        }
    };

    //obtener los datos de la BD
    useEffect(() => {
        const fetchCardData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/cardpub');
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

            await axios.delete(`http://localhost:3000/cardpub/${id}`);
            setCardData(cardData.filter(card => card.id !== id));

            toast('Publicacion Eliminada',
                {
                    icon: '🗑️',
                    style: {
                        borderRadius: '10px',
                        background: '#c7002c',
                        color: '#ffe0e7',
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
            imagen_pub: null
        });
        //Mostrar imagenes en la previsualizacion
        setEditPreviewImage(`data:image/*;base64,${card.imagen_pub}`);
        setEdiSelectedFile(null);
    };

    //Guardar Cambios
    const handleSaveEdit = async (id) => {

        setIsEditing(false);

        try {
            const formData = new FormData();
            formData.append('titulo_p', tempData.titulo_p);
            formData.append('subtitulo_p', tempData.subtitulo_p);
            formData.append('descripcion_p', tempData.descripcion_p);

            if (ediSelectedFile) {
                formData.append('imagen', ediSelectedFile);
            };

            await axios.put(`http://localhost:3000/cardpub/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            //Actualizar estado local
            setCardData(cardData.map(card =>
                card.id === id ? {
                    ...card,
                    titulo_p: tempData.titulo_p,
                    subtitulo_p: tempData.subtitulo_p,
                    descripcion_p: tempData.descripcion_p
                } : card
            ));

            setEditingID(null);
            setEditPreviewImage(null);
            setEdiSelectedFile(null);
            window.location.reload();
            toast('Publicacion Editada',
                {
                    icon: '✅',
                    style: {
                        borderRadius: '10px',
                        background: '#0035a3',
                        color: '#e5eeff',
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




    /**
     * TODO: Validar errors en el las peticiones de las consultas en los contenedores
     */

    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />

            {/* Formulario para CREAR nueva publicación */}
            <div className="card" style={{opacity: isEditing ? 0.5 : 1, pointerEvents: isEditing ? 'none' : 'all'}}>
                <h1 className="title_card_post">Publicaciones del Sorteo</h1>
                <div className='contContendidoCard'>
                    <label style={{ fontWeight: '700', opacity: '0.8' }}>Referencia de Publicación</label>
                    <img className="img_ejemplo_card" src={imageCard} alt="Sorteo" />

                    <input
                        type="text"
                        name="titulo_card"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        className="input_card"
                        placeholder="Titulo Principal"
                    />

                    <div className="contentCard">
                        <SelectImage
                            previewImage={previewImage}
                            onFileChange={handleImageUpload}
                            onRemoveImage={removeImage}
                            buttonLabel='Subir: Foto'
                        />
                    </div>

                    <input
                        type="text"
                        name="sub_titulo_card"
                        value={subtitulo}
                        onChange={(e) => setSubtitulo(e.target.value)}
                        className="input_card"
                        placeholder="Sub-titulo"
                    />

                    <input
                        type="text"
                        name="parrafo_card"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="input_card"
                        placeholder="Descripción"
                    />

                    <div className="cont_inputs_card">
                        <input
                            type="submit"
                            className="btn-cardPost"
                            value='Subir'
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>

            {/* Lista de publicaciones existentes */}
            {cardData.length > 0 ? (
                <div className="card">
                    {cardData.map((card, index) => (
                        <div key={index} className='contContendido'>
                            {editingID === card.id ? (
                                // MODO EDICIÓN
                                <>
                                    <input
                                        type="text"
                                        value={tempData.titulo_p}
                                        onChange={(e) => setTempData({ ...tempData, titulo_p: e.target.value })}
                                        className="input_card"
                                        placeholder="Título Principal"
                                        style={{marginBottom: '25px'}}
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
                                        type="text"
                                        value={tempData.subtitulo_p}
                                        onChange={(e) => setTempData({ ...tempData, subtitulo_p: e.target.value })}
                                        className="input_card"
                                        placeholder="Sub-título"
                                        style={{marginBottom: '25px', marginTop: '18px'}}
                                    />

                                    <textarea
                                        type="text"
                                        value={tempData.descripcion_p}
                                        onChange={(e) => setTempData({ ...tempData, descripcion_p: e.target.value })}
                                        className="input_card"
                                        placeholder="Descripción"
                                        style={{marginBottom: '25px'}}
                                    />

                                    <div className="cont_inputs_card">
                                        <input
                                            type="submit"
                                            className="btn-cardPost-guardar"
                                            value='Guardar'
                                            onClick={() => handleSaveEdit(card.id)}
                                        />
                                        <input
                                            type="submit"
                                            className="btn-cardPost-cancelar"
                                            value='Cancelar'
                                            onClick={handleCancelEdit}
                                        />
                                    </div>
                                </>
                            ) : (
                                // MODO VISUALIZACIÓN
                                <>
                                    <h1 className='titulo_sorteo'>{card.titulo_p}</h1>
                                    <img
                                        src={`data:image/*;base64,${card.imagen_pub}`}
                                        alt='Imagen del sorteo'
                                    />
                                    <h2>{card.subtitulo_p}</h2>
                                    <p>{card.descripcion_p}</p>
                                    <button className='btn-inicio' type="button">
                                        <>Lista de Boletos</>
                                    </button>
                                    <label style={{ fontWeight: '700', opacity: '0.7', marginBottom: '20px' }}>
                                        "Botón solo de referencia"
                                    </label>

                                    <div className="cont_inputs_card">
                                        <input
                                            type="submit"
                                            className="btn-cardPost-editar"
                                            value='Editar'
                                            onClick={() => handleActivateEdit(card)}
                                        />
                                        <input
                                            type="submit"
                                            className="btn-cardPost-eliminar"
                                            value='Eliminar'
                                            onClick={() => handleDelete(card.id)}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no_pub">
                    <p>No hay Publicaciones guardadas</p>
                </div>
            )}
        </>
    )
}
