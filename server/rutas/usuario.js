const express = require('express');
const bCrypt=require('bcrypt');
const _=require('underscore');
const app = express();
const Usuario= require('../modelos/usuario');
const {verificaToken,verificaRolAdmin}=require('../middlewares/authentication');


app.get('/usuario',verificaToken,(req, res)=> {
    //parametros opcionales
    let desde=req.query.desde || 0;
    desde=Number(desde);
    let limite=req.query.limite || 5;
    limite=Number(limite);
    //Se salta los primeros 5 registros y luego devuelve los 5 siguientes
    Usuario.find({estado:true},'nombre email role estado google img')//{}aqui irian las condiciones por ejemple google:true
        .skip(desde)
        .limit(limite)
        .exec((err,usuarios)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        Usuario.count({estado:true},(err,total)=>{
            return res.json({
                ok:true,
                usuarios,
                total
            })
        });

    });
});
app.post('/usuario',[verificaToken,verificaRolAdmin], function (req, res) {
    let body=req.body;

    let usuario=new Usuario({
        nombre:body.nombre,
        email:body.email,
        password:bCrypt.hashSync(body.password,10),
        role:body.role
    });

    usuario.save((err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        return res.json({
            ok:true,
            usuario:usuarioDB
        });

    });
});

app.put('/usuario/:id',[verificaToken,verificaRolAdmin], function (req, res) {
    let id=req.params.id;
    //para limitar los campos que se pueden actualizar
    let body=_.pick(req.body,['nombre','email','img','role','estado']);
    Usuario.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,usuarioDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            usuario: usuarioDB
        });
        usuarioDB.save();
    });


});

app.delete('/usuario/:id',[verificaToken,verificaRolAdmin], function (req, res) {
    let id=req.params.id;

    //borrado físico
    /*Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        if(!usuarioBorrado){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Usuario no encontradp'
                }
            });
        }
        res.json({
            ok:true,
            usuario:usuarioBorrado
        });

    });*/

    //borrado actualizando el estado a false
    let cambiaEstado={estado:false};
    Usuario.findByIdAndUpdate(id,cambiaEstado,{new:true},(err,usuarioDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            usuario: usuarioDB
        });
        usuarioDB.save();
    });







});

module.exports=app;