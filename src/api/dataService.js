// const API_BASE_URL = `http://localhost:3000/api/v1`;
const API_BASE_URL = `http://192.168.0.159:3000/api/v1`;


export const fetchWrecks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/wrecks`);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};



