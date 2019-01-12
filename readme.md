[![Maintainability](https://api.codeclimate.com/v1/badges/a6f2b6b8ca5800a740bb/maintainability)](https://codeclimate.com/github/larrystone/PMS/maintainability)

# PMS
PMS is a collection of APIs for the Population Management System.

## Hosted Application
https://larrystone-pms.herokuapp.com/

## API endpoints
| Path             | Method  | Description  | Request <br/> Body  |  Request <br/> Parameters  | Special Notes  |
|------------------|---------|--------------|---------------------|----|---|
|  `/locations`    |POST     | Create new location |  { <br/> id: `int required`, <br/>name: `string required`, <br/> male: `int`, <br/> female: `int` <br/> subLocationId: `int`, <br/> subLocation: `object` <br/>}  | `null`  | <ul><li>subLocation object must contain keys **name, male and female**. </li><li>When `subLocation` and `subLocationId` are provided, subLocationId will be used after a validation check is passed </li></ol> |
|  `/locations`    |GET      | Get all locations| `null` | `null` | None |
|  `/locations/:id`|GET      | Get a single location record <br/> Supports nesting  |  `null` |  id: `int required` | By default a subLocation record will be returned with the data. An optional depth query (e.g `?depth=3`) can be added to list more than the default depth of 1. <br/> Please note that any depth request of more than 4 more will default the response to the max supported depth of 4  |
|  `/locations/:id`|PUT   | Delete a location record  | { <br/> id: `int required`, <br/>name: `string required`, <br/> male: `int`, <br/> female: `int` <br/> subLocationId: `int` <br/>}  |  id: `int required` |  A valid `subLocationId` must be provided and must be present in the database. |
|  `/locations/:id`|DELETE   | Delete a location record  | `null`   | id: `int required`  | None |

## Installation 
1. Install [`node`](https://nodejs.org/en/download/), version 5 or greater

2. Install [`postgres`](https://www.postgresql.org/download/)

3. Clone the repo and cd into it

    ```
    git clone https://github.com/larrystone/PMS.git"
    cd pms
    ```

4. Install all dependencies

    ```
    yarn install
    ```

5. Configure Postgres

    ```
    configure your environment variables in
    `./api/configs/index.js` using .env.example file template
    ```

6.  Run database migrations

    ```
    $ sequelize db:migrate
    ```

7. Start the app

    ```
    yarn dev
    ```

8. Test the application with POSTMAN or with curl

    ```
    http://localhost:3000/
    ```    

## Testing

The app uses `Mocha`, `Chai` and `Chai-Http` for testing, 
Run `yarn test` to run tests

## Limitations
- You can only view location record with up to 4 level of nesting for depth. However, you can create unlimited level of nesting

## Built With
* [NodeJS](https://nodejs.org/en/) - A Javascript runtime built on chrome V8 engine that uses an event-driven non-blocking I/O model that makes it lightweight and efficient.
* [ExpressJs](https://expressjs.com/) - A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
* [Sequelize](http://docs.sequelizejs.com/) - An ORM for Node.js that supports the dialects of PostgreSQL and features solid transaction support an relations.
* [Postgres](https://www.postgresql.org/) - A powerful, open source object-relational database system.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details


## Author

* **Lawal Lanre E. (Larrystone)** - Aspiring Software Dev.
