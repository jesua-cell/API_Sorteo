import internet from "../assets/red_mundial.png";
import whatsapp_alt from '../assets/whatsapp_alt.png';
import instagram_alt from '../assets/instagram_alt.png';
import tiktok from '../assets/tiktok.png';


export const Contacto = () => {
    return (
        <>
            <div className="contFooter">
                <div className="itemFooter">
                    <a href="#" className="a_footer">
                        <img src={internet} alt="website" className="img_footer" />
                        <p>laOrquídea.com</p>
                    </a>
                    <a
                        href="https://wa.me/584121373761"
                        className="a_footer"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src={whatsapp_alt} alt="whatsApp" className="img_footer" />
                        <p>La Orquídea</p>
                    </a>
                    <a
                        href="https://www.tiktok.com/@la.orquidea38?_t=ZS-8xhSaTav4XR&_r=1"
                        className="a_footer"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src={tiktok} alt="Tiktok" className="img_footer" />
                        <p>La Orquídea</p>
                    </a>
                    <a
                        href="https://www.instagram.com/laorquidea2025?igsh=cjN5MXpqam9ja2g2"
                        className="a_footer"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src={instagram_alt} alt="Instagram" className="img_footer" />
                        <p>La Orquídea</p>
                    </a>
                </div>
            </div>
        </>
        /**
         * *TODO: Agregar un border interactivo, que, cuando se haga clicl se coloque de un color mar llamativo
         * *TODO: Cuandos se haga clicl el icono y el <a> se moverean
         */
    )
}
