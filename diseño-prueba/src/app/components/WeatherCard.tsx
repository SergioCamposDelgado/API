import { Cloud } from "lucide-react";
import { motion } from "motion/react";

interface WeatherData {
  temperature: number;
  condition: string;
  is_day: number;
  time: string;
  location: string;
}

interface WeatherCardProps {
  weather: WeatherData;
  scrollProgress: number;
}

export function WeatherCard({ weather, scrollProgress }: WeatherCardProps) {
  // Calculate color based on scroll progress (0 to 1)
  const textColor = scrollProgress < 0.5 
    ? `rgb(${26 + scrollProgress * 460}, ${32 + scrollProgress * 456}, ${44 + scrollProgress * 468})`
    : '#ffffff';
  
  const secondaryColor = scrollProgress < 0.5
    ? `rgba(45, 55, 72, ${0.7 + scrollProgress * 0.3})`
    : 'rgba(226, 232, 240, 0.7)';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main temperature display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <p 
          className="text-lg mb-4 opacity-70"
          style={{ color: textColor }}
        >
          {weather.location}
        </p>
        
        <motion.div 
          className="flex items-start justify-center mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <span 
            className="text-[120px] sm:text-[160px] font-extralight leading-none"
            style={{ color: textColor }}
          >
            {weather.temperature}
          </span>
          <span 
            className="text-6xl sm:text-7xl mt-4 opacity-50"
            style={{ color: textColor }}
          >
            °C
          </span>
        </motion.div>
        
        <p 
          className="text-2xl sm:text-3xl capitalize mb-2"
          style={{ color: secondaryColor }}
        >
          {weather.condition}
        </p>
        
        <p 
          className="opacity-60"
          style={{ color: secondaryColor }}
        >
          {weather.time}
        </p>
      </motion.div>
    </div>
  );
}
