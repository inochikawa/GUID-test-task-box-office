export class ApiService {
    private _baseUrl: string = "/api/v1/";
    private _baseHeader = {
        "Content-type": "application/json"
    }

    fetch(url: string, props?: RequestInit): Promise<Response> {
        return fetch(this.fullUrl(url), {
            headers: this._baseHeader,
            ...props
        });
    }

    secureFetch(url: string, token: string, props?: RequestInit): Promise<Response> {
        return fetch(this.fullUrl(url), {
            headers: {
                "Authorization": `Bearer ${token}`,
                ...this._baseHeader
            },
            ...props
        })
    }

    private fullUrl(url: string): string {
        return `${this._baseUrl}${url}`;
    }
}