const BASE_URL = 'https://lo2ma-script.ahmedmagdy.cloud/backend/api';
export async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json', ...options.headers
            }
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Fetch Request Failed:", error);
        throw error;
    }
}