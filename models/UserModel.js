
import { Sequelize } from "sequelize";
import db from "../config/database.js";
const { DataTypes } = Sequelize;

// Definition des Benutzermodells für die db tabelle 'benutzer'
const Users = db.define('benutzer', {
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    refresh_token: {
        type: DataTypes.TEXT
    },
},{
    // Festlegen des Tabellennamens in der Datenbank als 'benutzer'
    freezeTableName:true
});

// Exportieren des Benutzermodells für die Verwendung in anderen Dateien
export default Users;