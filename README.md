# APP Transactions

## Arquitectura:

Consta de 3 Microservicios Node.js `api-gateway` para manejar las peticiones del cliente (Graphql), integrado con Redis para manejar cache, `ms-transaction` para guardar datos en la base de datos y `ms-anti-fraud` apra procesar datos, validar,etc.

![Arquitectura](https://raw.githubusercontent.com/chaicopadillag/app-nodejs-codechallenge/develop/arquitectura.png)

Sigue las pasos para correr los microservicios de la applicación.

## Clonar el Monorepo

```
git clone git@github.com:chaicopadillag/app-nodejs-codechallenge.git
```

## Instalación

Realizar las instalaciones de las dependencias individualmente de los microservicios para corren en local de manera independiente. Omitir este paso si dockeriza los componentes.

```bash
$ yarn install
```

### Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Dockerizar Componentes

Para construir y levantar los componentes con docker ejecutar el siguiente comando, verficar que los componentes esten corriendo y si esta detenido iniciar manualmente.

```
docker compose up -d
```

## Verificar

Para verificar ingresa a [http://localhost:8082/graphql](http://localhost:8082/graphql) y ejecutar el query `transactionTypes` para obtener los tipos de transacciones, seleccione un `id` del `transactionType` para crear una `Transaction` ejemplo:

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

[Gerardo Chaico](https://chaicopadillag.github.io/) Full-stack Developer
