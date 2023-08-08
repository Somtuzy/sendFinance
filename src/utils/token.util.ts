import jwt, { JwtPayload } from 'jsonwebtoken' 
import { IUser } from '../interfaces/user.interface'

const secretKey = <string>process.env.JWT_SECRET_KEY
const expiresIn = <string>process.env.JWT_EXPIRES_IN

// Generates a token by signing a user's unique details against a secret key whenever they sign in.
export const generateToken = async (payload: Partial <IUser>): Promise<string> => {
    return jwt.sign(payload, secretKey, {expiresIn: expiresIn})  
}

// Verifies the authenticity of a user by checking the validity of the user's token against the secret key
export const verifyToken = async (token: string): Promise<string | JwtPayload> => {
    return jwt.verify(token, secretKey)  
}

export const checkTokenValidity = async (token: string): Promise<boolean> => {
    // Decode the token to extract the expiration date
    const decoded = jwt.decode(token);
    const expirationDate = new Date((decoded as jwt.JwtPayload).exp as number * 1000);

    // Checks if the token is expired
    if (token && expirationDate <= new Date()) {
        return false
      }
    return true
}