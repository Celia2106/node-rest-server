const express=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const Usuario= require('../modelos/usuario');
const app = express();



module.exports=app;

app.post('/login',(req,res)=>{
    let body=req.body;

    Usuario.findOne({
        email:body.email,
    },(err,userDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
      if(!userDB){
          return res.status(400).json({
              ok:false,
              err:{
                  message:'(Usuario) o contraseña incorrectos'
              }
          });
      }

     if(!bcrypt.compareSync(body.password,userDB.password)){
         return res.status(400).json({
             ok:false,
             err:{
                 message:'Contraseña incorrecta'
             }
         });
     }

     let token= jwt.sign({
         usuario:userDB
     },process.env.SEED,{
         expiresIn:process.env.CADUCIDAD_TOKEN //expira en 30 dias
     });

     res.json({
         ok:true,
         usuario:userDB,
         token
     });



    });

});