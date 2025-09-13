import axios from "axios"

const API_KEY = import.meta.env.VITE_HUNTER_API_KEY;
const BASE_URL = "https://api.hunter.io/v2";

class HunterApi {

    static discover = async (organizationName) => {
        try {
            const response = await axios.post(`${BASE_URL}/discover?api_key=${API_KEY}`, {
                organization: {
                    name: [organizationName]
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error in discover API:", error);
            throw error;
        }
    }

    static emailFinder = async (domain, firstName, lastName) => {
        try {
            const response = await axios.get(`${BASE_URL}/email-finder`, {
                params: {
                    api_key: API_KEY,
                    domain: domain,
                    first_name: firstName,
                    last_name: lastName
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error in email-finder API:", error);
            throw error;
        }
    }

    static combinedFind = async (email) => {
        try {
            const response = await axios.get(`${BASE_URL}/combined/find`, {
                params: {
                    api_key: API_KEY,
                    email: email
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error in combined/find API:", error);
            throw error;
        }
    }
}

export default HunterApi;