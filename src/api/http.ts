import axios, { AxiosRequestConfig, Method } from 'axios';
import { getToken } from '@/utils/auth';

class Http {
    private static getBaseUrl(): string {
        const base = import.meta.env.VITE_API_BASE_URL || '';
        return typeof base === 'string' ? base : '';
    }

    private static buildUrl(endpoint: string): string {
        if (/^https?:\/\//i.test(endpoint)) return endpoint;
        const base = Http.getBaseUrl();
        if (!base) return endpoint;
        const slash = base.endsWith('/') || endpoint.startsWith('/') ? '' : '/';
        return `${base}${slash}${endpoint}`;
    }

    private static buildHeaders(extraHeaders?: Record<string, any>) {
        const token = getToken();
        const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
        return { ...authHeader, ...(extraHeaders || {}) } as Record<string, any>;
    }

    private static request<T = unknown>(
        method: Method,
        endpoint: string,
        {
            params,
            data,
            headers,
            config,
        }: {
            params?: Record<string, any>;
            data?: Record<string, any>;
            headers?: Record<string, any>;
            config?: AxiosRequestConfig;
        } = {}
    ): Promise<T> {
        const url = Http.buildUrl(endpoint);
        const finalHeaders = Http.buildHeaders(headers);
        return axios.request<T>({
            url,
            method,
            params,
            data,
            headers: finalHeaders,
            ...(config || {}),
        }) as unknown as Promise<T>;
    }

    static get<T = unknown>(endpoint: string, params: Record<string, any> = {}, headers: Record<string, any> = {}): Promise<T> {
        return Http.request<T>('GET', endpoint, { params, headers });
    }

    static post<T = unknown>(endpoint: string, body: Record<string, any> = {}, headers: Record<string, any> = {}): Promise<T> {
        return Http.request<T>('POST', endpoint, { data: body, headers });
    }

    static put<T = unknown>(endpoint: string, body: Record<string, any> = {}, headers: Record<string, any> = {}): Promise<T> {
        return Http.request<T>('PUT', endpoint, { data: body, headers });
    }

    static patch<T = unknown>(endpoint: string, body: Record<string, any> = {}, headers: Record<string, any> = {}): Promise<T> {
        return Http.request<T>('PATCH', endpoint, { data: body, headers });
    }

    static delete<T = unknown>(endpoint: string, params: Record<string, any> = {}, headers: Record<string, any> = {}): Promise<T> {
        // Some APIs expect query params on DELETE; adapt here.
        return Http.request<T>('DELETE', endpoint, { params, headers });
    }
}

export default Http;
