import { jwtVerify, SignJWT } from "jose"

 export async function CreateJwtToken(email,id,days) {
    const Secret= new TextEncoder().encode(process.env.jwtSecret)
    let token = await new SignJWT({email,id})
                .setProtectedHeader({alg:'HS256'})
                .setIssuedAt()
                .setIssuer("babul1946@gmail.com")
                .setExpirationTime(days)
                .sign(Secret);

    return token
    
 }


export async function DecodedJwtToken(token) {
    const Secret= new TextEncoder().encode(process.env.jwtSecret)
    const decodedToken = await jwtVerify(token,Secret)
    return decodedToken['payload']   
    
}