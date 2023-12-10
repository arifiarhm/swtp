import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async(req, res) => {
    try {
        // Hole das Refresh Token aus dem Cookie der Anfrage
        const refreshToken = req.cookies.refreshToken;
        // Wenn kein Refresh Token vorhanden ist, sende den Status 401 (Unberechtigt)
        if(!refreshToken) return res.sendStatus(401);
        // Suche den Benutzer anhand des Refresh Tokens in der Datenbank
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });

        // Wenn der Benutzer nicht gefunden wird, sende den Status 403 (Verboten)
        if(!user[0]) return res.sendStatus(403);
        // Verifiziere das Refresh Token mit dem entsprechenden Geheimnis
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            // Wenn ein Fehler bei der Verifizierung auftritt, sende den Status 403 (Verboten)
            if(err) return res.sendStatus(403);

            // Hole die Benutzerinformationen aus dem Ergebnis der Verifizierung
            const userId = user[0].id;
            const name = user[0].name;
            const email = user[0].email;

             // Erstelle ein neues Zugriffstoken unter Verwendung der Benutzerinformationen
            const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '60s'
            });

            // Sende das neue Zugriffstoken als Respon
            res.json({ accessToken });

        });

    } catch (error) {
        // Behandle Fehler, indem man sie in die Konsole druckt
        console.log(error);
    }
}