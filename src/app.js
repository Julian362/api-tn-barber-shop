const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const url = "mongodb+srv://DavHD:PhmFRjvYHmaSB4P@misiontic.d2mqp.mongodb.net/barbershop?retryWrites=true&w=majority";

mongoose.connect(url,{ 
   
})
.then( ()=> console.log('Conectado a mongo'))
.catch( (e)=> console.log('error en la conexion es' + e))

const PersonasSchema = mongoose.Schema({
    Documento:Number,
    Nickname:String,
    Sexo:String,
    apellidos:String,
    nombres:String,
},{versionKey:false})

const PersonasModel = mongoose.model('Personas',PersonasSchema)

const mostrar = async ()=>{
    const RegistrosTotales = await PersonasModel.find();
    console.log(RegistrosTotales)
}
// const mostrarEspecifico = async (Nick) =>{
//     const RegistroEspecifico = await PersonasModel.findOne({Nickname:Nick});
// }

const crear = async ()=>{
    const personas = new PersonasModel({
        Documento:'1067968154853',
        Nickname:'joselo',
        Sexo:'mujer',
        apellidos:'rastacuando',
        nombres:'Petrona'
    })
    const resultados = await personas.save();
    console.log(resultados)
}
const actualizar = async (Nick)=>{
    const persona = await PersonasModel.updateOne({nickname:Nick},
    {
        $set:{
            nombres:'juan mecanico',
            apellidos:'petronita'
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

app.listen(9000, () => {
    console.log(`Backend corriendo por el puerto 9000`)
})