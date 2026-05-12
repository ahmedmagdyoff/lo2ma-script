const BASE_URL = 'data';
export async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, options);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Fetch Request Failed:", error);
        throw error;
    }
}