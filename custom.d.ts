declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;

      // Postgres
      PG_HOST?: string;
      PG_PORT?: string;
      PG_USER?: string;
      PG_PASS?: string;
    }
  }
}

export {};
