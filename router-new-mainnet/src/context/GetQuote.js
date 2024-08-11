
const PATH_FINDER_API_URL = "https://api-beta.pathfinder.routerprotocol.com/api/v2";

const getQuote = async (params) => {
    const endpoint = "quote"; // Adjusted to avoid double 'v2' in the URL
    const quoteUrl = `${PATH_FINDER_API_URL}/${endpoint}`;

    try {
        const url = new URL(quoteUrl);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        console.log(url)
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', 
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Fetching quote data from pathfinder: ${error.message}`);
        return null;
    }
};

export default getQuote;
