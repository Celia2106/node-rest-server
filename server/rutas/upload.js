const express=require('express');
const fileUpload=require('express-fileupload');
const fs=require('fs');
const path=require('path');
let app= express();

app.use(fileUpload());

app.put('/upload/:tipo/:id',(req,res)=>{
    let tipo=req.params.tipo;
    let id=req.params.id;

    let tipos=['productos','usuarios'];

    if(tipos.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,
            err:{
                message: 'Los tipos permitidas son '+tipos.join(', ')
            }
        })
    }

    Usuario=require('../modelos/usuario');
    Producto=require('../modelos/producto');

    if(!req.files)
        return res.status(400).json({
            ok:false,
            err:{
                message:'NO se ha selecttionado ningun archivo'
            }
        });

    let fichero=req.files.archivo;
    let extensiones=['png','jpg','jpeg','gif'];
    let nombreArchivo=fichero.name.split('.');
    let extension=nombreArchivo[nombreArchivo.length-1];

    if(extensiones.indexOf(extension)<0){
        return res.status(400).json({
            ok:false,
            err:{
                message: 'LAs extensiones permitidas son'+extensiones.join(', ')
            }
        })
    }
//change name to file

    let nombreFIchero=`${id}-${new Date().getMilliseconds()}.${extension}`;

    fichero.mv(`uploads/${tipo}/${nombreFIchero}`,(err)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(tipo=='usuarios')
            imagenUsuario(id,res,nombreFIchero);
        else
            imagenPrducto(id,res,nombreFIchero);
    });
});
function imagenUsuario(id,res,nombreFIchero){
    Usuario.findById(id,(err,usuarioDB)=>{
        if(err){
            borrarArchivo(nombreFIchero,'usuarios');
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!usuarioDB){
            borrarArchivo(nombreFIchero,'usuarios');
            return res.status(500).json({
                ok:false,
                err:{
                    message:'Usuario no existe'
                }
            });
        }


        borrarArchivo(usuarioDB.img,'usuarios');

        usuarioDB.img=nombreFIchero;

        usuarioDB.save((err,userBD)=>{
            return res.json({
                ok:true,
                usuario:'USer guardado ok',
                img:nombreFIchero
            })
        });

    });
}
function imagenPrducto(id,res,nombreFIchero){
    Producto.findById(id,(err,productoDB)=>{
        if(err){
            borrarArchivo(nombreFIchero,'productos');
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!productoDB){
            borrarArchivo(nombreFIchero,'productos');
            return res.status(500).json({
                ok:false,
                err:{
                    message:'Producto no existe'
                }
            });
        }


        borrarArchivo(productoDB.img,'productos');

        productoDB.img=nombreFIchero;

        productoDB.save((err,userBD)=>{
            return res.json({
                ok:true,
                producto:'PRoducto guardado ok',
                img:nombreFIchero
            })
        });

    });
}

function borrarArchivo(nombreImg,tipo){
    let pathImagen=path.resolve(__dirname,`../../uploads/${tipo}/${nombreImg}`);
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }
}

module.exports=app;