import { Routes, Route } from 'react-router-dom'
// Enlaces
import { Inicio } from '../Pages/Inicio.jsx'
import { Login } from '../Pages/Login.jsx'
import { Sorteo } from '../Pages/Sorteo.jsx'

export const Rutas = () => {
    return (
        <>
            <Routes>
                <Route path='/inicio' element={<Inicio/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/sorteo' element={<Sorteo/>}/>
            </Routes>
        </>
    )
}
