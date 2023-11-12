//VARIABLES

const CARRITO = document.querySelector("#carrito");
const CONTENEDOR_CARRITO = document.querySelector("#lista-carrito tbody");
const VACIAR_CARRITO = document.querySelector("#vaciar-carrito");
const CURSOS = document.querySelector("#lista-cursos");
let ARTICULOS_CARRITO = [];

//LLAMAR FUNCIONES EN UNA FUNCION
generarEventos();
function generarEventos() {
  //AGREGAMOS AL CARRITO UN CURSO APRENTANDO EL BTN AGRAGAR AL CARRITO
  CURSOS.addEventListener("click", seleccionarCurso);

  //ELIMINA CURSOS DEL CARRITO
  CARRITO.addEventListener("click", eliminarCurso);

  //VACIAR CARRITO
  VACIAR_CARRITO.addEventListener("click", () => {
    ARTICULOS_CARRITO = []; // RESETEAMOS EL ARRAY

    limpiarHTML(); //ELIMINAMOS TODOS LOS PRODUCTOS DEL CARRITO
  });

  //UNA VEZ QUE SE CARGA TODO EL CONTENIDO HTMLDOM
  document.addEventListener('DOMContentLoaded', () => {
    ARTICULOS_CARRITO =JSON.parse(localStorage.getItem('carrito')) || [] // SOBRE ARTICULOS CARRITO(ARRAY DEL CARRITO), VAMOS A ACCEDER AL LOCALSTORAGE Y VAMOS A OBTENER LOS ELEMENTOS(CURSOS) QUE SE ENCUENTRAN EN LA PROPIEDAD CARRITO UNA VEZ QUE LO HAYAMOS CONVERTIDO DEVUELTA EN UN OBJETO, SI NO TIENE NADA DEVUELVE UN ARRAY VACIO

    carritoHTML()// LO CARGAMOS PARA SE ACTUALICE Y SIGA TODO COMO LO HABIAMOS DEJADO
  });
 
}

//FUNCIONES VARIAS
function seleccionarCurso(e) {
  e.preventDefault(); // PREVENIMOS EL EVENTO POR DEFECTO

  if (e.target.classList.contains("agregar-carrito")) {
    const CURSO_SELECCIONADO = e.target.parentElement.parentElement;
    leerDatosCurso(CURSO_SELECCIONADO);
  }
}

//ELIMINAR CURSOS DEL CARRITO
function eliminarCurso(e) {
  if (e.target.classList.contains("borrar-curso")) {
    //OBTENEMOS EL ID DEL PRODUCTO
    const CURSO_ID = e.target.getAttribute("data-id");

    //ELIMINA DEL ARRAY ARTICULOS_CARRITO por EL DATA-ID
    ARTICULOS_CARRITO = ARTICULOS_CARRITO.filter(
      (curso) => curso.id !== CURSO_ID
    ); // EL ARTICULO SE MANTENDRA EN EL NUEVO ARRAY SI EL ID DE curso.id NO ES IGUAL AL id de CURSO ID. (!== SI ES DIFERENTE DE CURSO_ID)

    //ITERAR SOBRE EL CARRITO Y MOSTRAR SU HTML
    carritoHTML(); // LLAMAMOS A LA FUNCION PARA ACTUALIZAR LOS PRODUCTOS DEL CARRITO
  }
}

