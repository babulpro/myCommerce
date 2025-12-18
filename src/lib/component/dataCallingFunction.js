const getData = async(url) => {
        try {
            
            
            // Fix the URL - use http instead of https for localhost
            let res = await fetch(url, { 
                method: "GET",
                cache: 'no-store' 
            });
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            return data;
        }
        catch(e) {
            console.error("Error fetching data:", e);
            return [];
        }
    } 
export default getData