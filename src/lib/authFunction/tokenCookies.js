import { CreateJwtToken } from "./JwtHelper";

 export async function TokenCookies(email,id) {
    let token = await CreateJwtToken(email,id);
    return {'Set-Cookie':`token= ${token};Max-Age=7200;Secure;HttpOnly,Path=/;SameSite=Strict`}
    
 }