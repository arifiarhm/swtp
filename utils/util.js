import nodemailer from 'nodemailer';

// Funktion zum Senden einer Verifizierungs-E-Mail
export const sendVerificationEmail = (email, verificationToken) => {
    // Erstellen eines Nodemailer-Transporters mit Gmail-Dienst
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your_email@gmail.com', // Deine Gmail-E-Mail-Adresse
            pass: 'your_email_password' // Dein Gmail-E-Mail-Passwort oder Anwendungspasswort
        }
    });

    // Konfiguration für die E-Mail
    const mailOptions = {
        from: 'your_email@gmail.com', // Absenderadresse
        to: email, // Empfängeradresse (Benutzer-E-Mail für Verifizierung)
        subject: 'Account-Verifizierung', // Betreff der E-Mail
        text: `Klicken Sie auf den Link, um Ihre E-Mail zu verifizieren: http://localhost:5001/verify/${verificationToken}` // Text der E-Mail mit Verifizierungslink
    };

    // Senden der E-Mail über den Transporter
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error); // Konsolenausgabe bei einem Fehler
        } else {
            console.log('Email sent: ' + info.response); // Konsolenausgabe bei erfolgreicher E-Mail-Zustellung
        }
    });
};
