import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    const navigate = useNavigate();  

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/admin/login', {
                username,
                password
            });

            localStorage.setItem('jwtToken', response.data.token);

            localStorage.setItem('adminSession', JSON.stringify({
                nombre: response.data.nombre
            }));
            console.log("Contreña: ", password);
            window.dispatchEvent(new Event('adminLoggedIn'));
            navigate('/sesion');
        } catch (error) {
            setError('Credenciales Incorrectas');
            console.error("Error en el Login", error)
        };
    };

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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {/* <label className='labelLogin'>Contraseña:</label> */}
                    <input
                        type="password"
                        className='inputLogin'
                        name="Contraseña"
                        placeholder='Contraseña'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p>{error}</p>}
                    <button type='submit' className='btnLogin'>Ingresar</button>
                </form>
            </div>
        </>
    )
}
