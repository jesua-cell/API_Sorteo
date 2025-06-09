import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// export const generateToken = (user) => {
//     return jwt.sign(
//         {id: user.id, username: user.username},
//         JWT_SECRET,
//         {expiresIn: '365d'}
//     );
// };

// export const verifyToken = (token) => {
//     return jwt.verify(token, JWT_SECRET);
// };


export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '365d' });
};

export const verifyToken = (token) => { 
    return jwt.verify(token, process.env.JWT_SECRET);
};