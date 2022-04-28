const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: 'ORACLE545901',
    database: 'cake_shop',
})

conexion.connect((error)=>{
    if (error){
        console.error('error de conexion es:' + error);
        return
    }
    console.log("connectado a la DB MYSQL");
})

module.exports = conexion;

