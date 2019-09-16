const express=require('express');

const {verificaToken}=require('../middlewares/authentication');

let app=express();

let Producto= require('../modelos/producto');


app.get('/productos',(req,res)=>{
    Producto.find({},'descripcion')
        .sort('descripcion')
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .skip(0)
        .exec((err,productos)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }

            return res.json({
                ok:true,
                productos
            })
        });
});
app.get('/productos/buscar/:termino',verificaToken,(req,res)=>{
    let termino=req.params.termino;
    let regex=new RegExp(termino,'i')
   //asi busca literalmente el calor Producto.find({nombre:termino}
    Producto.find({nombre:regex})
        .populate('categoria','descripcion')
        .exec((err,productos)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            res.json({
                ok:true,
                productos
            });
        });


});

app.get('/productos/:id',(req,res)=>{
    console.log('aqui');
    Producto.findById(req.params.id,{})
        .populate('usuario','nombre email')
        .exec((err,producto)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err:{message:'priducto no encontrado'}
                });
            }
            return res.json({
                ok:true,
                producto
            })
        });

});


app.post('/productos/:id',verificaToken,(req,res)=>{
    //grabar el user una categoria de una ya existente
    let body=req.body;

    let producto=new Producto({
        nombre: body.nombre,
        precioUni:33,
        descripcion:body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        return res.json({
            ok:true,
            producto:productoDB
        });

    });
});
app.put('/productos/:id',(req,res)=>{
    let id=req.params.id;
    //para limitar los campos que se pueden actualizar
    let body=req.body;
    Producto.findByIdAndUpdate(id,body,{new:true,runValidators: true},(err,productoDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            producto: productoDB
        });
        productoDB.save();
    });
});
app.delete('/productos/:id',(req,res)=>{

    let id=req.params.id;
    let cambiaEstado={disponible:false};
    Producto.findByIdAndUpdate(id,cambiaEstado,{new:true},(err,productoDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            producto: productoDB
        });
        productoDB.save();
    });




});
module.exports=app;
