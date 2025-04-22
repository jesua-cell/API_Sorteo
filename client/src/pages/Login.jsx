import { useState } from "react";

export const Login = () => {

    const [username, setUsernmae] = useState('');
    const [password, setPassword] = useState('')

    const handleLogin = (e) => {
        e.preventDefault();
        console.log({
            usuario: {
                usuario: username,
                contraseña: password
            }
        });
    }

    return (
        <>
            <div className='contLogin'>
                <form className='formLogin' onSubmit={handleLogin}>
                    <h1 className='tituloLogin'>Cuentas</h1>
                    {/* <label className='labelLogin'>Usuario:</label> */}
                    <input
                        type="text"
                        className='inputLogin'
                        name="Usuario"
                        placeholder='Usuario'
                        onChange={(e) => setUsernmae(e.target.value)}
                    />
                    {/* <label className='labelLogin'>Contraseña:</label> */}
                    <input
                        type="password"
                        className='inputLogin'
                        name="Contraseña"
                        placeholder='Contraseña'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type='submit' className='btnLogin'>Ingresar</button>
                </form>
            </div>
        </>
    )
}
