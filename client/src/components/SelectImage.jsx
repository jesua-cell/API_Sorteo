import React, { useRef } from 'react'

export const SelectImage = ({ previewImage, onFileChange, onRemoveImage, buttonLabel = "Seleccionar Imagen" }) => {

    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            if (file.type.match('image.*')) {
                onFileChange(file);
            } 

            e.target.value = null;
        }
    }

    // const handleClick = () => {
    //     fileInputRef.current.click();
    // };

    return (
        <>
            <div className='input_comprobatePago'>
                <input
                    id='comprobantePago'
                    ref={fileInputRef}
                    type="file"
                    accept='image/png, image/jpeg'
                    onChange={handleFileChange}
                    className='fileImage'
                    style={{ display: 'none' }}
                />
                <label
                    className='input_seleccionarFile'
                    htmlFor='comprobantePago'
                // onClick={handleClick}
                >{buttonLabel}</label>
                {previewImage && (
                    <div className='image_comprobante'>
                        <img src={previewImage} alt='Comprobante' />
                        <button
                            type='button'
                            className='remove-btn'
                            onClick={onRemoveImage}
                        >x</button>
                    </div>
                )}
            </div>
        </>
    )
}

export default SelectImage;
