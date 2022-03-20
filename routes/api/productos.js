import express  from 'express';
const routerProd = express.Router();
import Productos from '../../controladores/productos.js';
    
routerProd.get("/:id", (req, res) => {
    const { ...rest } = req.params;
    const prod = new Productos(`productos.json`);
    const id = Number(rest.id);
    prod.getById(id, (p) => {
        if(p==undefined){
            res.status(400).json({error: 'Producto No Encontrado.'})
        } else {
            res.status(200).send(p);
        }
    });       
});

routerProd.get("/", (req, res) => {
    const prod = new Productos(`productos.json`);
    prod.getAll((p) => {
        res.status(200).send(p);
    });
});

routerProd.post("/", (req, res) => {
    try {
        const prod = new Productos(`productos.json`);
        const { title, price, thumbnail } = req.body;
        const productoNuevo = {
            title,
            price,
            thumbnail
        }
        prod.save(productoNuevo, prod => {
            res.status(200).send(prod);
        });
    } catch (err) {
        res.status(400).json({error: err});
    }
});

routerProd.put("/:id", (req, res) => {
    try {
        const prod = new Productos(`productos.json`);
        const productoNuevo = req.body;
        console.log(productoNuevo);
        prod.modi(productoNuevo, prod => {
            res.status(200).send(productoNuevo);
        });
    } catch (err) {
        res.status(400).json({error: err});
    } 
});

routerProd.delete("/:id", (req, res) => {
    try {
        const { ...rest } = req.params;
        const prod = new Productos(`productos.json`);
        const id = Number(rest.id);
        prod.deleteById(id, prod => {
            res.status(200).send(prod);
        });
    } catch (err) {
        res.status(400).json({error: err});
    }
});

export default routerProd;