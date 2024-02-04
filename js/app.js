// variables y selectores
const formulario = document.getElementById('agregar-gasto');
const gastosListado = document.querySelector('#gastos ul');



// eventos
eventListeners()
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)
    formulario.addEventListener('submit', agregarGasto);
    gastosListado.addEventListener('click', eliminarGasto);
    
}


// classes

class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante()
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id.toString() !== id );
       this.calcularRestante();
    }
}

class UI {
  insertarPresupuesto(cantidad){
    // extrayendo los valores

    // agregar al html
    document.querySelector('#total').textContent = cantidad.presupuesto;
    document.querySelector('#restante').textContent = cantidad.restante;

  }

  imprimirAlerta(mensaje, tipo) {
     // crear el div

     const divMensaje = document.createElement('div');
     divMensaje.classList.add('text-center','alert');

     if (tipo === 'error') {
        divMensaje.classList.add('alert-danger')
     }else{
        divMensaje.classList.add('alert-success')
     }

     // mensaje de error

     divMensaje.textContent = mensaje;

     // insertar en el html

     document.querySelector('.primario').insertBefore(divMensaje, formulario);

     // quitar del html

     setTimeout(() =>{
        document.querySelector('.primario .alert').remove();
    },3000)
  }

  agregarGastoListado(gastos){

    this.limpiarHTML() // elimina el html previo
     // iterar sobre los gastos
     gastos.forEach(gasto => {
        const {nombre, cantidad, id} = gasto;

        // crear un li
         const nuevoGasto = document.createElement('li');
         nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
         nuevoGasto.dataset.id = id;

        // agregar el html del gasto
        nuevoGasto.innerHTML = `
           ${nombre} <span class= "badge badge-primary badge-pill">$ ${cantidad} </span>
        `

        // boton para borrar el gasto
        const btnBorrar = document.createElement('button');
        btnBorrar.classList.add('btn', 'btn-danger','borrar-gasto');
        btnBorrar.textContent = 'Borrar'
        nuevoGasto.appendChild(btnBorrar);


        //agregar al html
        
        gastosListado.appendChild(nuevoGasto);



     });
  }

  limpiarHTML(){
    while (gastosListado.firstChild) {
        gastosListado.removeChild(gastosListado.firstChild)
    }
  }

  actualizarRestante(restante){
        document.querySelector('span#restante').textContent = restante; 

  }

  comprobarPresupuesto(presupuestObj){
       const {presupuesto, restante} = presupuestObj;

       const restanteDiv = document.querySelector('.restante')

       // comprobar 25%

       if ((presupuesto / 4) > restante){
         restanteDiv.classList.remove('alert-success','alert-warning');
         restanteDiv.classList.add('alert-danger');
       }else if((presupuesto / 2) >restante){
        restanteDiv.classList.remove('alert-success');
         restanteDiv.classList.add('alert-warning');
       }else{
          restanteDiv.classList.remove('alert-danger', 'alert-warning');
          restanteDiv.classList.add('alert-success')
       }

       // si el total es igual o menor a cero

       if (restante <= 0) {
        ui.imprimirAlerta('el presupuesto se ha agotado', 'error')

        formulario.querySelector('button[type="submit"]').disabled = true;
       }
  }
}

//instanciar
const ui = new UI();
let presupuesto;

// funciones


function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿cual es tu presupuesto?');

    if (preguntarPresupuesto === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload()
    }

// presupuesto valido
 presupuesto = new Presupuesto(presupuestoUsuario)

ui.insertarPresupuesto(presupuesto)

}

// añade gastos

function agregarGasto(e) {
    e.preventDefault();

   // leer los datos del formulario

   const nombre = document.querySelector('#gasto').value;
   const cantidad = Number(document.querySelector('#cantidad').value);

   // validar

   if (nombre === '' || cantidad === '') {
    
       ui.imprimirAlerta('ambos campos son obligatorios', 'error');
   }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('cantidad no valida', 'error');

   }else{
    const gasto = { nombre, cantidad, id: Date.now() };

    // Añadir nuevo gasto 
    presupuesto.nuevoGasto(gasto)

    // Insertar en el HTML
    ui.imprimirAlerta('Correcto', 'correcto');

    // Pasa los gastos para que se impriman...
    const { gastos} = presupuesto;
    ui.agregarGastoListado(gastos);

    // Cambiar la clase que nos avisa si se va terminando
    ui.comprobarPresupuesto(presupuesto);

    // Actualiza el presupuesto restante
    const { restante } = presupuesto;

    // Actualizar cuanto nos queda
    ui.actualizarRestante(restante)

    // Reiniciar el form
    formulario.reset();
   }

   
}

function eliminarGasto(e) {
    if(e.target.classList.contains('borrar-gasto')){
        const { id } = e.target.parentElement.dataset;
        presupuesto.eliminarGasto(id);
        // Reembolsar
        ui.comprobarPresupuesto(presupuesto);

        // Pasar la cantidad restante para actualizar el DOM
        const { restante } = presupuesto;
        ui.actualizarRestante(restante);

        // Eliminar del DOM
        e.target.parentElement.remove();
}

}