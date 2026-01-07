import { GlobalConfig } from "./config";
import { userInfo } from "./userInfo";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";

// 定义更严格的响应类型
export interface ResponseBean {
  code: number;
  message: string | null;
  data: any;
}

// 请求配置接口
interface RequestConfig extends RequestInit {
  headers?: Record<string, string>;
  // 是否跳过全局错误处理（自行处理错误）
  skipErrorHandler?: boolean;
  // 超时时间（毫秒）
  timeout?: number;
}

export default class Request {
  //private baseUrl: string;
  //private defaultConfig: RequestConfig;

  constructor() {
    // this.baseUrl = baseUrl || GlobalConfig.apiUrl;
    // this.defaultConfig = {
    //   headers: {
    //     "Content-Type": "application/json",
    //     ...defaultConfig.headers,
    //   },
    //   ...defaultConfig,
    // };
  }

  /**
   * 核心请求方法
   */
  private async request(
    url: string,
    method: HttpMethod = "GET",
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<ResponseBean> {
    // 处理 URL
    const fullUrl = url.startsWith("http")
      ? url
      : `${GlobalConfig.apiUrl}${url}`;

    // 合并配置
    const mergedConfig: RequestInit = {
      ...config,
      method,
      body:JSON.stringify(data)
    };
    // 处理 body（如果是 GET/HEAD 请求，不应该有 body）
    // if (data && method !== "GET" && method !== "HEAD") {
    //   if (mergedConfig.headers.get("Content-Type")?.includes("application/json")) {
    //     mergedConfig.body = JSON.stringify(data);
    //   } else if (data instanceof FormData) {
    //     // 如果是 FormData，让浏览器自动设置 Content-Type
    //     headers.delete("Content-Type");
    //     mergedConfig.body = data;
    //   } else {
    //     mergedConfig.body = data as BodyInit;
    //   }
    // }
    
    mergedConfig.headers =  {
      "token": userInfo.token,
      'Content-Type':'application/json',
      ...mergedConfig.headers,
    }
    console.log( mergedConfig.headers)

    // 设置超时
    const timeout = config.timeout || 30000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    mergedConfig.signal = controller.signal;

    try {
      const response = await fetch(fullUrl, mergedConfig);
      clearTimeout(timeoutId);

      // 处理响应
      const contentType = response.headers.get("content-type");
      let responseData: any;

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // HTTP 状态码错误处理
      if (!response.ok) {
        const errorMessage =
          responseData?.message ||
          responseData?.error ||
          response.statusText ||
          `HTTP ${response.status}`;

        throw new Error(errorMessage);
      }

      console.log(responseData, typeof responseData);
      // 业务逻辑错误处理（如果您的 API 使用特定的错误码）
      if (
        responseData &&
        responseData.code !== undefined &&
        responseData.code !== 200
      ) {
        console.log(responseData, typeof responseData);
      }

      return responseData as ResponseBean;
    } catch (error) {
      clearTimeout(timeoutId);

      throw error;
    }
  }

  /**
   * GET 请求
   */
  async get(url: string, config?: RequestConfig): Promise<ResponseBean> {
    return this.request<T>(url, "GET", undefined, config);
  }

  /**
   * POST 请求
   */
  async post(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ResponseBean> {
    return this.request<T>(url, "POST", data, config);
  }

  /**
   * PUT 请求
   */
  async put(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ResponseBean> {
    return this.request<T>(url, "PUT", data, config);
  }

  /**
   * PATCH 请求
   */
  async patch(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ResponseBean> {
    return this.request<T>(url, "PATCH", data, config);
  }

  /**
   * DELETE 请求
   */
  async delete(url: string, config?: RequestConfig): Promise<ResponseBean> {
    return this.request<T>(url, "DELETE", undefined, config);
  }

  /**
   * 上传文件（使用 FormData）
   */
  async upload<T = any>(
    url: string,
    file: File | File[],
    additionalData: Record<string, any> = {},
    config?: RequestConfig
  ): Promise<ResponseBean<T>> {
    const formData = new FormData();

    if (Array.isArray(file)) {
      file.forEach((f) => formData.append("files", f));
    } else {
      formData.append("file", file);
    }

    // 添加额外数据
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return this.request<T>(url, "POST", formData, {
      ...config,
      headers: {
        // 上传文件时让浏览器自动设置 Content-Type
        ...config?.headers,
      },
    });
  }

  /**
   * 下载文件
   */
  async download(
    url: string,
    filename?: string,
    config?: RequestConfig
  ): Promise<void> {
    const response = await fetch(url, {
      ...this.defaultConfig,
      ...config,
      method: config?.method || "GET",
    });

    if (!response.ok) {
      throw new Error(`下载失败: ${response.statusText}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

// 创建一个全局实例
export const http = new Request();

// 快捷方法导出
// export const http = {
//   get: api.get.bind(api),
//   post: api.post.bind(api),
//   put: api.put.bind(api),
//   patch: api.patch.bind(api),
//   delete: api.delete.bind(api),
//   upload: api.upload.bind(api),
//   download: api.download.bind(api),
// };
