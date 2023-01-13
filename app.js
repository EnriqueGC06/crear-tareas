require('colors');

const { guardarDB, leerDb } = require('./helpers/guardarArchivo');
const { inquirerMenu,
        pausa,
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoChecklist
} = require('./helpers/inquirer');
const Tareas = require('./models/tareas');

const main = async() => {

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDb();

    if ( tareasDB ) { // cargar tareas
        tareas.cargarTareasFromArray( tareasDB );
    }
    

    do {
        // Imprime el Menú
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                // crear opcion
                const desc = await leerInput('Descripción: ');
                tareas.crearTarea( desc );
            break;

            case '2':
                tareas.listadoCompleto();
            break; 

            case '3': // listar completadas
                tareas.listarPendientesCompletadas(true);
            break; 

            case '4': // listar pendientes
                tareas.listarPendientesCompletadas(false);
            break; 

            case '5': // completado | pendiente
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
            break; 

            case '6': // borrar tarea
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if ( id !== '0' ) {
                    const ok = await confirmar('¿Está seguro?');
                    if ( ok ) {
                        tareas.borrarTarea( id);
                        console.log('Tarea borrada');
                    }
                }
            break;
        }

        guardarDB( tareas.listadoArr );

        if ( opt !== '0' ) await pausa();

    } while ( opt !== '0' );

    // pausa();

}

main();