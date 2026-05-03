import { API_HOST as HOST } from './env';

const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};
    
function queryStringify(data: Record<string, string | number | boolean | null | undefined>): string {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Data must be a non-null object');
  }
  
  const keys = Object.keys(data);
    
  if (keys.length === 0) {
    return '';
  }
  
  return keys.reduce((result, key, index) => {
    if (data[key] === undefined || data[key] === null) {
      return result;
    }
      
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(data[key]);
      
    const separator = index < keys.length - 1 ? '&' : '';
      
    return `${result}${encodedKey}=${encodedValue}${separator}`;
  }, '?');
}
    
class HTTPTransport {
  private readonly basePath: string;

  constructor(basePath = '') {
    this.basePath = basePath.replace(/\/$/, '');
  }

  private resolveUrl(url: string): string {
    if (/^https?:\/\//.test(url)) {
      return url;
    }

    const path = url.startsWith('/') ? url : `/${url}`;

    if (!this.basePath) {
      return `${HOST}${path}`;
    }

    const normalizedBasePath = this.basePath.startsWith('/') ? this.basePath : `/${this.basePath}`;

    return `${HOST}${normalizedBasePath}${path}`;
  }

  get = (url: string, options: Record<string, unknown> = {}) => {
    return this.request(
      this.resolveUrl(url), 
      {...options, method: METHODS.GET}, 
      options.timeout as number | undefined
    );
  };

  post = (url: string, options: Record<string, unknown> = {}) => {
    return this.request(
      this.resolveUrl(url), 
      {...options, method: METHODS.POST}, 
      options.timeout as number | undefined
    );
  };

  put = (url: string, options: Record<string, unknown> = {}) => {
    return this.request(
      this.resolveUrl(url), 
      {...options, method: METHODS.PUT}, 
        options.timeout as number | undefined
      );
    };

  delete = (url: string, options: Record<string, unknown> = {}) => { 
    return this.request(
      this.resolveUrl(url), 
      {...options, method: METHODS.DELETE}, 
      options.timeout as number | undefined
    );
  };

  request = (url: string, options: Record<string, unknown> = {}, timeout: number = 5000) => {
    const method = options.method as string | undefined;
    const data = options.data;
    const responseType = options.responseType as XMLHttpRequestResponseType | undefined;
    const headers = (options.headers ?? {}) as Record<string, string>;
  
    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error('HTTP method is required'));
        return;
      }
  
      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;
  
      xhr.open(
        method as string,
        isGet && data ? `${url}${queryStringify(data as Record<string, string | number | boolean | null | undefined>)}` : url,
      );

      xhr.withCredentials = true;
  
      if (responseType) {
        xhr.responseType = responseType as XMLHttpRequestResponseType;
      }
  
      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key]);
      });
  
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          let response;
            
          if (xhr.responseType) {
            response = xhr.response;
          } else {
            try {
              const contentType = xhr.getResponseHeader('Content-Type');
              if (contentType && contentType.includes('application/json')) {
                response = JSON.parse(xhr.responseText);
              } else {
                response = xhr.responseText;
              }
            } catch {
              response = xhr.responseText;
            }
          }
  
          resolve(response);
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText,
            response: xhr.responseText,
            request: xhr
          });
        }
      };
  
      xhr.onabort = () => reject({
        reason: 'Request aborted',
        request: xhr
      });
        
      xhr.onerror = () => reject({
        reason: 'Network error',
        request: xhr
      });
        
      xhr.timeout = timeout;
        
      xhr.ontimeout = () => reject({
        reason: 'Request timeout',
        timeout: timeout,
        request: xhr
      });
  
      if (isGet || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else if (typeof data === 'object') {
        if (!headers['Content-Type']) {
          xhr.setRequestHeader('Content-Type', 'application/json');
        }
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send(data as Document | XMLHttpRequestBodyInit | null | undefined);
      }
    });
  };
}
  
export default HTTPTransport;
