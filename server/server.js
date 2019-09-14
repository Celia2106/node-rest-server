require('./config/config');

const express = require('express');
const mongoose=require('mongoose');
const app = express();
const body=require('body-parser');

app.use(body.urlencoded({extend:false}));
app.use(body.json());
app.use(require('./rutas/usuario'));

mongoose.connect(process.env.URLDB,(err,res)=>{
    if(err)
        throw err;
    else
        console.log('conectado')
});

app.listen(process.env.PORT,()=>console.log('escuchando puerto'));