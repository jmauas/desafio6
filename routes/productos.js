
import express  from 'express';
const routerProd = express.Router();
import Productos from '../controladores/productos.js';

routerProd.get("/", (req, res) => {
    res.render("main", {
        cargar: true
    })
});

routerProd.get("/productos", (req, res) => {
    res.render("main", {
       cargar: false
    });
});
  
routerProd.post('/productos', (req, res) => {
    const { body } = req;
    const productos = new Productos(`productos.json`);
    productos.save(body, (prods) =>{
        res.render("main", {
          prods, cargar: false
        })
    });
});   


export default routerProd;