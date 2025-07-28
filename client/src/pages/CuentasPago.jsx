import { CopyToClipboard } from "react-copy-to-clipboard";
import { Toaster, toast } from "react-hot-toast";
//Imagenes
import zelle from '../assets/zelle.png'
import nequi from '../assets/nequi.png'
import bancolombia from '../assets/bancolombia.png'
import paypal from '../assets/paypal.png'
import pagomovil from '../assets/pagomovil.png'
import bancovenezuela from '../assets/bancovenezuela.png'
import icon_copy from '../assets/icon-copy.svg'


export const CuentasPago = () => {


    const cuentas = {
        zelle: "6153625428\nFrancisco Javier Caicedo",
        nequi: "3223223329\nMaria Alejandra Garcia",
        bancolombia: "82000002819\nVanessa Rincón",
        paypal: "magc290598@gmail.com\nMaría Alejandra Garcia",
        pagomovil: "04147014646\nVanessa Rincón\n21453387",
        bancovenezuela: "V-21453387\nVannesa Rincón"
    };

    return (
        <>
            <div className="contCuentasPago">
                <h1 className='h1_cuentaPago'>Cuentas de Pago:</h1>

                <div className="boxCuentasPago">
                    <div className="cuentaPago">
                        <h2 className='titl_CuentaPago'>Zelle</h2>
                        <img src={zelle} className='img_cuentaPago' alt="Zelle" />
                        <h3 className='text_cuentaPago'>Cuenta:</h3>
                        <h3 className='text_cuentaPago'>6153625428</h3>
                        <h3 className='text_cuentaPago'>Titular:</h3>
                        <h3 className='text_cuentaPago'>Francisco Javier Caicedo</h3>
                        <CopyToClipboard
                            text={cuentas.zelle}
                            onCopy={() => {
                                toast.success('6153625428\nFrancisco Javier Caicedo', {
                                    iconTheme: {
                                        primary: '#713200'
                                    }
                                });
                            }}
                        >
                            <button className='icon-btn'>
                                <img src={icon_copy} />
                            </button>
                        </CopyToClipboard>
                    </div>
                    <Toaster />
                    <div className="cuentaPago">
                        <h2 className='titl_CuentaPago'>Nequi</h2>
                        <img src={nequi} className='img_cuentaPago' alt="Zelle" />
                        <h3 className='text_cuentaPago'>Cuenta:</h3>
                        <h3 className='text_cuentaPago'>3223223329</h3>
                        <h3 className='text_cuentaPago'>Titular:</h3>
                        <h3 className='text_cuentaPago'>Maria Alejandra Garcia</h3>
                        <CopyToClipboard
                            text={cuentas.nequi}
                            onCopy={() => {
                                toast.success('3223223329\nMaria Alejandra Garcia', {
                                    iconTheme: {
                                        primary: '#713200'
                                    }
                                });
                            }}
                        >
                            <button className='icon-btn'>
                                <img src={icon_copy} />
                            </button>
                        </CopyToClipboard>
                    </div>
                    <Toaster />
                    <div className="cuentaPago">
                        <h2 className='titl_CuentaPago'>Bancolombia</h2>
                        <img src={bancolombia} className='img_cuentaPago' alt="Zelle" />
                        <h3 className='text_cuentaPago'>Cuenta:</h3>
                        <h3 className='text_cuentaPago'>82000002819</h3>
                        <h3 className='text_cuentaPago'>Titular:</h3>
                        <h3 className='text_cuentaPago'>Vanessa Rincón</h3>
                        <CopyToClipboard
                            text={cuentas.bancolombia}
                            onCopy={() => {
                                toast.success('82000002819\nVanessa Rincón', {
                                    iconTheme: {
                                        primary: '#713200'
                                    }
                                });
                            }}
                        >
                            <button className='icon-btn'>
                                <img src={icon_copy} />
                            </button>
                        </CopyToClipboard>
                    </div>
                    <Toaster />
                    <div className="cuentaPago">
                        <h2 className='titl_CuentaPago'>PayPal</h2>
                        <img src={paypal} className='img_cuentaPago' alt="Zelle" />
                        <h3 className='text_cuentaPago'>Cuenta:</h3>
                        <h3 className='text_cuentaPago'>magc290598@gmail.com</h3>
                        <h3 className='text_cuentaPago'>Titular:</h3>
                        <h3 className='text_cuentaPago'>María Alejandra Garcia</h3>
                        <CopyToClipboard
                            text={cuentas.paypal}
                            onCopy={() => {
                                toast.success('magc290598@gmail.com\nMaría Alejandra Garcia', {
                                    iconTheme: {
                                        primary: '#713200'
                                    }
                                });
                            }}
                        >
                            <button className='icon-btn'>
                                <img src={icon_copy} />
                            </button>
                        </CopyToClipboard>
                    </div>
                    <Toaster />
                    <div className="cuentaPago">
                        <h2 className='titl_CuentaPago'>PagoMovil</h2>
                        <img src={pagomovil} className='img_cuentaPago' alt="Zelle" />
                        <h3 className='text_cuentaPago'>Cuenta:</h3>
                        <h3 className='text_cuentaPago'>04147014646</h3>
                        <h3 className='text_cuentaPago'>Titular:</h3>
                        <h3 className='text_cuentaPago'>Vanessa Rincón</h3>
                        <h3 className='text_cuentaPago'>Cedúla</h3>
                        <h3 className='text_cuentaPago'>21453387</h3>
                        <CopyToClipboard
                            text={cuentas.pagomovil}
                            onCopy={() => {
                                toast.success('04147014646\nVanessa Rincón\n21453387', {
                                    iconTheme: {
                                        primary: '#713200'
                                    }
                                });
                            }}
                        >
                            <button className='icon-btn'>
                                <img src={icon_copy} />
                            </button>
                        </CopyToClipboard>
                    </div>
                    <Toaster />
                    <div className="cuentaPago">
                        <h2 className='titl_CuentaPago'>Banco de Venezuela</h2>
                        <img src={bancovenezuela} className='img_cuentaPago' alt="Zelle" />
                        <h3 className='text_cuentaPago'>Cuenta:</h3>
                        <h3 className='text_cuentaPago'>V-21453387</h3>
                        <h3 className='text_cuentaPago'>Titular:</h3>
                        <h3 className='text_cuentaPago'>Vannesa Rincón</h3>
                        <CopyToClipboard
                            text={cuentas.bancovenezuela}
                            onCopy={() => {
                                toast.success('V-21453387\nVannesa Rincón', {
                                    iconTheme: {
                                        primary: '#713200'
                                    }
                                });
                            }}
                        >
                            <button className='icon-btn'>
                                <img src={icon_copy} />
                            </button>
                        </CopyToClipboard>
                    </div>
                    <Toaster />
                </div>
            </div>
        </>
    )
}

/**
 * *TODO: Crear los contenedores de las cuentas de pago
 * *TODO: Crear un boton con cuya funcion copie los datos de las cuentas
 */
