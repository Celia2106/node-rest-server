
process.env.PORT=process.env.PORT || 3000;


process.env.NODE_ENV= process.env.NODE_ENV || 'dev';

let urlBD;
if(process.env.NODE_ENV==='dev')
    urlBD='mongodb://localhost:27017/cafe';
else
    urlBD='mongodb+srv://celia:lWbNcq0sh2SUm0me@cluster0-yf3ok.mongodb.net/cafe?retryWrites=true&w=majority';

process.env.URLDB=urlBD;


//expiracion token
//60 segundos*60 minutos*24horas*30dias
process.env.CADUCIDAD_TOKEN=60*60*24*30;
//seed
process.env.SEED=process.env.SEED || 'secret-dev';


process.env.CLIENT_ID=process.env.CLIENT_ID || '1072597933127-t6ifafmlm0i8ijdjstf88c8tcluo5on4.apps.googleusercontent.com';