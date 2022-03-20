import ApiProdRoutes from "./routes/api/productos.js";
import ApiSubirRoutes from "./routes/api/subirFile.js";
import ProdRoutes from "./routes/productos.js";
import Productos from "./controladores/productos.js";

import express  from 'express';
import http from 'http';
import { engine } from "express-handlebars";
import { Server } from 'socket.io';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class App {
   constructor (PORT) {
      this.port = PORT;
      this.app = express();
      this.server = http.createServer(this.app);
      this.io = new Server(this.server, {
         cors: { origin: '*'}
     });
     this.mensajes = [];
   }
   listen() {
      this.server .listen(this.port);
   }
   start() {
      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: true }));
      this.app.use("/api/productos", ApiProdRoutes);
      this.app.use("/api/subir", ApiSubirRoutes);
      this.app.use("/", ProdRoutes);

      this.app.use("/static", express.static(path.resolve(__dirname, "/public")));
      this.app.use("/uploads", express.static(path.resolve(__dirname, "/uploads")));
      this.app.set("views", "public");
      this.app.set("view engine", "hbs");
      this.app.engine(
            "hbs",
            engine({
               extname: ".hbs",
               defaultLayout: "index.hbs",
               layoutsDir: __dirname+"/public/layouts",
               partialsDir: __dirname+"/public/partials"
            }),
         );
      console.log(`Servidor Escuchando Y Listo en http://localhost:${this.port}`)    

      this.io.on('connection', (socket) => {
         console.log('Usuario Conectado');
         socket.emit('Bienvenida', {
            msg: '👍 Estamos en Línea para escucharte. 😎 '               
         });
         
         socket.on('disconnect', () => {
             console.log('Usuario Desconectado');
             socket.emit('Bienvenida', '😇 Nos Vemos la Próxima. 😎 ' );
         });
         
         socket.on('notificacion', (data) => {
             console.log(`Recibido: ${data}`);
         })

         socket.on('pedirProds', () =>{
            const productos = new Productos(`productos.json`);
            productos.getAll( prods => {
               this.io.sockets.emit('envioProds', prods);
            });
         })
     
         socket.on('mensajeFront', (data) =>{
             this.mensajes.push({
                 id: socket.id,
                 us: data.us,
                 mail: data.mail,
                 mensaje: data.mensaje,
                 fh: data.fh
             });
             this.io.sockets.emit('mensajeBack', this.mensajes);
         })
     })
   }
}

export default App;