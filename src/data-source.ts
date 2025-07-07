import {DataSource} from "typeorm";
import {Contact} from "./identification/entities/contact.entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    synchronize: true,
    logging: true,
    entities: [Contact],
    subscribers: [],
    migrations: [],
})
