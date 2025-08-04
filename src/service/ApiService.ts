interface ApiRequestConfig {
    url: string;
    method?: string;
    body?: any;
    headers?: Record<string, string>;
}

export const ApiService = async <T>({ url, method, body, headers = {} }: ApiRequestConfig): Promise<T> => {
    try {
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...headers,
        };

        const response = await fetch(url, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            throw new Error(`Lỗi khi gọi API: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        throw new Error(`Không thể thực hiện yêu cầu API: ${(err as Error).message}`);
    }
};