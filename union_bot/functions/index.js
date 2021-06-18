const functions = require("firebase-functions");
const express  = require('express');
const bodyParser = require('body-parser');
const path = require('path');
//Importando la libreria
const lib = require('./UPEUlib');
    
//Iniciando el servidor    
const server = express();

server.use(bodyParser.urlencoded({
  extended:true
}));
server.use(bodyParser.json()); //Para analizar JSON



//Para que el server nos permita cargar IvgVy6LPvoMPgjMdQ185nN6psJyBJ4yOpzqm695
server.use("/imagenes",express.static(path.join(__dirname+'/imagenes')));

//Si alguien intentan acceder desde un navegador y no tiene autorizacion
server.get("/",(req, res) => {
  return res.json("Hola soy un bot, pero esta no es la forma adecuada de interactuar conmigo.")
});

//Acceso correcto
server.post('/upeu', (req,res) => {
  let context = "";
  let result  = `Petición resivida estado de post incorrecto`;
  let opciones = ["Admisión","Nosotros","Sedes","Contactos","Académico","Ayuda","Salir"]; 
  try{
    context = req.body.queryResult.action;
    result = `Recibida peticion de accione ${context}`;

  }catch(error){
    console.log("ERROR contexto vacio : " + error);    
  }

  //Segunda alternativa para que se spa si existe el action o parametro
  if(req.body.queryResult.parameters){
    console.log("parametros : " + req.body.queryResult.parameters);
  }else{
    console.log('Sin parametros');
  }

  if(context === "input.welcome"){
    /************input.welcome************* */
    textoEnviar = "¡Hola! Me llamo Sophia seré tu asistente virtual. Estoy aquí para brindarte información sobre la UPeU.";
    /* textoEnviar = "Hola me llamo pantigoso"; */
     result = lib.respuestaBasica(textoEnviar);
  }
  lib.addSugerencia(result, opciones);
  res.json(result);
})


//Para ejecutar el servidor en local true = local false = firebase
const local = false; 
if(local) {
  server.listen((process.env.PORT || 8000 ), () => {
    console.log('Servidor iniciado!!');
  })
}else{
  //Para Firebase
  exports.unionBot = functions.https.onRequest(server);
}

