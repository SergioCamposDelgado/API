import { Cloud, CloudRain, Sun, CloudSnow, CloudDrizzle } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

export interface ForecastDay {
  day: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  precipitation: number;
}

interface ForecastCardProps {
  forecast: ForecastDay;
  index: number;
  scrollProgress: number;
}

export function ForecastCard({ forecast, index, scrollProgress }: ForecastCardProps) {
  const navigate = useNavigate();
  
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    const iconClass = "w-10 h-10";
    
    if (lowerCondition.includes("sol") || lowerCondition.includes("despejado")) {
      return <Sun className={iconClass} />;
    } else if (lowerCondition.includes("lluvia")) {
      return <CloudRain className={iconClass} />;
    } else if (lowerCondition.includes("nieve")) {
      return <CloudSnow className={iconClass} />;
    } else if (lowerCondition.includes("llovizna")) {
      return <CloudDrizzle className={iconClass} />;
    }
    return <Cloud className={iconClass} />;
  };

  // Calculate colors based on scroll progress
  const primaryColor = scrollProgress > 0.5 ? '#ffffff' : '#1a202c';
  const secondaryColor = scrollProgress > 0.5 ? 'rgba(226, 232, 240, 0.7)' : 'rgba(74, 85, 104, 0.7)';
  const iconColor = scrollProgress > 0.5 ? 'rgba(226, 232, 240, 0.8)' : 'rgba(45, 55, 72, 0.8)';

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.05 }}
      onClick={() => navigate(`/forecast/${forecast.day}`)}
      className="flex-shrink-0 w-32 sm:w-36 text-center py-6 px-4 cursor-pointer"
    >
      <p 
        className="text-sm mb-4 opacity-70"
        style={{ color: secondaryColor }}
      >
        {forecast.day}
      </p>
      
      <div 
        className="flex justify-center mb-4 opacity-80"
        style={{ color: iconColor }}
      >
        {getWeatherIcon(forecast.condition)}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-3">
          <span 
            className="text-2xl"
            style={{ color: primaryColor }}
          >
            {forecast.tempMax}°
          </span>
          <span 
            className="text-lg opacity-50"
            style={{ color: secondaryColor }}
          >
            {forecast.tempMin}°
          </span>
        </div>
        
        {forecast.precipitation > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center gap-1 text-xs opacity-60"
            style={{ color: scrollProgress > 0.5 ? '#63b3ed' : '#4299e1' }}
          >
            <CloudDrizzle className="w-3 h-3" />
            <span>{forecast.precipitation}%</span>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}