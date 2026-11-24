/* ===== Configuracion y datos ===== */

const RETARDO_CONSULTA = 1500;
const RETARDO_ESCRITURA = 2000;

// Valores permitidos, definidos una sola vez para mantener datos consistentes.
const ESTADOS = {
    DISPONIBLE: "Disponible",
    OCUPADA: "Ocupada",
    MANTENIMIENTO: "Mantenimiento",
};

const TIPOS = ["Simple", "Doble", "Suite"];

const HUESPED_NINGUNO = "Ninguno";
const HUESPED_MANTENIMIENTO = "Bajo reparacion";

// Datos en memoria; se pierden al recargar. El precio es numerico.
const habitaciones = [
    {
        numero: "101",
        tipo: "Doble",
        precioPorNoche: 250,
        estado: ESTADOS.OCUPADA,
        huesped: "Alexis",
    },
    {
        numero: "102",
        tipo: "Simple",
        precioPorNoche: 150,
        estado: ESTADOS.DISPONIBLE,
        huesped: HUESPED_NINGUNO,
    },
    {
        numero: "103",
        tipo: "Simple",
        precioPorNoche: 150,
        estado: ESTADOS.MANTENIMIENTO,
        huesped: HUESPED_MANTENIMIENTO,
    },
];

/* ===== Validadores ===== */

// Cada validador devuelve un mensaje de error, o null si el valor es correcto.

function validarObligatorio(valor) {
    if (valor === "") {
        return "Este campo es obligatorio.";
    }
    return null;
}

function validarNumeroHabitacion(valor) {
    if (!/^\d+$/.test(valor)) {
        return "Use solo digitos, por ejemplo 101.";
    }
    return null;
}

function validarNumeroNuevo(valor) {
    const error = validarNumeroHabitacion(valor);

    if (error !== null) {
        return error;
    }
    if (encontrarHabitacion(valor)) {
        return `La habitacion ${valor} ya existe.`;
    }
    return null;
}

function validarPrecio(valor) {
    const numero = Number(valor);

    if (valor === "" || !Number.isFinite(numero) || numero <= 0) {
        return "Ingrese un numero mayor que cero, por ejemplo 250.";
    }
    return null;
}

/* ===== Entrada de datos ===== */

// Repite la pregunta hasta que "validar" no devuelva error. Devuelve null si se cancela.
function pedirTexto(mensaje, validar = () => null) {
    let ayuda = "";

    while (true) {
        const entrada = prompt(ayuda + mensaje);

        if (entrada === null) {
            return null;
        }

        const valor = entrada.trim();
        const error = validar(valor);

        if (error === null) {
            return valor;
        }
        ayuda = `${error}\n\n`;
    }
}

function pedirPrecio(mensaje) {
    const texto = pedirTexto(mensaje, validarPrecio);
    return texto === null ? null : Number(texto);
}

// Lista numerada: evita texto libre en campos con valores fijos.
function pedirOpcion(titulo, opciones) {
    const lista = opciones
        .map((opcion, i) => `${i + 1}. ${opcion}`)
        .join("\n");

    const validarIndice = (valor) => {
        const n = Number(valor);
        const esValido = Number.isInteger(n) && n >= 1 && n <= opciones.length;

        return esValido ? null : `Elija un numero entre 1 y ${opciones.length}.`;
    };

    const indice = pedirTexto(`${titulo}\n${lista}`, validarIndice);
    return indice === null ? null : opciones[Number(indice) - 1];
}

/* ===== Formato de salida ===== */

function formatearPrecio(valor) {
    return `Q${valor.toFixed(2)}`;
}

function formatearHabitacion(h) {
    return [
        `Numero: ${h.numero}`,
        `Tipo: ${h.tipo}`,
        `Precio por noche: ${formatearPrecio(h.precioPorNoche)}`,
        `Estado: ${h.estado}`,
        `Huesped: ${h.huesped}`,
    ].join(" | ");
}

//operaciones

function encontrarHabitacion(numero) {
    return habitaciones.find((h) => h.numero === numero);
}

// Huesped que corresponde a un estado cuando no se indica un nombre.
function huespedPorDefecto(estado) {
    return estado === ESTADOS.MANTENIMIENTO
        ? HUESPED_MANTENIMIENTO
        : HUESPED_NINGUNO;
}

// Cambia el estado y mantiene coherente el huesped. Devuelve false si se cancela.
function aplicarEstado(habitacion, estado) {
    let huesped = huespedPorDefecto(estado);

    if (estado === ESTADOS.OCUPADA) {
        huesped = pedirTexto("Nombre del huesped:", validarObligatorio);

        if (huesped === null) {
            return false;
        }
    }

    habitacion.estado = estado;
    habitacion.huesped = huesped;
    return true;
}

function operacionCancelada(callback) {
    console.log("Operacion cancelada.");
    callback();
}

