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

    let storage = null;
    try {
        storage = JSON.parse(localStorage.getItem("user") || "{}");
    } catch (e) {
        storage = null;
    }
    const token = storage?.Autheticate_Id;

    const isFormData = bodyData instanceof FormData;

    const defaultHeaders = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        'Authorization': token,
    }

    const finalHeaders = autoHeaders
        ? defaultHeaders
        : { ...defaultHeaders, ...headers };

    if (isFormData && finalHeaders["Content-Type"]) {
        delete finalHeaders["Content-Type"];
    }

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

        const contentType = response.headers?.get?.("content-type") || "";
        if (contentType.includes("application/json") || isFormData || finalHeaders["Content-Type"] === "application/json") {
            try {
                const json = await response.json();
                return json;
            } catch (err) {
                return response;
            }
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