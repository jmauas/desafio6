const copiar = (url) => {
    const obj = document.getElementById('url');
    obj.value = url;
}

const socket = io();

socket.on('Bienvenida', (data) => {
    const p = document.getElementById('msg');
    p.innerHTML = data.msg;
    prods = data.prods;
    socket.emit('notificacion', 'Mensaje Recibido con Éxito');
});

socket.on('mensajeBack', (data) => {
    const msgs = document.getElementById('msgs');
    let html = '<table class="table table-condensed"><tr><th>NOMBRE</th><th>E-MAIL</th><th>ENVIO</th><th>MENSAJE</th></tr>';
    const sMail = 'style="color: blue; font-weight: bold;"';
    const sFh = 'style="color: brown; font-weight: normal;"';
    const sMsg = 'style="color: green; font-weight: normal; font-style: italic"';
    console.log(data)
    data.map( m => {
        html += `<tr>
                    <td>${m.us}</td>
                    <td ${sMail}>${m.mail}</td>
                    <td ${sFh}>${m.fh}</td>
                    <td ${sMsg}>${m.mensaje}</td>
                </tr>`;
    })
    html += '</table>'
    msgs.innerHTML = html;
    let f = new Date().toLocaleTimeString
});

socket.on('envioProds', (data) => {
    const prods = data;
    let html = '';
    const detalle = document.getElementById('tablaProds')
    if (detalle != null) {
        prods.map( p => 
            html +=`
                <tr>
                    <td class="nombreProd">${p.title}</td>
                    <td class="prProd">${p.price}</td>
                    <td><img alt="Foto" style="width: 100px;" src=${p.thumbnail}></td>
                </tr>
            `
        );            
        detalle.innerHTML = html;
    }
});

const enviar = () => {
    const usuario = document.getElementById('usuario');    
    const mail = document.getElementById('mail');    
    const mensaje = document.getElementById('mensaje');
    const fh = formatoFecha(new Date());
    if (mail.value.length<4) {
        alert('MAIL ES OBLIGATORIO');
    } else {
        socket.emit('mensajeFront', {us: usuario.value, mail: mail.value, mensaje: mensaje.value, fh: fh});   
        mensaje.value = ''; 
    }
}
socket.emit('pedirProds');

const formatoFecha = (fh) => {
    let fhtxt = `${zfill(parseInt(fh.getDate()), 2)}/${zfill((parseInt(fh.getMonth())+1), 2)}/${parseInt(fh.getFullYear())}`;
    fhtxt +=  ` ${zfill(parseInt(fh.getHours()), 2)}:${zfill(parseInt(fh.getMinutes()), 2)}:${zfill(parseInt(fh.getSeconds()), 2)}`;
    return fhtxt;
}

const zfill = (number, width, deci) => {
    let numberOutput = Math.abs(number); /* Valor absoluto del n�mero */
    if (deci!=undefined|| deci>0) {
        numberOutput = Number.parseFloat(numberOutput).toFixed(deci).toString();
    }
    let length = numberOutput.toString().length; /* Largo del n�mero */
    let zero = "0"; /* String de cero */
    if (width <= length) {
        if (number < 0) {			
            return ("-" + numberOutput.toString());
        } else {
            return numberOutput.toString();
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length - 1)) + numberOutput.toString());
        } else {
            return zero.repeat(width - length) + numberOutput.toString();
        }
    }
}