//LEER EL CONTENIDO HTML AL QUE LE DIMOS CLICK y EXTRAER INFORMACION DEL CURSO
function leerDatosCurso(curso) {
  //CREAMOS UN OBJETO QUE CONTIENE LA INFORMACION DEL CURSO
  const infoCurso = {
    title: curso.querySelector("h4").textContent,
    image: curso.querySelector("img").src,
    price: curso.querySelector(".precio span").textContent,
    id: curso.querySelector("a").getAttribute("data-id"), // SELECCIONAMOS EL ID QUE CONTIENE CADA CURSO
    count: 1,
  };
  //REVISA SI UN ELEMENTO SE ENCUENTRA EN EL OBJETO(CARRITO)

  const EXISTE = ARTICULOS_CARRITO.some((curso) => curso.id === infoCurso.id);

  if (EXISTE) {
    //ACTUALIZAMOS LA CANTIDAD

    const CANTIDAD = ARTICULOS_CARRITO.map((curso) => {
      if (curso.id === infoCurso.id) {
        //SI EL ID DEL CURSO ES IGUAL A EL ID DEL OBJETO
        curso.count++; //AUMENTA LA CANTIDAD EN 1
        return curso; // RETORNA EL OBJETO ACTUALIZADO (EL NUEVO ARRAY)
      } else {
        return curso; // RETORNA LOS OBJETOS SIN ACTUALIZAR(OBJETOS NUEVOS)
      }
    });
    ARTICULOS_CARRITO = [...CANTIDAD]; // UNA VEZ QUE SE ACTUALIZA/SUMA LA CANTIDAD TE DEVUELVE UN NUEVO ARRAY
  } else {
    //AGREGAMOS ELEMENTOS AL ARRAY DE CARRITOS

    ARTICULOS_CARRITO = [...ARTICULOS_CARRITO, infoCurso]; // SE ACTUALIZA CADA VEZ QUE AGREGAS UN NUEVO CURSO
  }

  carritoHTML();
}

//MUESTRA LOS ELEMENTO EN EL CARRITO DE COMPRAS HTML(DOCUMENTO)
function carritoHTML() {
  //LIMPIA EL HTML QUE SE REPITE
  limpiarHTML();
  //RECORRE EL CARRITO Y GENERA HTML
  ARTICULOS_CARRITO.forEach((curso) => {
    const { image, title, price, count, id } = curso; // UTILIZAMOS DESTRUCTIRING PARA QUE SEA MAS LEGIBLE Y BIEN ESTRUCTUTRADO
    const ROW = document.createElement("tr");
    ROW.innerHTML = `
        <td>
            <img src="${image}" width = "100">
        </td>
        <td>
            ${title}
        </td>
        <td>
            ${price}
        </td>
        <td>
            ${count}
        </td>
        <td>
            <a href="#" class="borrar-curso" data-id="${id}"> X </a>
        </td>
        `;
    CONTENEDOR_CARRITO.appendChild(ROW); // ESTAMOS AGREGANDO LOS CURSOS ITERADOS CON EL ELEMENTO QUE CREAMOS EN LE TBODY QUE SE ENCUENTRA ALMACENADO EN CONTENDOR_CARRITO
  });

  // AGREGAR LOS CURSOS AL LOCALSTORGE

  sincronizarStorage();
}

//VAMOS A CARGAR LOS CURSOS EN EL LOCALSTORAGE

function sincronizarStorage(){
localStorage.setItem('carrito',JSON.stringify(ARTICULOS_CARRITO))// VAMOS A ESTAR CARGANDO LOS ELEMENTOS(CURSOS) DEL CARRITO EN EL LOCALSTORAGE UNA VEZ QUE A CADA (JSON 'JAVASCRIPT OBJECT NONATION' (NOTACION DE OBJETOS EN JAVASCRIPT))OBJETO LO CONVIRTAMOS EN STRING, VAN A ESTAR ALMACENADOS EN LA PROPIEDAD 'carrito'
}



//LIMPIAR HTML PREVIO DEL CARRITO
function limpiarHTML() {
  //MIENTRAS CONTENEDOR_CARRITO TENGA UN HIJO
  while (CONTENEDOR_CARRITO.firstChild) { 
    CONTENEDOR_CARRITO.removeChild(CONTENEDOR_CARRITO.firstChild); // VA A ELIMINAR EL SEGUNDO HIJO DE CONTENEDOR CARRITO, DEJA DE FUNCIONAR UNA VEZ QUE CONTENEDOR_CARRITO NO TENGA MAS UN HIJO
  }
}
