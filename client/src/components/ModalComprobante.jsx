import borrar from "../assets/borrar.png";


export const ModalComprobante = ({ isOpen, closeModal, comprobantes, onDelete }) => {

    if (!isOpen) return;
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
