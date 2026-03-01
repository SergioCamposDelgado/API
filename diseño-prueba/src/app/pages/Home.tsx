import { useState, useEffect } from "react";
import { WeatherCard } from "../components/WeatherCard";
import { ForecastCard, ForecastDay } from "../components/ForecastCard";
import { LocationSelector } from "../components/LocationSelector";
import { DayNightBackground } from "../components/DayNightBackground";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { City, cities } from "../data/cities";
import { getWeatherByCoordinates } from "../services/weatherAPI";

// Mock weather data for different cities
export const weatherDataByCity: Record<string, any> = {
  Madrid: {
    temperature: 24,
    condition: "soleado",
    humidity: 45,
    windSpeed: 12,
    visibility: 10,
    pressure: 1015,
    feelsLike: 26,
    forecast: [
      { day: "Lun", tempMax: 25, tempMin: 15, condition: "soleado", precipitation: 0 },
      { day: "Mar", tempMax: 23, tempMin: 14, condition: "parcialmente nublado", precipitation: 10 },
      { day: "Mié", tempMax: 21, tempMin: 13, condition: "nublado", precipitation: 20 },
      { day: "Jue", tempMax: 19, tempMin: 12, condition: "lluvia", precipitation: 70 },
      { day: "Vie", tempMax: 22, tempMin: 14, condition: "parcialmente nublado", precipitation: 30 },
      { day: "Sáb", tempMax: 26, tempMin: 16, condition: "soleado", precipitation: 0 },
      { day: "Dom", tempMax: 27, tempMin: 17, condition: "soleado", precipitation: 0 },
    ]
  },
  Barcelona: {
    temperature: 22,
    condition: "parcialmente nublado",
    humidity: 65,
    windSpeed: 18,
    visibility: 8,
    pressure: 1012,
    feelsLike: 24,
    forecast: [
      { day: "Lun", tempMax: 23, tempMin: 18, condition: "parcialmente nublado", precipitation: 15 },
      { day: "Mar", tempMax: 21, tempMin: 17, condition: "nublado", precipitation: 35 },
      { day: "Mié", tempMax: 20, tempMin: 16, condition: "lluvia", precipitation: 65 },
      { day: "Jue", tempMax: 22, tempMin: 17, condition: "llovizna", precipitation: 40 },
      { day: "Vie", tempMax: 24, tempMin: 18, condition: "parcialmente nublado", precipitation: 20 },
      { day: "Sáb", tempMax: 25, tempMin: 19, condition: "soleado", precipitation: 5 },
      { day: "Dom", tempMax: 26, tempMin: 20, condition: "soleado", precipitation: 0 },
    ]
  },
  Valencia: {
    temperature: 26,
    condition: "soleado",
    humidity: 55,
    windSpeed: 10,
    visibility: 12,
    pressure: 1018,
    feelsLike: 28,
    forecast: [
      { day: "Lun", tempMax: 27, tempMin: 19, condition: "soleado", precipitation: 0 },
      { day: "Mar", tempMax: 28, tempMin: 20, condition: "soleado", precipitation: 0 },
      { day: "Mié", tempMax: 26, tempMin: 19, condition: "parcialmente nublado", precipitation: 10 },
      { day: "Jue", tempMax: 24, tempMin: 18, condition: "nublado", precipitation: 25 },
      { day: "Vie", tempMax: 25, tempMin: 19, condition: "parcialmente nublado", precipitation: 15 },
      { day: "Sáb", tempMax: 27, tempMin: 20, condition: "soleado", precipitation: 0 },
      { day: "Dom", tempMax: 29, tempMin: 21, condition: "soleado", precipitation: 0 },
    ]
  },
  Sevilla: {
    temperature: 30,
    condition: "soleado",
    humidity: 35,
    windSpeed: 8,
    visibility: 15,
    pressure: 1020,
    feelsLike: 33,
    forecast: [
      { day: "Lun", tempMax: 31, tempMin: 18, condition: "soleado", precipitation: 0 },
      { day: "Mar", tempMax: 32, tempMin: 19, condition: "soleado", precipitation: 0 },
      { day: "Mié", tempMax: 33, tempMin: 20, condition: "soleado", precipitation: 0 },
      { day: "Jue", tempMax: 31, tempMin: 19, condition: "parcialmente nublado", precipitation: 5 },
      { day: "Vie", tempMax: 29, tempMin: 18, condition: "parcialmente nublado", precipitation: 10 },
      { day: "Sáb", tempMax: 30, tempMin: 19, condition: "soleado", precipitation: 0 },
      { day: "Dom", tempMax: 32, tempMin: 20, condition: "soleado", precipitation: 0 },
    ]
  },
  Bilbao: {
    temperature: 18,
    condition: "lluvia",
    humidity: 80,
    windSpeed: 22,
    visibility: 6,
    pressure: 1008,
    feelsLike: 16,
    forecast: [
      { day: "Lun", tempMax: 19, tempMin: 14, condition: "lluvia", precipitation: 75 },
      { day: "Mar", tempMax: 18, tempMin: 13, condition: "lluvia", precipitation: 80 },
      { day: "Mié", tempMax: 17, tempMin: 12, condition: "nublado", precipitation: 45 },
      { day: "Jue", tempMax: 19, tempMin: 13, condition: "llovizna", precipitation: 55 },
      { day: "Vie", tempMax: 20, tempMin: 14, condition: "parcialmente nublado", precipitation: 30 },
      { day: "Sáb", tempMax: 21, tempMin: 15, condition: "parcialmente nublado", precipitation: 20 },
      { day: "Dom", tempMax: 22, tempMin: 16, condition: "soleado", precipitation: 10 },
    ]
  },
  Málaga: {
    temperature: 28,
    condition: "soleado",
    humidity: 50,
    windSpeed: 14,
    visibility: 14,
    pressure: 1016,
    feelsLike: 30,
    forecast: [
      { day: "Lun", tempMax: 29, tempMin: 21, condition: "soleado", precipitation: 0 },
      { day: "Mar", tempMax: 30, tempMin: 22, condition: "soleado", precipitation: 0 },
      { day: "Mié", tempMax: 28, tempMin: 21, condition: "parcialmente nublado", precipitation: 5 },
      { day: "Jue", tempMax: 27, tempMin: 20, condition: "parcialmente nublado", precipitation: 10 },
      { day: "Vie", tempMax: 29, tempMin: 21, condition: "soleado", precipitation: 0 },
      { day: "Sáb", tempMax: 31, tempMin: 23, condition: "soleado", precipitation: 0 },
      { day: "Dom", tempMax: 32, tempMin: 24, condition: "soleado", precipitation: 0 },
    ]
  },
  Zaragoza: {
    temperature: 23,
    condition: "parcialmente nublado",
    humidity: 42,
    windSpeed: 20,
    visibility: 11,
    pressure: 1014,
    feelsLike: 25,
    forecast: [
      { day: "Lun", tempMax: 24, tempMin: 14, condition: "parcialmente nublado", precipitation: 10 },
      { day: "Mar", tempMax: 25, tempMin: 15, condition: "soleado", precipitation: 0 },
      { day: "Mié", tempMax: 26, tempMin: 16, condition: "soleado", precipitation: 0 },
      { day: "Jue", tempMax: 23, tempMin: 14, condition: "nublado", precipitation: 25 },
      { day: "Vie", tempMax: 21, tempMin: 13, condition: "lluvia", precipitation: 60 },
      { day: "Sáb", tempMax: 22, tempMin: 14, condition: "parcialmente nublado", precipitation: 20 },
      { day: "Dom", tempMax: 24, tempMin: 15, condition: "soleado", precipitation: 5 },
    ]
  },
  Murcia: {
    temperature: 27,
    condition: "soleado",
    humidity: 40,
    windSpeed: 9,
    visibility: 13,
    pressure: 1017,
    feelsLike: 29,
    forecast: [
      { day: "Lun", tempMax: 28, tempMin: 18, condition: "soleado", precipitation: 0 },
      { day: "Mar", tempMax: 29, tempMin: 19, condition: "soleado", precipitation: 0 },
      { day: "Mié", tempMax: 27, tempMin: 18, condition: "parcialmente nublado", precipitation: 5 },
      { day: "Jue", tempMax: 26, tempMin: 17, condition: "parcialmente nublado", precipitation: 15 },
      { day: "Vie", tempMax: 28, tempMin: 19, condition: "soleado", precipitation: 0 },
      { day: "Sáb", tempMax: 30, tempMin: 20, condition: "soleado", precipitation: 0 },
      { day: "Dom", tempMax: 31, tempMin: 21, condition: "soleado", precipitation: 0 },
    ]
  },
};

