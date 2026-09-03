// const API_BASE_URL = `http://localhost:3000/api/v1`;
const API_BASE_URL = `http://192.168.0.159:3000/api/v1`;


export const fetchWrecks = async (region) => {
  try {
    let url = `${API_BASE_URL}/wrecks`;
    if (region && region.latitude != null && region.longitude != null) {
      const query = `?lat=${region.latitude}&lng=${region.longitude}` +
        (region.latitudeDelta != null ? `&latDelta=${region.latitudeDelta}` : '') +
        (region.longitudeDelta != null ? `&lngDelta=${region.longitudeDelta}` : '');
      url += query;
    }
    const response = await fetch(url);
    const json = await response.json();

    return json;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};



