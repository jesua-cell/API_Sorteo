import SelectImage from "../../components/SelectImage.jsx";
import { useState } from "react";
import  imageCard  from "../../assets/ima_sorteo_card_ejemplo.png";

export const CardPost = () => {

    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleImageUpload = (file) => {
        if(file && file instanceof Blob){
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result)
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        if(previewImage) URL.revokeObjectURL(previewImage);
        setPreviewImage(null);
        setSelectedFile(null);
    };

    return (
        <>
            <div className="card">
                <h1 className="title_card_post">Post de Presentacion del Sorteo</h1>
                <div className='contContendidoCard'>
                    <label style={{fontWeight: '700', opacity: '0.8'}}>Referencia de Publicación</label>
                    <img className="img_ejemplo_card" src={imageCard} alt="Sorteo" />

                    <input
                        type="text"
                        name="titulo_card"
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


                    {/* <h2>Toyota</h2> */}
                    <input
                        type="text"
                        name="sub_titulo_card"
                        id="sub_titulo_card"
                        className="input_card"
                        placeholder="Sub-titulo"
                    />

                    {/* <p>
                        23, Marzo del 2025
                    </p> */}
                    <input
                        type="text"
                        name="parrafo_card"
                        id="parrafo_card"
                        className="input_card"
                        placeholder="Descripción"
                    />

                    <input
                        type="submit"
                        className="btn-cardPost"
                    />

                </div>
            </div>
        </>
    )
}
