//guardar título y actualizarlo.
const titulo = document.querySelector("header h1");
titulo.innerHTML = "Buscador de Países";

//guardar tabla para almacenar los datos de países.
const tableListado = document.getElementById("table-listado");
tableListado.innerHTML = "";

const seccionTarjeta = document.querySelector("main");
seccionTarjeta.innerHTML = "";

//guardar  busqueda
const imputPaís = document.getElementById("buscador");

// bandera país cuando no carga la img.
const alt = "bandera de: ";
//variable id en la tabla de paises buscados
let id = 0;
//arreglo para almacenar los datos para hacer click y ver las tarjetas con los datos respectivos.
const paisesData = [];

//funcion debounce para controlar el tiempo de la busqueda en el input
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

//funcion estilos para resultado de busqueda
const disenoBusqueda = (id, name, bandera, poblacion, capital, region) => {
  return `
  
      <tbody>
        <tr>
           <td><button class="btn-ver-detalle" data-id="${id}">Ver Detalle</button>
</td>
          <td>
            <img
            
              src="${bandera}"
              alt="${alt}${name}"
              
              width="30"
             
            />
          </td>
          <td>${name}</td>
          <td>${poblacion}</td>
          <td>${capital}</td>
          <td>${region}</td
         
          
          
        </tr>
      
        
      </tbody>
  `;
};

//funcion diseño de tarjeta alo presionar ver más.
const disenoTarjeta = (
  name,
  bandera,
  subregion,
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
        <h2>Sub región</h2>
          <p>${subregion}</p>  
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

const getApiBusqueda = async (paisBusqueda) => {
  const urlpi = `https://restcountries.com/v3.1/name/${paisBusqueda}`;

  try {
    const acceso = await fetch(urlpi);
    if (acceso.status === 200) {
      const respuesta = await acceso.json(); // Respuesta en formato JSON

      // Limpia la tabla y sección antes de agregar resultados
      tableListado.innerHTML = "";
      seccionTarjeta.innerHTML = "";
      const dataPais = [];

      // Iterar sobre todos los países relacionados
      respuesta.forEach((pais) => {
        id++; // Incrementar ID para cada país

        const name = pais.name.common;
        const bandera = pais.flags.png;
        const poblacion = pais.population.toLocaleString("es-ES");
        const abreviacion = pais.cca2;
        const languages = Object.values(pais.languages || {}).join(", ");
        const capital = pais.capital ? pais.capital[0] : "Sin capital";
        const region = pais.region;
        const subregion = pais.subregion || "Sin subregión";

        // Traducciones
        const traducciones = [
          pais.translations?.spa?.common || "Sin traducción",
          pais.translations?.fra?.common || "Sin traducción",
          pais.translations?.jpn?.common || "Sin traducción",
          pais.translations?.per?.common || "Sin traducción",
          pais.translations?.bre?.common || "Sin traducción",
        ];

        // Actualizar tabla y tarjetas
        tableListado.innerHTML += disenoBusqueda(
          id,
          name,
          bandera,
          poblacion,
          capital,
          region
        );

        paisesData.push({
          id,
          name,
          bandera,
          subregion,
          poblacion,
          abreviacion,
          languages,
          traducciones,
        });
      });
    } else if (acceso.status === 404) {
      console.log("No se encontraron resultados para la búsqueda.");
    } else {
      console.log("Error al acceder a la API.");
    }
  } catch (error) {
    console.error("Error al acceder a la API:", error);
  }
};

// función para manejar el input con debounce
const handleInput = (event) => {
  clearTable();
  const paisImput = event.target.value.toLowerCase().trim();
  if (paisImput) {
    getApiBusqueda(paisImput); // Llama a la función de búsqueda
  } else {
    salidaTexto.innerHTML = "Por favor, ingresa un país.";
    clearTable();
  }
};

//Función para limpiar table
const clearTable = () => {
  tableListado.innerHTML = "";
  seccionTarjeta.innerHTML = "";
};

// Evento para ver detalles del país seleccionado
tableListado.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-ver-detalle")) {
    const id = event.target.getAttribute("data-id"); // Obtén el id del botón
    const paisSeleccionado = paisesData.find((pais) => pais.id == id); // Encuentra el país

    if (paisSeleccionado) {
      seccionTarjeta.innerHTML = disenoTarjeta(
        paisSeleccionado.name,
        paisSeleccionado.bandera,
        paisSeleccionado.subregion,
        paisSeleccionado.poblacion,
        paisSeleccionado.abreviacion,
        paisSeleccionado.languages,
        ...paisSeleccionado.traducciones
      );
    }
  }
});

// Envolver la función con debounce
const handleDebouncedInput = debounce(handleInput, 200);

// Asignar el evento al input
imputPaís.addEventListener("input", handleDebouncedInput);

// Carga inicial
document.addEventListener("DOMContentLoaded", getApiBusqueda(""));
