import React from 'react'
import PropTypes from "prop-types";

export const Modal = ({ nombre, numerosBoletos, message, isError, onClose }) => {
    return (
        <>
            <div className="modal-overlay">
                <div className={`modal-content ${isError ? 'error' : 'success'}`}>
                    <p>{message}</p>
                    <p className='title_modal'>Jugador:</p>
                    <p className='value_modal'>{nombre}</p>
                    <p className='title_modal'>Numeros Seleccionados:</p>
                    <p className='value_modal'>{numerosBoletos}</p>
                    {/* <button
                        onClick={onClose}
                        className='modal-close-btn'
                        aria-label='Cerrar Modal'
                    >x</button> */}
                </div>
            </div>
        </>
    )
}

Modal.propTypes = {
    message: PropTypes.string.isRequired,
    isError: PropTypes.bool,
    onClose: PropTypes.func.isRequired
};

Modal.defaultProps = {
    isError: false
}