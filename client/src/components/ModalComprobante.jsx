import borrar from "../assets/borrar.png";


export const ModalComprobante = ({ isOpen, closeModal, comprobantes, onDelete }) => {

    if (!isOpen) return;

    const handleImageClick = (imageUrl) => {
        const newWindow = window.open("", "_blank");
        newWindow.document.write(`
        <html>
            <head>
                <title>Comprobante</title>
                <style>
                    body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #c0c0c0; }
                    img { max-width: 100%; max-height: 100%; object-fit: contain; margin: 20px; }
                </style>
            </head>
            <body>
                <img src="${imageUrl}" alt="Comprobante completo" />
            </body>
        </html>
    `);
    newWindow.document.close();
    };

    return (
        <>
            <div className="contComprobantes">

                <div className="boxComprobantes">
                    <h2>{comprobantes.length} comprobantes:</h2>

                    <div className="comprobantes">
                        <button className="close-button" onClick={closeModal}>×</button>

                        {comprobantes.length === 0 ? (
                            <p>No hay comprobantes</p>
                        ) : (
                            <div className="comprobantes-container">
                                {comprobantes.map(comprobante => (
                                    <div key={comprobante.id} className="comprobante-item">
                                        <img
                                            src={`http://localhost:3000/uploads/${comprobante.ruta_archivo}`}
                                            alt="Comprobante"
                                            className="comprobante-img-modal"
                                            onClick={() => handleImageClick(`http://localhost:3000/uploads/${comprobante.ruta_archivo}`)}
                                            style={{cursor: 'pointer'}}
                                        />
                                        <button
                                            className="btn-eliminar-modal"
                                            onClick={() => onDelete(comprobante.id)}
                                        >
                                            <img src={borrar} alt="borrar" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
