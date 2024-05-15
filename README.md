# APP Transactions

## Arquitectura

La aplicación consta de tres microservicios en Node.js:

- **api-gateway**: Maneja las solicitudes del cliente utilizando GraphQL y está integrado con Redis para la gestión de la caché.
- **ms-transaction**: Se encarga de almacenar datos en la base de datos.

- **ms-anti-fraud**: Procesa y valida el monto de la trasación, apartir de ello aprueba o rechaza.

![Arquitectura](https://raw.githubusercontent.com/chaicopadillag/app-nodejs-codechallenge/develop/arquitectura.png)

Sigue estos pasos para ejecutar los microservicios de la aplicación.

## Clonar el Monorepo

```bash
git clone git@github.com:chaicopadillag/app-nodejs-codechallenge.git
```

## Instalación

Instala las dependencias de cada microservicio de forma individual si deseas ejecutarlos localmente de manera independiente. Omitir este paso si planeas dockerizar los componentes.

```
yarn install

```

## Ejecutar la aplicación

```
# modo desarrollo
yarn run start

# modo watch
yarn run start:dev

# modo producción
yarn run start:prod

```

## Pruebas

```
# pruebas unitarias
yarn run test

# pruebas end-to-end
yarn run test:e2e

# cobertura de pruebas
yarn run test:cov

```

## Dockerizar Componentes

Para construir y ejecutar los componentes con Docker, utiliza el siguiente comando. Asegúrate de que los componentes estén en ejecución y, si no lo están, inícialos manualmente.

```
docker compose up -d

```

## Verificación

Para verificar, visita [http://localhost:8082/graphql](http://localhost:8082/graphql) y ejecuta la consulta transactionTypes para obtener los tipos de transacciones. Selecciona un id del transactionType para crear una Transaction. Por ejemplo:

```
{
  "createTransaction": {
     "accountExternalIdDebit": "82eb59e1-a9db-4d55-a7d9-20ae8ec11ba8",
    "accountExternalIdCredit": "4343e650-f44a-40e7-963e-4b7aa6c865a2",
    "transferTypeId": "38b135a7-263f-4591-87e2-ff3ca93615d2",
    "value": 250
  }
}

```

## Autor

[Gerardo Chaico](https://chaicopadillag.github.io/) - Desarrollador Full-stack
