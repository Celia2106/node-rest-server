const express=require('express');

let {verificaToken}= require('../middlewares/authentication');

let app= express();
let Categoria=require('../modelos/categoria');

app.get('/categoria',(req,res)=>{
    Categoria.find({},'descripcion')
        .sort('descripcion')
        .populate('usuario','nombre email')
        .exec((err,categorias)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }
                return res.json({
                    ok:true,
                    categorias
                })
        });

});

app.get('/categoria/:id',(req,res)=>{
    Categoria.findById(req.params.id,{})//{}aqui irian las condiciones por ejemple google:true
        .exec((err,categoria)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err:{message:'categoria no encontrada'}
                });
            }
                return res.json({
                    ok:true,
                    categoria
                })
        });
});

app.post('/categoria',verificaToken,(req,res)=>{
    //crear nueva categoria
    let body=req.body;
    let categoria=new Categoria({
        descripcion:body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        return res.json({
            ok:true,
            categoria:categoriaDB
        });

    });
});

app.put('/categoria/:id',(req,res)=>{
    //actualizar nombre categoria
    let id=req.params.id;
    //para limitar los campos que se pueden actualizar
    let body=req.body;
    Categoria.findByIdAndUpdate(id,body,{new:true,runValidators: true},(err,categoriaDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            categoria: categoriaDB
        });
        categoriaDB.save();
    });
});
app.delete('/categoria/:id',(req,res)=>{
//solo un admin_role puede borrar
    Categoria.findByIdAndRemove();


    let id=req.params.id;

    //borrado físico
    Categoria.findByIdAndRemove(id,(err,categoriaBorrada)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        if(!categoriaBorrada){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'categoria no encontradp'
                }
            });
        }
        res.json({
            ok:true,
            categoria:categoriaBorrada
        });

    });

});
module.exports=app;