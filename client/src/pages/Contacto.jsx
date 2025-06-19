import internet from "../assets/internet_blanco.png";
import whatsapp from "../assets/whatsapp.png";
import telegrama from "../assets/telegrama.png";
import instagram from "../assets/instagram.png"

export const Contacto = () => {
    return (
        <>
            {/* <h3 className="titlFooter">Contactos:</h3> */}
            <div className="contFooter">
                <div className="nameFooter">
                    <h5>Sitio Web </h5>
                    <h5>WhatsApp</h5>
                    <h5>Telegram</h5>
                    <h5>Instagram</h5>
                </div>
                <div className="itemFooter">
                    <a href="#" className="a_footer">
                        <img src={internet} alt="website" className="img_footer" />
                        <p>sorteos.com</p>
                    </a>
                    <a href="#" className="a_footer">
                        <img src={whatsapp} alt="whatsApp" className="img_footer" />
                        <p>+57 302 45789</p>
                    </a>
                    <a href="#" className="a_footer">
                        <img src={telegrama} alt="Telegram" className="img_footer" />
                        <p>Sorteo</p>
                    </a>
                    <a href="#" className="a_footer">
                        <img src={instagram} alt="Instagram" className="img_footer" />
                        <p>Sorteo</p>
                    </a>
                </div>
            </div>
        </>
        /**
         * TODO: Agregar un border interactivo, que, cuando se haga clicl se coloque de un color mar llamativo
         * TODO: Cuandos se haga clicl el icono y el <a> se moverean
         */
    )
}