function registrarHabitacion(callback) {
    const numero = pedirTexto("Numero de la habitacion:", validarNumeroNuevo);
    if (numero === null) {
        return operacionCancelada(callback);
    }

    const tipo = pedirOpcion("Tipo de habitacion:", TIPOS);
    if (tipo === null) {
        return operacionCancelada(callback);
    }

    const precioPorNoche = pedirPrecio("Precio por noche (en quetzales):");
    if (precioPorNoche === null) {
        return operacionCancelada(callback);
    }

    const estado = pedirOpcion("Estado inicial:", Object.values(ESTADOS));
    if (estado === null) {
        return operacionCancelada(callback);
    }

    // El huesped siempre se solicita; solo es obligatorio si la habitacion esta ocupada.
    const obligatorio = estado === ESTADOS.OCUPADA;
    const sufijo = obligatorio ? "" : " (opcional, deje vacio si no aplica)";

    const huesped = pedirTexto(
        `Nombre del huesped${sufijo}:`,
        obligatorio ? validarObligatorio : undefined
    );
    if (huesped === null) {
        return operacionCancelada(callback);
    }

    const habitacion = {
        numero,
        tipo,
        precioPorNoche,
        estado,
        huesped: huesped || huespedPorDefecto(estado),
    };

    console.log("Registrando habitacion...");

    setTimeout(() => {
        habitaciones.push(habitacion);

        console.log("Habitacion registrada con exito:");
        console.log(formatearHabitacion(habitacion));
        callback();
    }, RETARDO_ESCRITURA);
}

function listarHabitaciones(callback) {
    if (habitaciones.length === 0) {
        console.log("No hay habitaciones registradas.");
        return callback();
    }

    console.log(`Listado de habitaciones (${habitaciones.length}):`);
    console.table(
        habitaciones.map((h) => ({
            Numero: h.numero,
            Tipo: h.tipo,
            "Precio por noche": formatearPrecio(h.precioPorNoche),
            Estado: h.estado,
            Huesped: h.huesped,
        }))
    );
    callback();
}

function buscarHabitacionPorNumero(callback) {
    const numero = pedirTexto(
        "Numero de la habitacion a buscar:",
        validarNumeroHabitacion
    );
    if (numero === null) {
        return operacionCancelada(callback);
    }

    console.log("Buscando en el registro del hotel...");

    setTimeout(() => {
        const habitacion = encontrarHabitacion(numero);

        if (habitacion) {
            console.log(`Habitacion encontrada:\n${formatearHabitacion(habitacion)}`);
        } else {
            console.log(`La habitacion ${numero} no existe.`);
        }
        callback();
    }, RETARDO_CONSULTA);
}

function cambiarEstadoDeHabitacion(callback) {
    const numero = pedirTexto("Numero de la habitacion:", validarNumeroHabitacion);
    if (numero === null) {
        return operacionCancelada(callback);
    }

    const habitacion = encontrarHabitacion(numero);
    if (!habitacion) {
        console.log(`La habitacion ${numero} no existe.`);
        return callback();
    }

    const estado = pedirOpcion(
        `Habitacion ${numero} (estado actual: ${habitacion.estado}).\nNuevo estado:`,
        Object.values(ESTADOS)
    );
    if (estado === null || !aplicarEstado(habitacion, estado)) {
        return operacionCancelada(callback);
    }

    console.log("Actualizando estado...");

    setTimeout(() => {
        console.log(`Estado actualizado:\n${formatearHabitacion(habitacion)}`);
        callback();
    }, RETARDO_ESCRITURA);
}

function eliminarHabitacion(callback) {
    const numero = pedirTexto(
        "Numero de la habitacion a eliminar:",
        validarNumeroHabitacion
    );
    if (numero === null) {
        return operacionCancelada(callback);
    }

    const habitacion = encontrarHabitacion(numero);
    if (!habitacion) {
        console.log(`La habitacion ${numero} no existe.`);
        return callback();
    }

    // Regla de negocio: no se elimina una habitacion con huesped alojado.
    if (habitacion.estado === ESTADOS.OCUPADA) {
        console.log(
            `No se puede eliminar la habitacion ${numero}: ` +
            `esta ocupada por ${habitacion.huesped}.`
        );
        return callback();
    }

    const confirmado = confirm(
        `Eliminar la habitacion ${numero}? Esta accion no se puede deshacer.`
    );
    if (!confirmado) {
        return operacionCancelada(callback);
    }

    console.log("Eliminando habitacion...");

    setTimeout(() => {
        const indice = habitaciones.findIndex((h) => h.numero === numero);

        if (indice !== -1) {
            habitaciones.splice(indice, 1);
        }

        console.log(`Habitacion ${numero} eliminada con exito.`);
        callback();
    }, RETARDO_ESCRITURA);
}

/* ===== Menu principal ===== */

// Cancelar en el menu equivale a salir.
function mostrarMenu() {
    const opcion = prompt(
        "------------- Hotel Miraflores -------------\n" +
        "1. Registrar nueva habitacion\n" +
        "2. Listar habitaciones\n" +
        "3. Buscar habitacion por numero\n" +
        "4. Cambiar estado de una habitacion\n" +
        "5. Eliminar habitacion\n" +
        "6. Salir"
    );

    switch (opcion === null ? "6" : opcion.trim()) {
        case "1":
            registrarHabitacion(mostrarMenu);
            break;

        case "2":
            listarHabitaciones(mostrarMenu);
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
            console.log("Sistema finalizado. Recargue la pagina para reiniciar.");
            break;

        default:
            console.log("Opcion invalida. Ingrese un numero del 1 al 6.");
            mostrarMenu();
    }
}

// Se invoca al final para que todo este definido antes de iniciar.
mostrarMenu();
