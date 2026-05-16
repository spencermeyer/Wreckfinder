const API_BASE_URL = `http://localhost:3000/api/v1`;

export const fetchWrecks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/wrecks`);
    const json = await response.json();
    console.log('did it get data?');
    console.log(json);
    return json;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};



