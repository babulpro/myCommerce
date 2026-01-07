import { jwtVerify, SignJWT } from "jose"

 export async function CreateJwtToken(role,id) {
    const Secret= new TextEncoder().encode("123-xyz")
    let token = await new SignJWT({role,id})
                .setProtectedHeader({alg:'HS256'})
                .setIssuedAt()
                .setIssuer("babul1946@gmail.com")
                .setExpirationTime("168h")
                .sign(Secret);

    return token
    
 }


export async function DecodedJwtToken(token) {
    const Secret= new TextEncoder().encode("123-xyz")
    const decodedToken = await jwtVerify(token,Secret)
    return decodedToken['payload']   
    
}