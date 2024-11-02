export const AppConfig = {
    // @ts-ignore
    backendUrl: () => window.config ? window.config.BACKEND_URL : 'http://localhost:8081'
}
