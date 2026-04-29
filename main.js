

function mostrarMenu(){
    let opc = prompt(
        "-------------Hotel---------------\n"+
        "1. Registrar nueva habitacion.\n"+
        "2. Listar habitaciones\n"+
        "3. Buscar habitacion por numero.\n"+
        "4. Cambiar estado de una habitacion\n"+
        "5. Eliminar habitacion\n"+
        "6. Salir"

    );

    switch(opc){
        case "1":
            registrarHabitacion(mostrarMenu);
            break;
        case "2":
            mostrarhabitaciones(mostrarMenu);
            break;
        case "3":
            buscarHabitacionPorNumero(mostrarMenu);
            break;
        case "4":
            cambiarEstadoDeHabitacion(mostrarMenu);
            break;
        case "5":
            eliminarHabitacion(mostrarMenu);
            break;
        case "6":
            console.log("Salir!")
            break;
        default:
            console.log("Ingrese un valor válido");
            mostrarMenu();
    }
}

mostrarMenu()

let habitaciones = [];

function registrarHabitacion(callback){
    let numero = prompt("Ingrese el numero de la habitacion");
    let tipo = prompt("Ingrese el tipo de habitacion");
    let estado = prompt("Ingrese el estado de la habitacion");

    let habitacion = {
        numero: numero,
        tipo: tipo,
        estado: estado
    };

    console.log("Registrando habitación...");

    setTimeout(() => {
        habitaciones.push(habitacion);
        console.log("Habitación registrada con éxito!");

        if (typeof callback === "function") {
            callback();
        }

        console.log(habitaciones); // para verificar
    }, 2000);
}

function mostrarhabitaciones(callback){
    console.log("Listado de habitaciones:");
    habitaciones.forEach((habitacion) => {
        console.log(`Numero: ${habitacion.numero}, Tipo: ${habitacion.tipo}, Estado: ${habitacion.estado}`);
    });
    callback();
}

function buscarHabitacionPorNumero(callback){
    let numero = prompt("Ingrese el numero de la habitacion a buscar");
    let habitacion = habitaciones.find(h => h.numero === numero);
    if(habitacion){
        console.log(`Habitacion encontrada: Numero: ${habitacion.numero}, Tipo: ${habitacion.tipo}, Estado: ${habitacion.estado}`);
    } else {
        console.log("Habitacion no encontrada");
    }
    callback();
}

function cambiarEstadoDeHabitacion(callback){
    let numero = prompt("Ingrese el numero de la habitacion para cambiar su estado");
    let habitacion = habitaciones.find(h => h.numero === numero);
    if(habitacion){
        let nuevoEstado = prompt("Ingrese el nuevo estado de la habitacion");
        habitacion.estado = nuevoEstado;
        console.log("Estado de la habitacion actualizado con exito!");
    } else {
        console.log("Habitacion no encontrada");
    }
    callback();
}

function eliminarHabitacion(callback){
    let numero = prompt("Ingrese el numero de la habitacion a eliminar");
    let index = habitaciones.findIndex(h => h.numero === numero);
    if(index !== -1){
        habitaciones.splice(index, 1);
        console.log("Habitacion eliminada con exito!");
    } else {
        console.log("Habitacion no encontrada");
    }
    callback();
}   