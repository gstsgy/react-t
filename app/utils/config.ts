// src/utils/config.ts
// 定义配置类型（类型安全！）
interface AppConfig {
    apiUrl: string;
    timeout: number;
    prefix:string,
    featureFlags: {
      newDashboard: boolean;
    };
  }
  
  // 提供默认值（开发时兜底）
  const DEFAULT_CONFIG: AppConfig = {
    apiUrl: "http://localhost:8080",
    timeout: 5000,
    prefix:'react-t',
    featureFlags: {
      newDashboard: false
    }
  };
  let GlobalConfig: AppConfig =  DEFAULT_CONFIG;
  // 安全访问
if (typeof window !== 'undefined') {
  GlobalConfig = (window as any).__APP_CONFIG__
}
  // 从 window 获取配置
  export  {GlobalConfig};