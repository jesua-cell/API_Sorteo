import borrar from "../assets/borrar.png";


export const ModalComprobante = ({ isOpen, closeModal, comprobantes, onDelete }) => {

    if (!isOpen) return;

    const handleImageClick = (imageData) => {
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
                <img src="data:image/jpeg;base64,${imageData}" alt="Comprobante completo" />
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
                                            src={`data:image/jpeg;base64,${comprobante.comprobante}`}
                                            alt="Comprobante"
                                            className="comprobante-img-modal"
                                            onClick={() => handleImageClick(comprobante.comprobante)}
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