function Home() {
  const [currentLocation, setCurrentLocation] = useState<City>(cities[0]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(weatherDataByCity["Madrid"]);

  // Fetch weather when location changes
  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      try {
        const data = await getWeatherByCoordinates(currentLocation.latitud, currentLocation.longitud);
        console.log("Weather data:", data);
        // TODO: Update currentWeather with real data from API
        // For now, use mock data
        setCurrentWeather(weatherDataByCity[currentLocation.nombre]);
      } catch (error) {
        console.error("Error fetching weather:", error);
        // Fallback to mock data
        setCurrentWeather(weatherDataByCity[currentLocation.nombre]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [currentLocation]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = 1000;
      const progress = Math.min(scrollPosition / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate colors based on scroll progress
  const headerTextColor = scrollProgress < 0.5 ? '#1a202c' : '#ffffff';
  const scrollIndicatorOpacity = Math.max(0, 1 - scrollProgress * 5);
  const footerBorderColor = scrollProgress > 0.5 ? '#4a5568' : '#e2e8f0';
  const footerTextColor = scrollProgress > 0.5 ? '#a0aec0' : '#4a5568';
  const sectionTitleColor = scrollProgress > 0.5 ? '#ffffff' : '#2d3748';

  return (
    <div className="min-h-screen relative">
      <DayNightBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-6 py-8 flex items-center justify-between max-w-6xl"
        >
          <h1
            className="text-2xl sm:text-3xl tracking-wide"
            style={{ color: headerTextColor }}
          >
            Clima
          </h1>
          
          <LocationSelector
            currentLocation={currentLocation}
            onLocationChange={setCurrentLocation}
            scrollProgress={scrollProgress}
          />
        </motion.header>

        {/* Main weather section */}
        <section className="container mx-auto px-6 py-12 sm:py-20 min-h-[70vh] flex items-center">
          <WeatherCard
            weather={{
              ...currentWeather,
              location: currentLocation.nombre,
            }}
            scrollProgress={scrollProgress}
          />
        </section>

        {/* Scroll indicator */}
        <div
          style={{ opacity: scrollIndicatorOpacity }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <p 
            className="text-sm opacity-60"
            style={{ color: headerTextColor }}
          >
            Desliza para ver más
          </p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ color: headerTextColor }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-32" />

        {/* Forecast section */}
        <section className="container mx-auto px-6 py-16 max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-2xl sm:text-3xl mb-12 text-center"
              style={{ color: sectionTitleColor }}
            >
              Próximos 7 días
            </h2>
            
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide justify-center">
              {currentWeather.forecast.map((day: ForecastDay, index: number) => (
                <ForecastCard 
                  key={day.day} 
                  forecast={day} 
                  index={index} 
                  scrollProgress={scrollProgress}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Extra spacing for night effect */}
        <div className="h-32" />

        {/* API Info for Spring Boot integration */}
        <motion.section 
          className="container mx-auto px-6 py-16 max-w-4xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div 
            className="border-t pt-12 text-center"
            style={{ 
              borderColor: footerBorderColor,
              color: footerTextColor
            }}
          >
            <p className="text-sm opacity-60">
              Datos simulados • Listo para conectar con Spring Boot API
            </p>
          </div>
        </motion.section>

        <div className="h-20" />
      </div>
    </div>
  );
}

export default Home;
