// Importa a expres
const express = require("express");
// lo instancia a app
const app = express();
// Cors libreria para hacer peticiones desde otro dominio
const cors = require("cors");
// importa la base de datos
const { persona } = require("./datos");
const mongoose= require("mongoose");
const producto = require("./models/prodcutoModel");

// Conectar con mongoose y a la vez es una promesa
mongoose.connect("mongodb://localhost:27017/tienda")
.then(res=>console.log("conectado a la BD"))
.catch(err => console.log("Error: ",err));


// le digo a app que use esa libreria para consulta abierta middleware cors
app.use(cors());
app.use(express.json());
// La primera es la ruta, la segunda es la funcion controladora CallBack
app.get("/", function (req, res) {
    res.send("Hola Mundo");
})

/* Api guardar producto */
app.post("/producto/guardar", function(req,res){
    const data =req.body;
    const prod = new productos(data);
    prod.save(function(error){
        if (error){
            res.send({status:"error",msg:"Producto no guardado"});
            return false;
        }
        res.send({status:"Ok", msg:"Producto guardado Good Fine..!!"});
    })
})



app.get("/producto/consultar/:name", function (req, res) {
    // find es una funcion que ayuda a buscar dentro de un array
    // req, trael la consulta con el parametro deseado
    const prod = persona.find(p => p.nombre === req.params.name)
    res.send(prod);
})


// Api rest Editar producto en BD
// ruta:"/producto/editar"
// Metodo: POST
// Datos de entrada:{nombre:nombre,precio:precio,stock:stock}
// Datos de respuesta:{status:"OK",msg:"Editado Satisfactoriamente"}

app.post("/producto/editar", function (req, res) {
    // capturar los datos que vienen del cliente
    const nom = req.body.nombre;
    const pre = req.body.precio;
    const stk = req.body.stock;
    // Crear un JSON
    const prod = { title: nom, price: pre, stock: stk };
    // buscar en la base de datos por nombre del producto
    let i=0;
    for (const p of productos) {
        if (p.title.toLowerCase() == nom.toLowerCase()){
            // reemplazar por el nuevo producto
            productos[i]=prod;
            break;
        }
        i++;
    }
    // Responder a cliente
    console.log(productos);
    res.send({ status: "OK", msg: "Editado Satisfactoriamente" });
})

// Api rest eliminar producto en BD
// ruta:"/producto/eliminar"
// Metodo: POST
// Datos de entrada:{nombre:nombre,precio:precio,stock:stock}
// Datos de respuesta:{status:"OK",msg:"Producto Eliminado Satisfactoriamente"}

app.post("/producto/eliminar", function (req, res) {
    // capturar los datos que vienen del cliente
    const nom = req.body.nombre;
    // buscar en la base de datos por nombre del producto
    let i=0;
    for (const p of productos) {
        if (p.title.toLowerCase == nom.toLowerCase()){
            // eliminar por el nuevo producto
            productos.splice(i,1); //Elimina el producto
            break;
        }
        i++;
    }
    // Responder a cliente
    console.log(productos);
    res.send({status:"OK",msg:"Producto Eliminado Satisfactoriamente"});
})




app.listen(8081, function () {
    console.log("Servidor corriendo Puerto 8081");
})