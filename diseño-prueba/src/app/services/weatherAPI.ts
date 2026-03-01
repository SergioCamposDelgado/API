const API_BASE_URL = "http://localhost:9091/api/clima";


export interface ApiWeatherResponse {
  latitude: number;
  longitude: number;
  current_weather: {
    is_day: number;
    time: string;
    temperature: number;
    weathercode: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  temperature: number;
  condition: string;
  is_day: number;
  time: string;
  forecast: Array<{
    day: string;
    tempMax: number;
    tempMin: number;
  }>;
}

export interface City {
  id?: number;
  nombre: string;
  latitud: number;
  longitud: number;
}

export const getWeatherByCoordinates = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/hoy?lat=${latitude}&lon=${longitude}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const apiData: ApiWeatherResponse = await response.json();
    return transformApiWeatherData(apiData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

const transformApiWeatherData = (apiData: ApiWeatherResponse): WeatherData => {
  const weathercodeToCondition: Record<number, string> = {
    0: "soleado",
    1: "soleado",
    2: "parcialmente nublado",
    3: "nublado",
    45: "nublado",
    48: "nublado",
    51: "llovizna",
    53: "llovizna",
    55: "llovizna",
    61: "lluvia",
    63: "lluvia",
    65: "lluvia",
    71: "nieve",
    73: "nieve",
    75: "nieve",
    77: "nieve",
    80: "lluvia",
    81: "lluvia",
    82: "lluvia",
    85: "nieve",
    86: "nieve",
    95: "tormenta",
    96: "tormenta",
    99: "tormenta",
  };

  const condition = weathercodeToCondition[apiData.current_weather.weathercode] || "parcialmente nublado";
  
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return {
    latitude: apiData.latitude,
    longitude: apiData.longitude,
    temperature: apiData.current_weather.temperature,
    condition: condition,
    is_day: apiData.current_weather.is_day,
    time: apiData.current_weather.time,
    forecast: apiData.daily.temperature_2m_max.map((tempMax, index) => ({
      day: days[index] || "Día",
      tempMax: tempMax,
      tempMin: apiData.daily.temperature_2m_min[index] || 0,
    })),
  };
};

export const getCities = async (): Promise<City[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ciudades`);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};
