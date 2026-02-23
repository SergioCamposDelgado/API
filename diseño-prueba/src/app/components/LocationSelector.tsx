import { MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface LocationSelectorProps {
  currentLocation: string;
  onLocationChange: (location: string) => void;
  scrollProgress: number;
}

const popularLocations = [
  "Madrid",
  "Barcelona",
  "Valencia",
  "Sevilla",
  "Bilbao",
  "Málaga",
  "Zaragoza",
  "Murcia"
];

export function LocationSelector({ currentLocation, onLocationChange, scrollProgress }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate colors based on scroll progress
  const borderColor = scrollProgress < 0.5 ? '#1a202c' : '#ffffff';
  const textColor = scrollProgress < 0.5 ? '#1a202c' : '#ffffff';
  const dropdownBg = scrollProgress < 0.5 ? '#ffffff' : '#2d3748';
  const dropdownBorder = scrollProgress < 0.5 ? '#e2e8f0' : '#4a5568';
  const dropdownText = scrollProgress < 0.5 ? '#1a202c' : '#ffffff';
  const dropdownItemBg = scrollProgress < 0.5 ? '#f7fafc' : '#4a5568';

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-6 py-3 border-b-2 transition-all"
        style={{
          borderColor: borderColor,
          color: textColor
        }}
      >
        <MapPin className="w-5 h-5" />
        <span className="text-lg">{currentLocation}</span>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full mt-2 right-0 min-w-[180px] z-20 overflow-hidden shadow-lg"
          style={{
            backgroundColor: dropdownBg,
          }}
        >
          {popularLocations.map((location, index) => (
            <motion.button
              key={location}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                onLocationChange(location);
                setIsOpen(false);
              }}
              className={`w-full text-left px-6 py-3 transition-all border-b last:border-b-0 ${
                currentLocation === location ? "opacity-100" : "opacity-70"
              }`}
              style={{
                borderColor: dropdownBorder,
                color: dropdownText,
                backgroundColor: currentLocation === location 
                  ? dropdownItemBg 
                  : "transparent"
              }}
            >
              {location}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
