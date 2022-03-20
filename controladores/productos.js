import fs from 'fs';

class Productos {
    constructor (json) {
        this.archivo = json;

    }

    save(producto, res) {
        let productos = []; 
        productos = fs.readFile(this.archivo, 'utf-8', (error, contenido)  => {
            if (error) {
                console.log('No existen Productos.')
                producto.id = 1;
                productos = [];
                productos.push(producto);
                this.guardarProductos(productos);
                res(productos);
            } else {
                try {
                    productos = JSON.parse(contenido);
                    producto.id = this.leerMaxId(productos) + 1;
                    productos.push(producto);
                    this.guardarProductos(productos);
                    res(productos);
                } catch {}                           
            }
        });
    }
    modi(producto, res) {
        let productos = []; 
        productos = fs.readFile(this.archivo, 'utf-8', (error, contenido)  => {
            if (error) {
                res('No existen Productos.')
                return true;
            } else {      
                productos = JSON.parse(contenido);
                for(let i of productos){
                    if (i.id==producto.id){
                        i.title = producto.title;
                        i.price = producto.price;
                        i.thumbnail = producto.thumbnail;
                    }
                }
                this.guardarProductos(productos);
                res(producto);                                      
            }
        });
    }
    leerMaxId(productos) {
        let id = 1;
        productos.map(prod => {
            if (prod.id>id) {
                id = prod.id;
            }
        })
        return id;
    }
    guardarProductos(productos) {
        fs.writeFile(this.archivo, JSON.stringify(productos), error =>{
            if (error) {
                console.log('Error al Guardar el Archivo.');
            } else {
                return true;
            }
        })
    }

    getById(Number, producto) {
        let productos = []; 
        productos = fs.readFile(this.archivo, 'utf-8', (error, contenido)  => {
            if (error) {
                console.log('No existen Productos.')
                producto(null);
            } else {
                productos = JSON.parse(contenido);
                const prod = productos.find( prod => prod.id==Number);
                producto(prod);
            }
        });
    }
    getAll(all) {
        let productos = []; 
        productos = fs.readFile(this.archivo, 'utf-8', (error, contenido)  => {
            if (error) {
                console.log('No existen Productos.')
                all(null);
            } else {
                productos = JSON.parse(contenido);
                all(productos);
            }
        });
    }

    deleteById(Number, res) {
        let productos = []; 
        productos = fs.readFile(this.archivo, 'utf-8', (error, contenido)  => {
            if (error) {
                res('No existen Productos. Nada para Borrar')
            } else {
                productos = JSON.parse(contenido);
                const prod = productos.find( prod => prod.id==Number);
                try {
                    if (prod.length==0) {
                        res(`No se Encontró el Producto con ID ${Number}`)
                    } else {
                        const i = productos.indexOf(prod);
                        console.log(`Indice ${i}`)
                        productos.splice(i, 1);
                        this.guardarProductos(productos)
                        res(`Producto con ID ${Number} Eliminado ¡¡¡¡`)
                    }
                } catch {
                    res(`No se Encontró el Producto con ID ${Number}`)
                }                
            }
        });
    }

    deleteAll() {
        const fs = require('fs');       
        fs.unlink(this.archivo, error => {
            if (error) {
                console.log('No se Pudieron Eliminar los Productos.');
            } else {
                console.log('Productos Eliminados.');
            }
        })  
    }
}

export default Productos;

