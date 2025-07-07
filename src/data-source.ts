import { DataSource } from "typeorm";
import { Contact } from "./identification/entities/contact.entity";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  username: process.env.PG_USER,
  password: process.env.PG_PASS,
  database: "postgres",
  synchronize: true,
  logging: true,
  entities: [Contact],
  subscribers: [],
  migrations: [],
});
