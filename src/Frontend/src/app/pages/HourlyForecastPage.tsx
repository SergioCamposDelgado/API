import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Sun, Moon, Sunrise, Sunset } from "lucide-react";
import { Cloud, CloudRain, CloudSnow } from "lucide-react";

interface HourData {
  hour: string;
  temperature: number;
  condition: string;
  precipitation: number;
  windSpeed: number;
}

// Generate mock hourly data
const generateHourlyData = (): HourData[] => {
  const hours: HourData[] = [];
  const conditions = ["soleado", "parcialmente nublado", "nublado", "lluvia"];
  
  for (let i = 6; i <= 23; i++) {
    const hour = i < 10 ? `0${i}:00` : `${i}:00`;
    // Temperature curve: cooler in morning/evening, warmer at midday
    const tempVariation = Math.sin(((i - 6) / 18) * Math.PI) * 8;
    const baseTemp = 18;
    const temperature = Math.round(baseTemp + tempVariation);
    
    // More sun during midday
    const conditionIndex = i >= 11 && i <= 16 ? 0 : Math.floor(Math.random() * 2);
    
    hours.push({
      hour,
      temperature,
      condition: conditions[conditionIndex],
      precipitation: Math.floor(Math.random() * 30),
      windSpeed: Math.floor(Math.random() * 15) + 5,
    });
  }
  
  return hours;
};

function HourlyForecastPage() {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hourlyData] = useState(generateHourlyData());

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
        setScrollProgress(progress);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Calculate sky color based on scroll (time of day)
  // 0 = morning (6am), 0.5 = noon, 1 = night (11pm)
  const getSkyColor = () => {
    if (scrollProgress < 0.25) {
      // Dawn: purple/pink to light blue
      const t = scrollProgress / 0.25;
      return `rgb(${135 + t * 100}, ${150 + t * 56}, ${206 - t * 0})`;
    } else if (scrollProgress < 0.5) {
      // Morning to noon: light blue
      return '#87CEEB';
    } else if (scrollProgress < 0.75) {
      // Afternoon to evening: blue to orange/pink
      const t = (scrollProgress - 0.5) / 0.25;
      return `rgb(${135 + t * 120}, ${206 - t * 100}, ${235 - t * 130})`;
    } else {
      // Night: orange to dark blue/purple
      const t = (scrollProgress - 0.75) / 0.25;
      return `rgb(${255 - t * 229}, ${106 - t * 56}, ${105 - t * 61})`;
    }
  };

  const getSunMoonPosition = () => {
    // Sun/Moon follows an arc across the sky
    const x = scrollProgress * 90 + 5; // 5% to 95%
    // Arc: highest at midday (scrollProgress = 0.5)
    const y = 10 + Math.sin(scrollProgress * Math.PI) * -40; // Negative to go up
    return { x: `${x}%`, y: `${Math.max(10, 10 - y)}%` };
  };

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    const iconClass = "w-8 h-8";
    
    if (lowerCondition.includes("sol")) {
      return <Sun className={iconClass} />;
    } else if (lowerCondition.includes("lluvia")) {
      return <CloudRain className={iconClass} />;
    } else if (lowerCondition.includes("nieve")) {
      return <CloudSnow className={iconClass} />;
    }
    return <Cloud className={iconClass} />;
  };

  const textColor = scrollProgress > 0.7 ? '#ffffff' : '#1a202c';
  const position = getSunMoonPosition();
  const isSunVisible = scrollProgress < 0.75;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: getSkyColor(), transition: 'background-color 0.5s ease' }}
    >
      {/* Sun/Moon */}
      <motion.div
        className="fixed transition-all duration-500 z-0"
        style={{ left: position.x, top: position.y }}
        animate={{
          rotate: scrollProgress * 360,
        }}
      >
        {isSunVisible ? (
          <Sun className="w-20 h-20 text-yellow-300 drop-shadow-lg" />
        ) : (
          <Moon className="w-20 h-20 text-gray-100 drop-shadow-lg" />
        )}
      </motion.div>

      {/* Stars (visible at night) */}
      {scrollProgress > 0.7 && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-6 py-8 flex items-center justify-between max-w-6xl"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-full transition-all hover:bg-black/10"
              style={{ color: textColor }}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1
                className="text-3xl font-light mb-1"
                style={{ color: textColor }}
              >
                {day}
              </h1>
              <p
                className="text-sm opacity-70"
                style={{ color: textColor }}
              >
                Pronóstico por hora
              </p>
            </div>
          </div>

          {/* Time indicator icons */}
          <div className="hidden sm:flex items-center gap-6">
            <div className="flex items-center gap-2" style={{ color: textColor }}>
              <Sunrise className="w-5 h-5" />
              <span className="text-sm opacity-70">6:00</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: textColor }}>
              <Sun className="w-5 h-5" />
              <span className="text-sm opacity-70">14:00</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: textColor }}>
              <Sunset className="w-5 h-5" />
              <span className="text-sm opacity-70">23:00</span>
            </div>
          </div>
        </motion.div>

        {/* Scroll hint at top */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="container mx-auto px-6 pb-4 max-w-6xl"
        >
          <p
            className="text-sm opacity-60 text-center"
            style={{ color: textColor }}
          >
            Desliza horizontalmente para ver el ciclo completo del día →
          </p>
        </motion.div>

        {/* Hourly forecast scroll */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden px-6 py-8 min-h-[70vh] flex items-center"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: `${textColor}40 transparent`,
          }}
        >
          <div className="flex gap-4 min-w-max">
            {hourlyData.map((hour, index) => (
              <motion.div
                key={hour.hour}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex-shrink-0 w-40 p-6 rounded-2xl backdrop-blur-sm shadow-lg"
                style={{
                  backgroundColor: `${textColor}10`,
                  borderLeft: `3px solid ${textColor}20`,
                }}
              >
                <p
                  className="text-xl font-medium mb-4"
                  style={{ color: textColor }}
                >
                  {hour.hour}
                </p>

                <div
                  className="flex justify-center mb-4 opacity-80"
                  style={{ color: textColor }}
                >
                  {getWeatherIcon(hour.condition)}
                </div>

                <p
                  className="text-4xl font-light mb-3 text-center"
                  style={{ color: textColor }}
                >
                  {hour.temperature}°
                </p>

                <p
                  className="text-xs mb-4 text-center capitalize opacity-70"
                  style={{ color: textColor }}
                >
                  {hour.condition}
                </p>

                <div className="space-y-2 pt-4 border-t" style={{ borderColor: `${textColor}20` }}>
                  <div
                    className="flex items-center justify-between text-sm opacity-70"
                    style={{ color: textColor }}
                  >
                    <span>💧 Precipitación</span>
                    <span className="font-medium">{hour.precipitation}%</span>
                  </div>
                  <div
                    className="flex items-center justify-between text-sm opacity-70"
                    style={{ color: textColor }}
                  >
                    <span>💨 Viento</span>
                    <span className="font-medium">{hour.windSpeed} km/h</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll hint at bottom */}
        <motion.div
          className="container mx-auto px-6 py-8 max-w-6xl text-center"
          animate={{
            x: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          style={{ 
            color: textColor, 
            opacity: scrollProgress < 0.9 ? 0.5 : 0,
            transition: 'opacity 0.3s'
          }}
        >
          <span className="text-sm">Continúa deslizando para ver el atardecer →</span>
        </motion.div>
      </div>
    </div>
  );
}

export default HourlyForecastPage;
