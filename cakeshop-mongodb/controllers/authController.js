const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const {promisify} = require('util') //promesas asincronicas
const { nextTick } = require('process')

//process for registering
exports.register = async(req, res) => {

    try {
        //capture name, user and password:
    const name = req.body.name;
    const user = req.body.user;
    const pass = req.body.pass;
    console.log(name, user, pass);

    let passHash = await bcryptjs.hash(pass, 8);
    console.log(passHash);

    conexion.query('INSERT INTO users_login SET ?', {user:user, name: name, pass: passHash}, (error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/');
        }
    })

    } catch (error) {
        console.log(error);
        
    }

    

}

exports.login = async(req, res) => {

    try {
        const user = req.body.user; //from the form login.js
        const pass = req.body.pass;
        console.log(user, pass);

        if(!user || !pass ){
            res.render('login',{
                alert:true,
                alertTitle: "Warning!",
                alertMessage: "Introduce User and or Password! :o",
                alertIcon:'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        }else{
            conexion.query('SELECT * FROM users_login WHERE user = ?', [user], async (error, results)=>{
                if( results.length == 0 || ! (await bcryptjs.compare(pass, results[0].pass)) ){
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "User with Password incorrect :(  !",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    })
                }else{
                    //created session successful:
                    const id = results[0].id
                    const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
                    console.log("TOKEN: "+token+" for the USER : "+user)
                
                //cookies
                const cookiesOptions = {
                    expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true}

               res.cookie('jwt', token, cookiesOptions)
               res.render('login', {
                    alert: true,
                    alertTitle: "Successful!",
                    alertMessage: "Correct Login:) ",
                    alertIcon:'success',
                    showConfirmButton: false,
                    timer: 800,
                    ruta: ''
               })

            }

            })

        }
                    

    } catch (error) {
        console.log(error);
        
    }

    

}

//authentication (middleware used called "next")
//https://expressjs.com/en/guide/writing-middleware.html
exports.isAuthenticated = async(req, res, next) => {
    //revisar cookies
    if (req.cookies.jwt) {
        try {
            //verificar el token (decodificar)
            const decodificada = await promisify (jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            //despues de decodificar, conectar al MYSQL
            conexion.query('SELECT * FROM users_login WHERE id = ?', [decodificada.id], (error, results)=>{
                if (!results){return next()} //en caso de que no tenga ningun valor
                req.user = results[0]
                return next()

            })
        } catch (error) {
            console.log(error);
            return next();
            
        }
    }else { //si no esta autenticado, se redirige al login
        res.redirect('login');
    }
}

//logout (process where eliminates the cookie)
exports.logout = (req, res)=>{
    res.clearCookie('jwt')   
    return res.redirect('/')
}