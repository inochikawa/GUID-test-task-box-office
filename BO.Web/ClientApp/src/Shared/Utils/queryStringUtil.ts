export const objectToQueryString = (obj: any): string => 
Object.keys(obj).map(key => key + '=' + (obj[key] || "")).join('&');