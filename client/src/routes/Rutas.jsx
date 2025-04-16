import { Routes, Route } from 'react-router-dom'
// Enlaces
import { Inicio } from '../Pages/Inicio.jsx'
import { Login } from '../Pages/Login.jsx'
import { Sorteo } from '../Pages/Sorteo.jsx'
import { NotFound } from '../pages/NotFound.jsx'

export const Rutas = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Inicio />} />
                <Route path='/login' element={<Login />} />
                <Route path='/sorteo' element={<Sorteo />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </>
    )
}
