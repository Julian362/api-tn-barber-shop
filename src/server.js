const express = require("express");
const cors = require("cors");
const { persona } = require("./datos");
const mongoose= require("mongoose");
const producto = require("./models/prodcutoModel");

const app = express();
app.use(cors());
app.use(express.json());

const url = "mongodb+srv://DavHD:PhmFRjvYHmaSB4P@misiontic.d2mqp.mongodb.net/barbershop?retryWrites=true&w=majority";

mongoose.connect(url,{

})
.then( ()=> console.log('Conectado a mongo'))
.catch( (e)=> console.log('error en la conexion es' + e))

const PersonasSchema = mongoose.Schema({
    nombre:String,
    apellido:String,
    tipo_documento:String,
    numero_documento:Number,
    nickname:String,
    correo:String,
    password:String,
    rol:String,
},{versionKey:false})

const PersonasModel = mongoose.model('Personas',PersonasSchema)
// const Trabajadores = mongoose.model('')

const mostrar = async ()=>{
    const RegistrosTotales = await PersonasModel.find();
    console.log(RegistrosTotales)
}
// const mostrarEspecifico = async (Nick) =>{
//     const RegistroEspecifico = await PersonasModel.findOne({Nickname:Nick});
// }

const crear = async (nombre,apellido,t_documento,n_documento,nickname,correo,password)=>{
    const personas = new PersonasModel({
        nombre:nombre,
        apellido:apellido,
        tipo_documento:t_documento,
        numero_documento:n_documento,
        nickname:nickname,
        correo:correo,
        password:password,
        rol:"usuario externo"
    })
    const resultados = await personas.save();
    console.log(resultados)
}
const actualizar = async (nombre,apellido,t_documento,n_documento,nickname,correo,password)=>{
    const persona = await PersonasModel.updateOne({nickname:nickname},
    {
        $set:{
            nombre:nombre,
            apellido:apellido,
            tipo_documento:t_documento,
            numero_documento:n_documento,
            correo:correo,
            password:password
        }
    })
}
const eliminar = async (Nick)=>{
    const persona = await PersonasModel.deleteOne({nickname:Nick})
    console.log(persona);
}
//mostrar()
//crear()
//actualizar('joselo')
//eliminar('pedrito')
//mostrarEspecifico('DavHD');

app.get("/personas/:nickname", async function (req, res) {
    // find es una funcion que ayuda a buscar dentro de un array
    // req, trael la consulta con el parametro deseado
    const personas = await PersonasModel.findOne({nickname:req.params.nickname})
    console.log(personas)
    res.send(personas);
})


app.get("/consultar/trabajadores/:rol", async function (req, res) {
    const prod = await PersonasModel.find();
    console.log(prod)
    res.send(prod);
})

app.get("/usuario/registrar/:nombre-:apellido-:documento-:t_documento-:nickname-:correo-:password", function (req, res) {
    crear(req.params.nombre,req.params.apellido,req.params.t_documento,req.params.documento,req.params.nickname,req.params.correo,req.params.password)
    res.send("mensaje predeterminado de backend registro");
})

app.get("/consultar/trabajador/:nickname", async function(req,res) {
    const prod = await PersonasModel.find(p => p.nickname === req.params.nickname)
    res.send(prod);
})
app.get("/usuario/iniciarSesion/:correo-:password", async function(req,res) {
    const prod = await PersonasModel.findOne({correo:req.params.correo,contraseña: req.params.password}).clone()
    console.log(prod)
    res.send(prod);
})


app.listen(8081, function () {
    console.log("Servidor corriendo Puerto 8081");
})