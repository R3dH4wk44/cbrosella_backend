# API RestFull con Node.js Express para la web del CBROSELLA

## Como iniciar el proyecto.

1. Inicia una base de datos de postgreSQL
2. Instala las dependencias necesarias para el pryecto usando `npm install`
3. Crea un .env en la raiz con las variables siguientes:

`
DATABASE_URL= *URL de la base de datos de postgreSQL*
JWT_SECRET= *Una clave secreta para JWT *
PORT= *El puerto que debe usar el backend *
DATABASE_NAME=*Nombre de la base de datos de postgreSQL*
DATABASE_USER=*Usuario Con permisos a la base de datos*
DATABASE_USER_PASSWORD=*Contraseña para el usuario con permisos*
ORIGIN_URL=  *Url de tu raiz, para habilitar el CORS desde este origen seguramente http://localhost:4321 si estas en desarrollo*
`

4. Crea las tablas usando `node ./db_config/initTable.js`
5. Añade unos inserts de prueba con el comando `node ./db_config/startingInserts.js`
6. Inicializa el servicio con `node index.js` o `node --watch index.js` si prefieres que se actualize el servidor cada vez que guardas algun cambio.


## Estructura de la base de datos

Esta base de datos dispone de 7 tablas, (users,category,game,post,teams, products, products_category) las cuales podras ver en ./db_config/configuracionInicial.sql

## Rutas para la API

Esta API tiene en ./routes un archivo js para cada tabla la base de datos, estos contienen los endpoints necesarios para hacer un CRUD de la tabla, entre otras, como por ejemplo comprobar el login del usuario, una ruta privada para ver si es administrador etc...


## Schemas

La API dispone de esquemas para validar datos en ./schemas donde hay un js por cada tabla que la necesite.



This website is developed by *Albert Jané Medràn* feel free to test with it and let me know if you would imporve something.


