import { createContext, useContext } from "react";

export interface Config {
  readonly backendUrl: string;
}

export const ConfigContext = createContext<Config>({} as Config);

interface ConfigProviderProps {
  children?: React.ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const config: Config = {
    // @ts-expect-error - window.config is defined in index.html
    backendUrl: window.config ? window.config.BACKEND_URL : "http://localhost:8081",
  };
  return <ConfigContext.Provider value={config}>
    {children}
  </ConfigContext.Provider>;
};

export const useConfig = () => {
  return useContext(ConfigContext);
};