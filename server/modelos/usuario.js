const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');

let Schema=mongoose.Schema;
let rolesValidos={
    values:['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};
let usuarioSchema=new Schema({
    nombre:{
        type: String,
        required:[true,'EL nombre es requerido']//para msj español
    },
    email:{
        type: String,
        unique:true,
        require:[true,'El correo es requerido']
    },
    password:{
        type:String,
        required:[true,'La contraseña es requerida']
    },
    img:{
        type:String,
        required:false
    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum:rolesValidos
    },
    estado:{
        type: Boolean,
        default:true
    },
    google: {
        type: Boolean,
        default:false
    }
});
usuarioSchema.methods.toJSON=function(){
    // con esto creamos un obj sin el pass para devolver al user
    let user=this;
    let userObj=user.toObject();

    delete userObj.password;
    return userObj;
};

usuarioSchema.plugin(uniqueValidator,{
    message:'{PATH} debe de ser único'
});

module.exports=mongoose.model('Usuario',usuarioSchema);


