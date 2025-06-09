import  borrar  from "../assets/borrar.png";
import  editar  from "../assets/editar.png";

export const Sesion = () => {
    return (
        <>
            <div className="cont_admins">
                <h2>Inventario</h2>
                <div className="box_jugador">
                    <dl className="lista-datos">
                        <div className="fila">
                            <dt>ID:</dt>
                            <dd>0012</dd>
                        </div>
                        <div className="fila">
                            <dt>Nombres:</dt>
                            <dd><strong>Pepe Gonzales</strong></dd>
                        </div>
                        <div className="fila">
                            <dt>Celular:</dt>
                            <dd>302 4778569</dd>
                        </div>
                        <div className="fila">
                            <dt>Cédula:</dt>
                            <dd>123547895</dd>
                        </div>
                        <div className="fila">
                            <dt>Método de Pago:</dt>
                            <dd>Nequi</dd>
                        </div>
                        <div className="fila">
                            <dt>Comprobante:</dt>
                            <dd>imagen.png</dd>
                        </div>
                        <div className="fila">
                            <dt>Referencia:</dt>
                            <dd>REF5689</dd>
                        </div>
                        <div className="fila">
                            <dt>Numeros de Boletos:</dt>
                            <dd>
                                <p className='fila_num'>0256</p>
                                <p className='fila_num'>0936</p>
                                <p className='fila_num'>0776</p>
                            </dd>
                        </div>
                        <div className="fila">
                            <dt>Fecha:</dt>
                            <dd>2025-06-06 16:07:35</dd>
                        </div>
                    <button><img src={borrar} alt="Borrar" /></button>
                    <button><img src={editar} alt="Borrar" /></button>
                    </dl>
                </div>
            </div>
        </>
    )
}
