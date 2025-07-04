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
                        <p>laOrquedea.com</p>
                    </a>
                    <a href="#" className="a_footer">
                        <img src={whatsapp_alt} alt="whatsApp" className="img_footer" />
                        <p>La Orquídea</p>
                    </a>
                    <a href="#" className="a_footer">
                        <img src={tiktok} alt="Tiktok" className="img_footer" />
                        <p>La Orquídea</p>
                    </a>
                    <a href="#" className="a_footer">
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
