const jwt=require('jsonwebtoken');

let verificaToken=(req,res,next)=>{
    let token=req.body.token;

    jwt.verify(token,process.env.SEED,(err,infoDecoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:'Token no valido'
                }
            });
        }
        req.usuario=infoDecoded.usuario;
        next();//para que la funcion en la que se llama siga
    });
};


let verificaRolAdmin=(req,res,next)=>{
    let usuario=req.usuario;
    if(usuario.role==='ADMIN_ROLE')
        next();
    else
        return res.status(401).json({
            ok:false,
            err:{
                message:'No tiene permisos'
            }
        });



};

module.exports={verificaToken,verificaRolAdmin};