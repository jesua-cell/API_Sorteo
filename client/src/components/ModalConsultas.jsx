
export const ModalConsultas = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmButtonTxt = 'Confirmar',
    cancelButtonTxt = 'Cancelar'
}) => {
    if (!isOpen) return;
    return (
        <>
            <div className="modal-overlay">
                <div className="modal-confirm">
                    <h3 className="title_modal_est">{title}</h3>
                    <div className="modal-message">{message}</div>
                    <div className="modal-button">
                        <button
                            className="modal_cancel_btn"
                            onClick={onClose}
                        >{cancelButtonTxt}</button>
                        <button
                            className="modal_confirm_btn"
                            onClick={onConfirm}
                        >{confirmButtonTxt}</button>
                    </div>
                </div>
            </div>
        </>
    )
}
