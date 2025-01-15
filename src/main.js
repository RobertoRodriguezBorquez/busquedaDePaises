//guardar título y actualizarlo.
const titulo = document.querySelector("header h1");
titulo.innerHTML = "Busqueda de paises.";

//guardar tabla para almacenar los datos de países.
const tableListado = document.getElementById("table-listado");
tableListado.innerHTML = "";

const seccionTarjeta=document.querySelector("main")
seccionTarjeta.innerHTML="";




//guardar boton de busqueda y busqueda
const imputPaís=document.getElementById("buscador")
const btnBuscar = document.getElementById("bntBuscar");
const salidaTexto=document.getElementById("resultado")

// bandera país cuando no carga la img.
 const alt="bandera de: "


 //función para guardar el texto del imput buscador.
 btnBuscar.addEventListener("click",(name)=>{
  getApiBusqueda()
    name=imputPaís.value.toLowerCase()
   console.log(name);
   salidaTexto.innerHTML=`resultado: ${name}`; 

   
   
 })
 

//funcion estilos para resultado de busqueda
const disenoBusqueda = (id, name, bandera, poblacion,capital) => {
   
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
const disenoTarjeta=(name,bandera,poblacion,abreviacion,languages,traduccion1,traduccion3,traduccion2,traduccion4,traduccion5)=>{
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

}

//función para acceder a la api

const getApiBusqueda = async () => {
  const urlpi = "https://restcountries.com/v3.1/region/South America"; // acceder por region

  try {
    const acceso = await fetch(urlpi);
    if (acceso.status == 200) {
      const respuesta = await acceso.json(); // se convierte en json la respuesta de la url
      
      const id = 0;
      
      respuesta.forEach((pais, id) => {
        //de la respuesta que esta ya por la region south america, saco y guardo en variable los datos que quiero.
        /*  console.log(pais.name.common); */

        
       
        const name = pais.name.common;
        const bandera = pais.flags.png;
        const poblacion = pais.population.toLocaleString('es-ES');
        const abreviacion = pais.cca2;
        
        const languages = pais.languages.spa;
        const capital = pais.capital[0];
        //sacar traducciones
        const traduccion1=pais.translations.spa.common;
        const traduccion2=pais.translations.fra.common;
        const traduccion3=pais.translations.jpn.common;
        const traduccion4=pais.translations.per.common;
        const traduccion5=pais.translations.bre.common;
        
        
        
        
        id++;

        /* pasamos los argumentos a la funcion del diseno table para que cree la tabla con cada parametro que se le pase a la funcion de disenoBusqueda*/
        tableListado.innerHTML += disenoBusqueda(id, name, bandera,poblacion,capital);
        seccionTarjeta.innerHTML += disenoTarjeta(name,bandera,poblacion,abreviacion,languages,traduccion1,traduccion3,traduccion2,traduccion4,traduccion5)
        
      });
      
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

getApiBusqueda();


