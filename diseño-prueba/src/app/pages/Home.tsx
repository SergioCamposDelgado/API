import { useState, useEffect } from "react";
import { WeatherCard } from "../components/WeatherCard";
import { ForecastCard, ForecastDay } from "../components/ForecastCard";
import { LocationSelector } from "../components/LocationSelector";
import { DayNightBackground } from "../components/DayNightBackground";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { getWeatherByCoordinates, getCities, type City, type WeatherData } from "../services/weatherAPI";

function Home() {
  const [cities, setCities] = useState<City[]>([]);
  const [currentLocation, setCurrentLocation] = useState<City | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const citiesData = await getCities();
        setCities(citiesData);

        if (citiesData.length > 0) {
          setCurrentLocation(citiesData[0]);
        }
      } catch (error) {
        console.error("Error loading cities:", error);
      }
    };

    loadCities();
  }, []);


  useEffect(() => {
    if (!currentLocation) return;

    const fetchWeather = async () => {
      setIsLoading(true);
      try {
        const data = await getWeatherByCoordinates(currentLocation.latitud, currentLocation.longitud);
        console.log("Weather data:", data);
        // Usar los datos reales del API
        setCurrentWeather(data);
      } catch (error) {
        console.error("Error fetching weather:", error);
        setCurrentWeather(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [currentLocation]);

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
            cities={cities}
          />
        </motion.header>

        {/* Main weather section */}
        <section className="container mx-auto px-6 py-12 sm:py-20 min-h-[70vh] flex items-center">
          {currentLocation && currentWeather ? (
            <WeatherCard
              weather={{
                ...currentWeather,
                location: currentLocation.nombre,
              }}
              scrollProgress={scrollProgress}
            />
          ) : isLoading ? (
            <div style={{ color: headerTextColor }} className="text-center w-full">
              Cargando clima...
            </div>
          ) : currentLocation ? (
            <div style={{ color: headerTextColor }} className="text-center w-full">
              Error al cargar los datos del clima
            </div>
          ) : (
            <div style={{ color: headerTextColor }} className="text-center w-full">
              Cargando ciudades...
            </div>
          )}
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
          {currentWeather && (
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
                {currentWeather.forecast.map((day, index: number) => (
                  <ForecastCard 
                    key={day.day} 
                    forecast={day} 
                    index={index} 
                    scrollProgress={scrollProgress}
                  />
                ))}
              </div>
            </motion.div>
          )}
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
