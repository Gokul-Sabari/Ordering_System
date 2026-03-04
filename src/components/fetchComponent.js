import api from "../../API";

export const fetchLink = async ({
    address,
    method = "GET",
    headers,
    bodyData = null,
    params = {}, 
    others = {},
    autoHeaders = false,
    loadingOn,
    loadingOff
}) => {

    const storage = JSON.parse(localStorage.getItem("user"));
    const token = storage?.Autheticate_Id;

    const isFormData = bodyData instanceof FormData;

    const defaultHeaders = {
        "Content-Type": "application/json",
        'Authorization': token,
    }

    const finalHeaders = autoHeaders
        ? defaultHeaders
        : { ...defaultHeaders, ...headers };

    // Construct URL with query parameters
    let url = api + address.replace(/\s+/g, '');
    
    // Add query parameters for GET requests
    if (method === "GET" && params && Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value);
            }
        });
        
        const queryString = queryParams.toString();
        if (queryString) {
            url += (url.includes('?') ? '&' : '?') + queryString;
        }
    }

    const options = {
        method,
        headers: finalHeaders,
        ...others
    };

    if (["POST", "PUT", "DELETE"].includes(method)) {
        if (!isFormData) {
            options.body = JSON.stringify(bodyData || {});
        } else {
            options.body = bodyData; 
        }
    }

    try {
        if (loadingOn) loadingOn();
        
        const response = await fetch(url, options);

        if (options.headers["Content-Type"] === "application/json") {
            const json = await response.json();
            return json;
        } else {
            return response;
        }
    } catch (e) {
        console.error('Fetch Error', e);
        throw e;
    } finally {
        if (loadingOff) loadingOff();
    }
};