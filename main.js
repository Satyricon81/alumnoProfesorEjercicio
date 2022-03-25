const formulario = document.querySelector("#formulario")
const cardsAlumnos = document.querySelector("#cardsAlumnos")
const cardsProfesores = document.querySelector("#cardsProfesores")
const templateAlumno = document.querySelector("#templateAlumno").content
const templateProfesor = document.querySelector("#templateProfesor").content
const alert = document.querySelector(".alert")

const alumnos = [] //Creamos un array vacio para ir llenandolo con las instancias que vayamos creando.
const profesores = [] //Creamos un array vacio para ir llenandolo con las instancias que vayamos creando.

//Delegacion de eventos para los botones de Aprobar o Suspender.
document.addEventListener("click", (e) => {
    //console.log(e.target.dataset.nombre);
    if(e.target.dataset.uid) {
        if(e.target.matches(".btn-success")) {
            alumnos.map(item => {
                if(item.uid === e.target.dataset.uid) {
                    item.setEstado = true
                }
                return item
            })
        }
        if(e.target.matches(".btn-danger")) {
            alumnos.map(item => {
                if(item.uid === e.target.dataset.uid) {
                    item.setEstado = false
                }
                return item
            })
        }
        Persona.mostarPersonaUI(alumnos, "Alumno")
    }
} )

//Despues de crear las variables y asignarlas al id con querySelector, vamos a capturar el formualrio.

formulario.addEventListener ("submit", e => {
    e.preventDefault()

    alert.classList.add("d-none")

    //Para capturar los datos utlizamos el form-data que coge los datos del valor del name que hemos introducido en los inputs.
    const datos = new FormData(formulario)
    const [nombre, edad, opcion] = [...datos.values()]//Destructuring
    console.log(nombre, edad, opcion);
    
    //Con el trim nos aseguramos que no dejan campos en blanco del formulario.
    if(!nombre.trim() || !edad.trim() || !opcion.trim()) {
        alert.classList.remove("d-none")
        return 
    }

    if (opcion === "Alumno") {
        const alumno = new Alumno(nombre, edad)
        alumnos.push(alumno)
        Persona.mostarPersonaUI(alumnos, opcion)
    }

    if (opcion === "Profesor") {
       const profesor = new Profesor(nombre, edad)
       profesores.push(profesor)
       Persona.mostarPersonaUI(profesores, opcion)
    }
    
})

 class Persona {
     constructor(nombre, edad) {
         this.nombre = nombre
         this.edad = edad
         //Creamos un userId para que los users sean aleatorios y no se repitan con el mismo nombre. Utilzamos el Date.now() que nos devuelve un numero.
         this.uid = `${Date.now()}`//Lo ponemos entre template strings para que nos lo transforme a un numero, ya que si se lo pasamos sin ellos, aunque le estemos pasando un numero, el data-form lo transforma en string, con lo cual no nos vale para que sean diferentes y lo asociemos a diferentes userIds.
     }

     //Creamos un metodo estatico para mostrar los datos en el div con id's cardsAlumnos y cardsProfesores.
     static mostarPersonaUI(personas, tipo) {
         if(tipo === "Alumno") {
             
            cardsAlumnos.textContent = ""
            const fragment = document.createDocumentFragment()

            personas.forEach(item => {
                fragment.appendChild(item.agregarNuevoAlumno())
            })
            cardsAlumnos.appendChild(fragment)
         }

         if(tipo === "Profesor") {

            cardsProfesores.textContent = ""
            const fragment = document.createDocumentFragment()

            personas.forEach(item => {
                fragment.appendChild(item.agregarNuevoProfesor())
            })
            cardsProfesores.appendChild(fragment)
         }
     }
 }

 class Alumno extends Persona {
    #estado = false //El # hace que el estado sea privado.
    #alumno = "Alumno"
    //Al hacerlos privados necesitamos un set y un get. Al getter no le pasamos un parametro.
    set setEstado(estado) {
        this.#estado = estado
    }

    get getAlumno() {
        return this.#alumno
    }

    agregarNuevoAlumno() {
        const clone = templateAlumno.cloneNode(true)
        clone.querySelector("h5 .text-primary").textContent = this.nombre
        //Podemos acceder al getter dentro de un metodo.
        clone.querySelector("h6").textContent = this.getAlumno
        clone.querySelector(".lead").textContent = this.edad
        //El estado por defecto esta en false, por lo que sale con la clase success. Con el if_else vamos a poder cambiar el color del boton segun la situacion.
        if(this.#estado) {
            clone.querySelector(".badge").className = "badge bg-success"
            //Para que un boton esta desactivado cuando el otro esta activado y al reves.
            clone.querySelector(".btn-success").disabled = true
            clone.querySelector(".btn-danger").disabled = false
        } else {
            clone.querySelector(".badge").className = "badge bg-danger"
            //Para que un boton esta desactivado cuando el otro esta activado y al reves.
            clone.querySelector(".btn-danger").disabled = true
            clone.querySelector(".btn-success").disabled = false
        }
        //Operador ternario para hacerlo dinamico. Sino habria que hacerlo individulamente en el if y en el else.//
        clone.querySelector(".badge").textContent = this.#estado 
            ? "Aprobado" 
            : "Suspendido"

       /*  clone.querySelector(".btn-success").dataset.nombre = this.nombre
        clone.querySelector(".btn-danger").dataset.nombre = this.nombre */
        //Reemplazamos el dataset de estas dos lineas de codigo para que nos coja el userId.
        clone.querySelector(".btn-success").dataset.uid = this.uid
        clone.querySelector(".btn-danger").dataset.uid = this.uid

        return clone
    }
 }

 class Profesor extends Persona {
    #profesor = "Profesor"

    agregarNuevoProfesor() {
        const clone = templateProfesor.cloneNode(true)
        clone.querySelector("h5").textContent = this.nombre
        clone.querySelector("h6").textContent = this.#profesor
        clone.querySelector(".lead").textContent = this.edad
    
        return clone
    }
 }



