import {Sequelize} from "sequelize"; 
const db = new Sequelize ('swtp','postgres','merdeka1945', {
    host: "localhost",
    dialect: "postgres"
});
export default db;