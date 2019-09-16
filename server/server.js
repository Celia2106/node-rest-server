require('./config/config');

const express = require('express');
const mongoose=require('mongoose');
const path=require('path');
const app = express();
const body=require('body-parser');

app.use(body.urlencoded({extend:false}));
app.use(body.json());
//habilitar carpeta public desde fuera
app.use(express.static(path.resolve(__dirname,'../public')));
app.use(require('./rutas/index'));

mongoose.connect(process.env.URLDB,(err,res)=>{
    if(err)
        throw err;
    else
        console.log('conectado');
});

app.listen(process.env.PORT,()=>console.log('escuchando puerto'));