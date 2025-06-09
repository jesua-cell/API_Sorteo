import { Routes, Route } from 'react-router-dom'
// Enlaces
import { Inicio } from '../Pages/Inicio.jsx'
import { Login } from '../Pages/Login.jsx'
import { Sorteo } from '../Pages/Sorteo.jsx'
import { NotFound } from '../pages/NotFound.jsx'
import { Contacto } from '../pages/Contacto.jsx'
import { CuentasPago } from '../pages/CuentasPago.jsx'
import { Sesion } from "../sesion/Sesion.jsx";

export const Rutas = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Inicio />} />
                <Route path='/login' element={<Login />} />
                <Route path='/sorteo' element={<Sorteo />} />
                <Route path='/contacto' element={<Contacto />} />
                <Route path='/cuentas_de_pago' element={<CuentasPago />} />
                <Route path='/sesion' element={<Sesion />} />

                <Route path='*' element={<NotFound />} />
            </Routes>
        </>
    )
}
