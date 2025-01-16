//guardar título y actualizarlo.
const titulo = document.querySelector("header h1");
titulo.innerHTML = "Busqueda de paises.";

//guardar tabla para almacenar los datos de países.
const tableListado = document.getElementById("table-listado");
tableListado.innerHTML = "";

const seccionTarjeta = document.querySelector("main");
seccionTarjeta.innerHTML = "";

//guardar boton de busqueda y busqueda
const imputPaís = document.getElementById("buscador");
const btnBuscar = document.getElementById("bntBuscar");
const salidaTexto = document.getElementById("resultado");

// bandera país cuando no carga la img.
const alt = "bandera de: ";
//variable id en la tabla de paises buscados
let id=0;



//funcion debounce para controlar el tiempo de la busqueda en el input
function debounce(func, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

//funcion estilos para resultado de busqueda
const disenoBusqueda = (id, name, bandera, poblacion, capital) => {
  return `
  
      <tbody>
        <tr>
          <td>${id}</td>
          <td>
            <img
            
              src="${bandera}"
              alt="${alt}${name}"
              
              width="20"
            />
          </td>
          <td>${name}</td>
          <td>${poblacion}</td>
          <td>${capital}</td>
          <td>Ver...</td>
        </tr>
      
        
      </tbody>
  `;
};

//funcion diseño de tarjeta alo presionar ver más.
const disenoTarjeta = (
  name,
  bandera,
  poblacion,
  abreviacion,
  languages,
  traduccion1,
  traduccion3,
  traduccion2,
  traduccion4,
  traduccion5
) => {
  return `
     <div class="info-pais">
          <h1 class="info-pais-titulo">País:${name}</h1>
          <h2>Bandera</h2>
          <div class="bandera">
              <img
                  src="${bandera}"
                  alt="${alt}${name}"
                  
                />
          </div>
        </div>
        <div class="informacion">
          <h2>poblacón</h2>
          <p>${poblacion}</p>
          <h2>idioma</h2>
          <p>${languages}</p>
          <h2>código alpha</h2>
          <p>${abreviacion}</p>
        </div>
        <div class="traduccion">
          <h1>traducción</h1>
          <p>${traduccion1}</p>
          <p>${traduccion2}</p>
          <p>${traduccion3}</p>
          <p>${traduccion4}</p>
          <p>${traduccion5}</p>
          
        </div>
  `;
};

//función para acceder a la api

const getApiBusqueda = async (paisBusqueda,) => {
  const urlpi = `https://restcountries.com/v3.1/translation/${paisBusqueda}`;
  

  try {
    const acceso = await fetch(urlpi);
    if (acceso.status == 200) {
      const respuesta = await acceso.json(); // se convierte en json la respuesta de la url

       // Incrementamos el id antes de usarlo
       id++;

      // Extraer los datos necesario
      const name = respuesta[0].name.common;
      const bandera = respuesta[0].flags.png;
      const poblacion = respuesta[0].population.toLocaleString("es-ES");
      const abreviacion = respuesta[0].cca2;
      const languages = Object.values(respuesta[0].languages).join(", ");
      const capital = respuesta[0].capital[0];

      // Traducciones
      const traduccion1 =
        respuesta[0].translations.spa.common || "Sin traducción";
      const traduccion2 =
        respuesta[0].translations.fra.common || "Sin traducción";
      const traduccion3 =
        respuesta[0].translations.jpn.common || "Sin traducción";
      const traduccion4 =
        respuesta[0].translations.per.common || "Sin traducción";
      const traduccion5 =
        respuesta[0].translations.bre.common || "Sin traducción";

      /* pasamos los argumentos a la funcion del diseno table para que cree la tabla con cada parametro que se le pase a la funcion de disenoBusqueda*/
      tableListado.innerHTML += disenoBusqueda(
        id,
        name,
        bandera,
        poblacion,
        capital
      );
      seccionTarjeta.innerHTML += disenoTarjeta(
        name,
        bandera,
        poblacion,
        abreviacion,
        languages,
        traduccion1,
        traduccion3,
        traduccion2,
        traduccion4,
        traduccion5
      );
      
    } else if (acceso.status === 404) {
      console.log("No se encontró la API");
    } else if (acceso.status === 401) {
      console.log("No tienes permisos");
    } else {
      console.log("Error desconocido");
    }
  } catch (error) {
    console.error("Error al acceder a la API:", error);
  }
};


// función para manejar el input con debounce
const handleInput = (event) => {
  clearTable()
  const paisImput = event.target.value.toLowerCase().trim();
  if (paisImput) {
    salidaTexto.innerHTML = `Resultado: ${paisImput}`;
    getApiBusqueda(paisImput); // Llama a la función de búsqueda
  } else {
    salidaTexto.innerHTML = "Por favor, ingresa un país.";
    tableListado.innerHTML = ""; // Limpia la tabla si no hay texto
  }

};

//Función para limpiar table
const clearTable=()=>{
  tableListado.innerHTML = "";
  seccionTarjeta.innerHTML = "";
}

// Envolver la función con debounce
const handleDebouncedInput = debounce(handleInput, 500); 

// Asignar el evento al input
imputPaís.addEventListener("input", handleDebouncedInput);

// Carga inicial
document.addEventListener("DOMContentLoaded", getApiBusqueda);
