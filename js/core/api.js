const BASE_URL = 'https://lo2ma-script.ahmedmagdy.cloud';
export async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            headers: {
                'Content-Type': 'application/json', ...options.headers
            }, ...options
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Fetch Request Failed:", error);
        throw error;
    }
}