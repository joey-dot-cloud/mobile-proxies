export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      WEB_PORT: number;
      [key: string]: string | undefined;
    }
  }
}
