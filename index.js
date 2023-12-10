import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/database.js";
import router from "./routes/index.js";

const app = express();

// Middleware für JSON- und URL-Parameter-Analyse hinzufügen
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfiguration für Umgebungsvariablen aus der .env-Datei
dotenv.config();

try {
    // Verbindung zur Datenbank überprüfen und auf der Konsole eine Meldung ausgeben
    await db.authenticate();
    console.log('Database connected..');
} catch (error) {
    // Fehler behandeln und auf der Konsole ausgeben, wenn die Verbindung zur Datenbank fehlschlägt
    console.error(error);
}

// Middleware für CORS konfigurieren
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// Middleware für das Analysieren von Cookies hinzufügen
app.use(cookieParser());

// Routen-Handler hinzufügen
app.use(router);

// Server starten und listen at Port 5001 
app.listen(5001, () => console.log('Server running at port 5001'));
