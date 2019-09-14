
process.env.PORT=process.env.PORT || 3000;


process.env.NODE_ENV= process.env.NODE_ENV || 'dev';

let urlBD;
if(process.env.NODE_ENV==='dev')
    urlBD='mongodb://localhost:27017/cafe';
else
    urlBD='mongodb+srv://celia:lWbNcq0sh2SUm0me@cluster0-yf3ok.mongodb.net/cafe?retryWrites=true&w=majority'

process.env.URLDB=urlBD;