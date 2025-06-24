import axios from 'axios'
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import SelectImage from "../../components/SelectImage.jsx";
import imageCard from "../../assets/ima_sorteo_card_ejemplo.png";

export const CardPost = () => {

    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // valores del formulario
    const [titulo, setTitulo] = useState("");
    const [subtitulo, setSubtitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [loading, setLoading] = useState(false);


    //Estados de la peticion GET de la BD
    const [cardData, setCardData] = useState([]);


    //Input de la seleccion de la imagen
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

    //Enviar datos a la BD
    const handleSubmit = async () => {

        // const errors = {};
        // if (!titulo.trim()) errors.titulo = "Titulo Requerido";
        // if (!subtitulo.trim()) subtitulo.titulo = "Subtitulo Requerido";
        // if (!descripcion.trim()) descripcion.titulo = "Descripcion Requerido";
        // if (!selectedFile.trim()) selectedFile.titulo = "Imagem Requerido";

        // if (Object.keys(errors).length > 0) {
        //     console.error("Error en la validacion", errors);
        //     toast.error("Completar los campos correctamente")
        // };

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
            toast.error("Error al subir la publicacion")
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
/**
 * TODO: Validar errors en el las peticiones de las consultas en los contenedores
 */

    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />

            <div className="card">
                <h1 className="title_card_post">Publicaciones del Sorteo</h1>
                <div className='contContendidoCard'>
                    <label style={{ fontWeight: '700', opacity: '0.8' }}>Referencia de Publicación</label>
                    <img className="img_ejemplo_card" src={imageCard} alt="Sorteo" />

                    <input
                        type="text"
                        name="titulo_card"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        id="titulo_card"
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
                        id="sub_titulo_card"
                        className="input_card"
                        placeholder="Sub-titulo"
                    />

                    <input
                        type="text"
                        name="parrafo_card"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        id="parrafo_card"
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
            {cardData.length > 0 ? (

                <div className="card">

                    {/* Contedor de publicacines guardadas en la BD */}
                    {cardData.map((card, index) => (
                        <div key={index} className='contContendido'>
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
                            <label style={{ fontWeight: '700', opacity: '0.7', marginBottom: '20px' }}>"Boton solo de referencia"</label>

                            <div className="cont_inputs_card">
                                <input
                                    type="submit"
                                    className="btn-cardPost-editar"
                                    value='Editar'
                                />

                                <input
                                    type="submit"
                                    className="btn-cardPost-eliminar"
                                    value='Eliminar'
                                    onClick={() => handleDelete(card.id)}
                                />
                            </div>

                        </div>
                    ))}

                </div>
            ) : (
                <div className="no_pub">
                    <p>
                        No hay Publicaciones guardadas
                    </p>
                </div>
            )}
        </>
    )
}
