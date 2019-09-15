const express=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();


    return {
        nombre:payload.name,
        email:payload.email,
        img:payload.picture,
        google:true
    }

}


app.post('/google',async (req,res)=>{
    let token=req.body.idtoken;

    let googleUser=await verify(token)
        .catch(e=>{
           return res.status(403).json({
                ok:false,
                err:e
            });
        });

    Usuario.findOne({email:googleUser.email},(err,userDB)=>{
        if(err)
            return res.status(500).json({
            ok:false,
                err
        });

        if(userDB){//si existe en bd
            if(userDB.google===false)//si no se ha autenticado con google
                return res.status(500).json({
                    ok:false,
                    err:{
                        message:'Debe usar una autenticacion normal'
                    }
                });
            else{
                //si se ha autenticado con google le renovamos el token
                let token=jwt.sign({
                    usuario:userDB,
                },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});
                return res.json({
                    ok:true,
                    usuario:userDB,
                    token
                });

            }
        }else{//usa autenticacion de google para identificarse
            let usuario=new Usuario();

            usuario.nombre=googleUser.nombre;
            usuario.email=googleUser.email;
            usuario.img=googleUser.img;
            usuario.google=true;
            usuario.password=':)';

            usuario.save((err,userDB)=>{
                if(err)
                    return res.status(500).json({
                        ok:false,
                        err
                    });

                
                let token=jwt.sign({
                    usuario:userDB,
                },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});
                return res.json({
                    ok:true,
                    usuario:userDB,
                    token
                });

            });
        }



    });

    //res.json(googleUser);


});