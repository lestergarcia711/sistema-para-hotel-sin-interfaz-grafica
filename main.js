let habitaciones = [
    {
        numero:"101",
        tipo:"doble",
        precioPorNoche:"Q250",
        estado:"ocupada",
        huesped:"Alexis"
       


    },
    {
        numero:"103",
        tipo:"simple",
        precioPorNoche:"Q250",
        estado:"ocupada",
        huesped:"Alexis"
    }
];

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



function registrarHabitacion(callback){
    let numero = prompt("Ingrese el numero de la habitacion");
    let tipo = prompt("Ingrese el tipo de habitacion");
    let precioPorNoche=prompt("Ingrese el precio de la habitacion")
    let estado = prompt("Ingrese el estado de la habitacion");
    let huesped= prompt("Nombre del huesped")

    let habitacion = { numero, tipo,  precioPorNoche, estado, huesped };

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
        console.log(`Numero: ${habitacion.numero}, Tipo: ${habitacion.tipo}, Precio Por noche: ${habitacion.precioPorNoche}, Estado: ${habitacion.estado} , Huesped: ${habitacion.huesped}`);
    });
    callback();
}

function buscarHabitacionPorNumero(callback) {
    let numero = prompt("Ingrese el numero de la habitacion a buscar");

    console.log("Buscando en la base de datos del hotel...");

    setTimeout(() => {
        let habitacion = habitaciones.find(h => h.numero === numero);

        if (habitacion) {
            console.log(`Habitacion encontrada: 
            Numero: ${habitacion.numero}, 
            Tipo: ${habitacion.tipo}, 
            Precio Por noche: ${habitacion.precioPorNoche}, 
            Estado: ${habitacion.estado}, 
            Huesped: ${habitacion.huesped}`);
        } else {
            console.log("Habitacion no encontrada");
        }

        callback();
    }, 2000);
}
function cambiarEstadoDeHabitacion(callback) {

    let numero = prompt("Ingrese el número de la habitación:");
    
    console.log(`Esperando al personal del hotel...`);

    setTimeout(() => {
        let habitacion = habitaciones.find(h => h.numero === numero);

        if (habitacion) {
            let opcion = prompt(`Habitación ${numero} encontrada.\nElija la opción para el nuevo estado:
            1. Disponible (Libre)
            2. Ocupada
            3. Mantenimiento`);

            switch (opcion) {
                case "1":
                    habitacion.estado = "Disponible";
                    habitacion.huesped = "Ninguno";
                    console.log(" Estado actualizado: Disponible.");
                    break;
                case "2":
                    let nombre = prompt("Ingrese el nombre del huésped:");
                    habitacion.estado = "Ocupada";
                    habitacion.huesped = nombre;
                    console.log(`Habitación asignada a: ${nombre}`);
                    break;
                case "3":
                    habitacion.estado = "Mantenimiento";
                    habitacion.huesped = "Bajo Reparación";
                    console.log(" Estado actualizado: Mantenimiento.");
                    break;
                default:
                    console.log(" Opción no válida.");
            }
        } else {
            console.log("Habitacion no encontrada/Revise.");
        }

        
        callback();

    }, 3000); 
}

function eliminarHabitacion(callback){
    let numero = prompt("Ingrese el numero de la habitacion a eliminar");
    
    console.log("Esperando al personal del hotel...")

    setTimeout(() => {
        let index = habitaciones.findIndex(h => h.numero === numero);
        if(index !== -1){
            habitaciones.splice(index, 1);
            console.log("Habitacion eliminada con exito!");
        } else {
            console.log("Habitacion no encontrada");
        }
        callback();
        
    }, 3000);

 
}   