const express = require('express');
const router = express.Router();

const conexion = require('../database/db')

const authController = require('../controllers/authController')

//%%%%%% ROUTERS PARA LAS VISTAS %%%%%% %%%%%% %%%%%% %%%%%% %%%%%% %%%%%% %%%%%%
//%%%%%% DASHBOARD %%%%%%
router.get('/', authController.isAuthenticated, (req, res)=>{
    
  res.render('index', {user:req.user})
    
    

})

//%%%%%% LOGIN %%%%%%
router.get('/login', (req, res)=>{
    
    res.render('login', {alert:false})
   
      
  
  })

//%%%%%% REGISTER %%%%%%
router.get('/register', (req, res)=>{
    
    res.render('register')
      
      
  
  })

//%%%%%% USERS %%%%%%
router.get('/user_roles', (req, res)=>{
    
    conexion.query('SELECT * FROM users', (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('user_roles', {results:results});
        }
    });
    

})

//%%%%%% USERS CREATE %%%%%%
router.get('/create', (req, res)=>{
    
    conexion.query('SELECT * FROM users', (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('create', {results:results});
        }
    });
    

})

//%%%%%% USERS EDIT %%%%%%
router.get('/edit/:id', (req, res)=>{
    const id = req.params.id;
    
    conexion.query('SELECT * FROM users WHERE id=?', [id], 
    (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('edit', {user:results[0]});
        }
    });
    

})

//%%%%%% USERS DELETE %%%%%%
router.get('/delete/:id', (req, res)=>{
    const id = req.params.id;
    conexion.query('DELETE FROM users users WHERE id=?', [id],
    (error, results)=>{
        if(error){
            throw error;
        }else{
            res.redirect('/user_roles');
        }
    });
    

})
//%%%%%% CAKE REVIEW %%%%%%
router.get('/cake_review', (req, res)=>{
    conexion.query('SELECT * FROM cake_review', (error, results)=>{
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
    

})

const crud = require('../controllers/crud.js');
router.post('/save', crud.save);
router.post('/update', crud.update);

//%%%%%% ROUTERS PARA LOS METODOS DEL CONTROLLER %%%%%% %%%%%% %%%%%% %%%%%% %%%%%% %%%%%% %%%%%%

//%%%%%% REGISTER POST %%%%%%
router.post('/register', authController.register);

//%%%%%% LOGIN POST %%%%%%
router.post('/login', authController.login);

//%%%%%% LOGOUT %%%%%%
router.get('/logout', authController.logout);





module.exports = router;