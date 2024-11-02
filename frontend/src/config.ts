export const AppConfig = {
  // @ts-expect-error - window.config is defined in index.html
  backendUrl: () => window.config ? window.config.BACKEND_URL : "http://localhost:8081",
};
