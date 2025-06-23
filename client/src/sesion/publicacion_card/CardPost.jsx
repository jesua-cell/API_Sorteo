import axios from 'axios'
import SelectImage from "../../components/SelectImage.jsx";
import { useState } from "react";
import imageCard from "../../assets/ima_sorteo_card_ejemplo.png";

export const CardPost = () => {

    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // valores del formulario
    const [titulo, setTitulo] = useState("");
    const [subtitulo, setSubtitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [loading, setLoading] = useState(false);


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

    const handleSubmit = async () => {
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

            setTitulo('');
            setSubtitulo('');
            setDescripcion('');
            removeImage('');
        } catch (error) {
            console.error('Error al guardar el Card-Pub:', error)
        }
    };

    return (
        <>
            <div className="card">
                <h1 className="title_card_post">Post de Presentacion del Sorteo</h1>
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

                        <input
                            type="submit"
                            className="btn-cardPost"
                            value='Editar'
                        />

                        <input
                            type="submit"
                            className="btn-cardPost"
                            value='Eliminar'
                        />
                    </div>

                </div>
            </div>
        </>
    )
}
