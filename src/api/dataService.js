// const API_BASE_URL = `http://localhost:3000/api/v1`;
const API_BASE_URL = `http://192.168.0.159:3000/api/v1`;

export const fetchWrecks = async (regionOrOptions) => {
  try {
    let url = `${API_BASE_URL}/wrecks`;
    let region = null;

    if (regionOrOptions && typeof regionOrOptions === 'object') {
      if (regionOrOptions.latitude != null && regionOrOptions.longitude != null) {
        region = regionOrOptions;
      }
    }

    const queryParts = [];

    if (region && region.latitude != null && region.longitude != null) {
      queryParts.push(`lat=${encodeURIComponent(region.latitude)}`);
      queryParts.push(`lng=${encodeURIComponent(region.longitude)}`);
      if (region.zoom != null) {
        queryParts.push(`zoom=${encodeURIComponent(region.zoom)}`);
      }
    } else {
      // Default example coordinates (Solent / English Channel area)
      const defaultLat = 50.96;
      const defaultLng = -1.39;
      const defaultZoom = 10;
      queryParts.push(`lat=${defaultLat}`);
      queryParts.push(`lng=${defaultLng}`);
      queryParts.push(`zoom=${defaultZoom}`);
    }

    url += `?${queryParts.join('&')}`;

    const response = await fetch(url);
    const json = await response.json();

    return Array.isArray(json) ? json : [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const searchWrecks = async (searchParam) => {
  try {
    let url = `${API_BASE_URL}/wrecks/search`;
    let search = '';

    if (typeof searchParam === 'string') {
      search = searchParam;
    } else if (searchParam && typeof searchParam === 'object') {
      search = searchParam.search || searchParam.titlesearch || searchParam.query || searchParam.searchParam || '';
    }

    const queryParts = [];

    if (search && search.trim()) {
      const encoded = encodeURIComponent(search.trim());
      queryParts.push(`search=${encoded}`);
      queryParts.push(`titlesearch=${encoded}`);
      queryParts.push(`searchParam=${encoded}`);
    }

    if (queryParts.length > 0) {
      url += `?${queryParts.join('&')}`;
    }

    const response = await fetch(url);
    const json = await response.json();

    return Array.isArray(json) ? json : [];
  } catch (error) {
    console.error("Error searching wrecks:", error);
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

