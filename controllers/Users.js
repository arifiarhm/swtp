
import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/util.js"

//benutzerdaten abrufen
export const getUsers = async(req,res) => {
    try {
        const users = await Users.findAll({
            attributes:['id', 'name', 'email']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
        
    } 
}

//benutzer registrieren
export const Register = async(req,res) => {
    const { name, email, password, confPassword} = req.body;

    //password validieren
    if(password !== confPassword) return res.status(400).json({msg: "ungültiges Password"});

    //passwort verschlüsseln
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    //verif.token erstellen
    const verificationToken = jwt.sign({ email }, process.env.VERIFICATION_TOKEN_SECRET, {
        expiresIn: '1d'
    });

    try {
        //benutzerdaten in db speichern
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            verification_token: verificationToken
        });

        // email verification an user senden
        sendVerificationEmail(email, verificationToken);

        res.json({msg: "Registrierung erfolgreich. Überprüfen Sie Ihre E-Mail zur Verifizierung Ihres Kontos."});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Fehler bei der Registrierung"});
    }
}

//benutzer einloggen
export const Login = async(req, res) => {
    try {
         // Benutzer anhand der E-Mail suchen
        const user = await Users.findAll({
            where: {
                 email: req.body.email
            }
        });

        //überprüfen der Passwortübereinstimmung
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "falsches Passwort"});
        // Zugriffstoken und Refresh-Token erstellen
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        // Refresh-Token in der Datenbank aktualisieren
        await Users.update({refresh_token: refreshToken},{
             where: {
                id: userId
            }
        });

        // Refresh-Token als Cookie setzen
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        // Zugriffstoken als Respon senden
        res.json({ accessToken });

    } catch (error) {
        res.status(404).json({msg: "E-Mail nicht gefunden"});
    }
}

//benutzer ausloggen
export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);

    // Benutzer anhand des Refresh-Tokens suchen
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });

    if(!user[0]) return res.sendStatus(204);

     // Refresh-Token in der Datenbank auf null setzen
    const userId = user[0].id;
    await Users.update({refresh_token: null},{
        where:{
            id: userId
        }
    });

    // Cookie Refresh-Token löschen
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}