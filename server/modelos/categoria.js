const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');

let Schema=mongoose.Schema;
let rolesValidos={
    values:['ADMIN_ROLE'],
    message: '{VALUE} no es un rol válido'
};
let categoriaSchema=new Schema({
    descripcion:{
        type: String,
        required:[true,'La des es requerido']//para msj español
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});
categoriaSchema.methods.toJSON=function(){
    // con esto creamos un obj sin el pass para devolver al user
    let categoria=this;
    let categoriaObj=categoria.toObject();
    return categoriaObj;
};
categoriaSchema.plugin(uniqueValidator,{
    message:'{PATH} debe de ser único'
});

module.exports=mongoose.model('Categoria',categoriaSchema);