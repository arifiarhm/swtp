import express from "express";
import { getUsers, Register, Login, Logout } from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerrifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

// Endpunkte und zugehörige Controller-Funktionen definieren

// GET-Anforderung an den Endpunkt '/users' mit Middleware 'verifyToken' und Controller-Funktion 'getUsers'
router.get('/users', verifyToken, getUsers);

// POST-Anforderung an den Endpunkt '/users' mit Controller-Funktion 'Register'
router.post('/users', Register);

// POST-Anforderung an den Endpunkt '/login' mit Controller-Funktion 'Login'
router.post('/login', Login);

// GET-Anforderung an den Endpunkt '/token' mit Controller-Funktion 'refreshToken'
router.get('/token', refreshToken);

// DELETE-Anforderung an den Endpunkt '/logout' mit Controller-Funktion 'Logout'
router.delete('/logout', Logout);

// GET-Anforderung an den Endpunkt '/verify/:token' für die E-Mail-Verifizierung
router.get('/verify/:token', async (req, res) => {
    // Extrahieren des Verifizierungstokens aus den Routenparametern
    const verificationToken = req.params.token;
    
    try {
        // Verifiziere das Token und erhalte die dekodierte Information
        const decoded = jwt.verify(verificationToken, process.env.VERIFICATION_TOKEN_SECRET);
        // Extrahiere die E-Mail-Adresse aus der dekodierten Information
        const userEmail = decoded.email;

        // Markiere das Benutzerkonto als verifiziert in der Datenbank
        await Users.update({ verified: true }, { where: { email: userEmail } });

        // Umleitung zur Login-Seite oder Erfolgsseite nach erfolgreicher Verifizierung
        res.redirect('http://localhost:3000/login');
    } catch (error) {
        // Behandlung von Fehlern bei ungültigem Verifizierungstoken
        console.error(error);
        res.status(400).send('Ungültiges Verifizierungstoken');
    }
});

// Exportiere den Router für die Verwendung in anderen Dateien
export default router;
