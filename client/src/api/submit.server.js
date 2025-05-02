import axios from 'axios';

export const createJugador = async (formData) => {

    try {
        const response = await axios.post("http://localhost:3000/nuevo_jugador", formData);
        return response.data;
    } catch (error) {
        return {
            success: false,
            error: error?.response?.error || "Error en el envio del Formulario (axios)",
            status: error?.response?.status
        }
    }
};