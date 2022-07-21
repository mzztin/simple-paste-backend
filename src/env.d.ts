declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            POSTGRES_PORT: string;
            POSTGRES_USER: string;
            POSTGRES_DATABASE: string;
            POSTGRES_HOST: string;
            POSTGRES_PASSWORD: string;
        }
    }
}

export {};
