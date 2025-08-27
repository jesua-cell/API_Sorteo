import axios from "axios";
import { useState, useEffect } from "react";

export const Verificador = () => {

    // Estados para los jugadores
    const [jugadores, setJugadores] = useState([]);

    // Estados del input
    const [Busquedad, setBusquedad] = useState('');

    //Estados para el resultado de verificacion
    const [jugadorEncontrado, setJugadorEncontrado] = useState(null);
    const [errorVerificacion, setErrorVerificacion] = useState('');

    useEffect(() => {
        const fetchJugadores = async () => {

            try {
                const response = await axios.get('http://localhost:3000/jugadorVerificador');
                setJugadores(response.data);
            } catch (error) {
                console.error("Error al obtener jugadores en el Verificador", error);
            }
        };
        fetchJugadores();
    }, [])

    useEffect(() => {
        console.log(jugadores);
    }, [jugadores])


    const verificacionBoleto = () => {

        const vacio = Busquedad.trim();

        //Validaciones:
        if (!vacio) {
            setErrorVerificacion('Ingresa un número celular o un puesto');
            setJugadorEncontrado(null);
            return;
        };

        const busquedaNormalizada = Busquedad.trim().toLocaleLowerCase().replace(/\s+/g, '');

        const jugador = jugadores.find((j) => {
            const celularNormalizado = (j.celular || '').toLocaleLowerCase().replace(/\s+/g, '');
            if (celularNormalizado === busquedaNormalizada) return true;

            const boletos = j.boletos ? j.boletos.split(',') : [];

            return boletos.some(boleto =>
                boleto.toLocaleLowerCase().replace(/\s+/g, '') === busquedaNormalizada
            );
        });

        if (jugador) {
            jugador.boletos = jugador.boletos ? jugador.boletos.split(',') : [];
            setJugadorEncontrado(jugador);
            setErrorVerificacion('');
        } else {
            setJugadorEncontrado(null);
            setErrorVerificacion('Jugador no existe')
        };
    };

    const formatearCelular = (celular) => {

        if (!celular) return '';

        const celularClean = celular.replace(/\s+/g, '');

        if (celularClean.length <= 7) {
            return celularClean;
        };

        const primeros_3 = celularClean.slice(0, 3);
        const ultimos_2 = celularClean.slice(-2);
        const numHash = celularClean.length - 7;

        return `${primeros_3}${'#'.repeat(numHash)}${ultimos_2}`
    };

    return (
        <>
            <div className="contVerificador">

                <h1>Verificador</h1>
                <label className="label_verificado">Número de telefono o Boleto</label>
                <input
                    type="text"
                    className="input_verificador"
                    value={Busquedad}
                    onChange={(e) => setBusquedad(e.target.value)}
                />

                <button
                    onClick={verificacionBoleto}
                    className="btn_verificador"
                >Verificar
                </button>

                {jugadorEncontrado && jugadorEncontrado !== false && (
                    <div className="contResultado">

                        <h4 className="h4_verificador">Resultado:</h4>
                        <label className="lbl_v">Nombres</label>
                        <p className="p_verificador">{jugadorEncontrado.nombres_apellidos}</p>
                        <label className="lbl_v">Celular</label>
                        <p className="p_verificador">
                            {formatearCelular(jugadorEncontrado.celular)}
                        </p>
                        {/* <p className="p_verificador">{jugadorEncontrado.boletos.join(' ')}</p> */}
                        <label className="lbl_v">Puestos:</label>
                        <div className="contVerificadorBoletos">
                            {jugadorEncontrado.boletos.map((boleto, index) => (
                                <p className="boletos_verificador" key={index}>
                                    {boleto}
                                </p>
                            ))}
                        </div>

                        <p className={jugadorEncontrado.estado_pago === 'pendiente' ? 'est-pendiente' : 'est-pagado'}>
                            {jugadorEncontrado.estado_pago === 'pendiente'
                                ? 'Pendiente'
                                : 'Verificado'}
                        </p>
                    </div>
                )}

                {errorVerificacion && (
                    <div className="contResultado">
                        <h4 className="verificador_false">{errorVerificacion}</h4>
                    </div>
                )}

            </div>
        </>
    )
}
