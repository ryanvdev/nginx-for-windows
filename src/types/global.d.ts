declare global {
    namespace NodeJS {
        interface ProcessEnv {}
    }

    interface IndexSignature<T = any> {
        [Key: string | number | symbol]: T;
    }
}

export {};
