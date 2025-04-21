import React from 'react'

export const Login = () => {
    return (
        <>
        <div className='contLogin'>
            <form className='formLogin'>
                <h1 className='tituloLogin'>Cuentas</h1>
                {/* <label className='labelLogin'>Usuario:</label> */}
                <input type="text" className='inputLogin' name="Usuario" placeholder='Usuario'/>
                {/* <label className='labelLogin'>Contraseña:</label> */}
                <input type="password" className='inputLogin' name="Contraseña" placeholder='Contraseña' />
                <button type='submit' className='btnLogin'>Ingresar</button>
            </form>
        </div>
        </>
    )
}
