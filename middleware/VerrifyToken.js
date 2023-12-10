//middlewar zur verizifierung des Token Access

import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {

    //Token aus dem Autorisierungsheader zu erhalten
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    //Wenn das Token nicht vorhanden ist, wird der Statuscode 401 (Unauthorized) an den benutzer zurückgesendet
    if(token == null) return res.sendStatus(401);

    /*verwendet die Funktion JWT, um das Token mit dem zuvor beim Signieren des Tokens 
      verwendeten Geheimschlüssel zu überprüfen. Wenn die Überprüfung fehlschlägt, 
      wird der Statuscode 403 (Forbidden) an den Benutzer zurückgesendet*/
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
       if(err) return res.sendStatus(403);

       //wenn erfolgreich, werden die Informationen aus dem Token (nur die E-Mail-Adresse) imr equest gespeichert, 
       //sodass diese Informationen von der nächsten Route oder Middleware abgerufen werden können.
       req.email = decoded.email;
       next(); 
    })
}