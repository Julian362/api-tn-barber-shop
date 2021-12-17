const express = require("express");
const cors = require("cors");
const { persona } = require("./datos");
const mongoose = require("mongoose");
const producto = require("./models/prodcutoModel");

const app = express();
app.use(cors());
app.use(express.json());

const url = "mongodb+srv://DavHD:PhmFRjvYHmaSB4P@misiontic.d2mqp.mongodb.net/barbershop?retryWrites=true&w=majority";

mongoose.connect(url, {

})
    .then(() => console.log('Conectado a mongo'))
    .catch((e) => console.log('error en la conexion es' + e))

const PersonasSchema = mongoose.Schema({
    nombre: String,
    apellido: String,
    tipo_documento: String,
    numero_documento: Number,
    nickname: String,
    correo: String,
    password: String,
    rol: String
}, { versionKey: false })

const PersonasModel = mongoose.model('Personas', PersonasSchema)
// const Trabajadores = mongoose.model('')


//--------Schema Agenda--------//
const AgendaSchema = mongoose.Schema({
    servicio: String,
    fecha: String,
    hora_inicio: String,
    duracion: String,
    nombre: String,
    apellido: String,
    nickname: String,
    correo: String,
    estado: String
}, { versionKey: false })
const AgendaModel = mongoose.model('agendas', AgendaSchema)

const mostrar = async () => {
    const RegistrosTotales = await PersonasModel.find();
    console.log(RegistrosTotales)
}

const crear = async (nombre, apellido, t_documento, n_documento, nickname, correo, password) => {
    const personas = new PersonasModel({
        nombre: nombre,
        apellido: apellido,
        tipo_documento: t_documento,
        numero_documento: n_documento,
        nickname: nickname,
        correo: correo,
        password: password,
        rol: "usuario externo"
    })
    const resultados = await personas.save();
    console.log(resultados)
}
const actualizar = async (nombre, apellido, t_documento, n_documento, nickname, correo, password) => {
    const persona = await PersonasModel.updateOne({ nickname: nickname },
        {
            $set: {
                nombre: nombre,
                apellido: apellido,
                tipo_documento: t_documento,
                numero_documento: n_documento,
                correo: correo,
                password: password
            }
        })
}

//Back-end para la eliminación del servicio
const eliminarAgenda = async (id) => {
    const eliminarServicio = await AgendaModel.findByIdAndDelete(id)
    console.log(eliminarServicio);
}

// eliminarAgenda();
module.exports = {
    AgendaModel, PersonasModel
}
app.get("/personas/:nickname", async function (req, res) {
    // find es una funcion que ayuda a buscar dentro de un array
    // req, trael la consulta con el parametro deseado
    const personas = await PersonasModel.findOne({ nickname: req.params.nickname })
    console.log(personas)
    res.send(personas);
})


app.get("/consultar/trabajadores/:rol", async function (req, res) {
    const prod = await PersonasModel.find();
    console.log(prod)
    res.send(prod);
})

app.get("/usuario/registrar/:nombre-:apellido-:documento-:t_documento-:nickname-:correo-:password", function (req, res) {
    crear(req.params.nombre, req.params.apellido, req.params.t_documento, req.params.documento, req.params.nickname, req.params.correo, req.params.password)
    res.send("mensaje predeterminado de backend registro");
})

app.get("/consultar/trabajador/:nickname", async function (req, res) {
    const prod = await PersonasModel.find(p => p.nickname === req.params.nickname)
    res.send(prod);
})
app.get("/usuario/iniciarSesion/:correo-:password", async function (req, res) {
    const prod = await PersonasModel.findOne({ correo: req.params.correo, contraseña: req.params.password }).clone()
    res.send(prod);
})

app.get("/usuario/datospersonales/:nickname", async function (req, res) {
    const personas = await PersonasModel.findOne({ nickname: req.params.nickname })
    res.send(personas);
})

app.get("/usuario/editar/:nombre-:apellido-:documento-:t_documento-:nickname-:correo-:password", function (req, res) {
    actualizar(req.params.nombre, req.params.apellido, req.params.t_documento, req.params.documento, req.params.nickname, req.params.correo, req.params.password)
    res.send("mensaje predeterminado de backend registro");
})

//consultar servicios agendados (estado="programado") por nickname
app.get("/consultar/citasAgendadas/:nickname-:estado", async function (req, res) {
    const listaAgenda = await AgendaModel.find({ nickname: req.params.nickname, estado: req.params.estado }).clone();
    res.send(listaAgenda);
})

//Consulta los servicios agendados en toda la plataforma
app.get("/consultar/agenda/:estado", async function (req, res) {
    const listaAgenda = await AgendaModel.find({ estado: req.params.estado }).clone();
    res.send(listaAgenda);
})

app.get("/consulta/editar/:estado", function (req) {
    actualizar(req.params.estado);
})

// API para eliminar el servicio
app.get("/eliminar/agenda/:_id", function (req,res) {
    eliminarAgenda(req.params._id)
    res.send({})
})


app.listen(8081, function () {
    console.log("Servidor corriendo Puerto 8081");
})