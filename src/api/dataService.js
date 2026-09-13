// const API_BASE_URL = `http://localhost:3000/api/v1`;
const API_BASE_URL = `http://192.168.0.159:3000/api/v1`;

export const fetchWrecks = async (region) => {
  try {
    let url = `${API_BASE_URL}/wrecks`;
    if (region && region.latitude != null && region.longitude != null) {
      const query = `?lat=${region.latitude}&lng=${region.longitude}` +
        (region.zoom != null ? `&zoom=${region.zoom}` : '');
      url += query;
    } else {
      // Default example coordinates (Solent / English Channel area)
      const defaultLat = 50.96;
      const defaultLng = -1.39;
      const defaultZoom = 10;
      url += `?lat=${defaultLat}&lng=${defaultLng}&zoom=${defaultZoom}`;
    }
    const response = await fetch(url);
    const json = await response.json();

    return json;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const fetchWreck = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wrecks/${id}`);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(`Error fetching wreck with id ${id}:`, error);
    return null;
  }
};

