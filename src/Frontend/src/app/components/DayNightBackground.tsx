import { motion, useScroll, useTransform } from "motion/react";
import { Sun, Moon } from "lucide-react";

export function DayNightBackground() {
  const { scrollY } = useScroll();
  
  // Transform scroll position to color values
  // Day colors: light blue/white -> Night colors: dark blue/purple
  const backgroundColor = useTransform(
    scrollY,
    [0, 500, 1000],
    ["#87CEEB", "#4A5568", "#1A202C"]
  );
  
  const starOpacity = useTransform(scrollY, [0, 800], [0, 1]);
  const sunOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const moonOpacity = useTransform(scrollY, [500, 1000], [0, 1]);

  return (
    <>
      <motion.div 
        style={{ backgroundColor }}
        className="fixed inset-0 -z-10 transition-colors duration-1000"
      />
      
      {/* Sun */}
      <motion.div
        style={{ opacity: sunOpacity }}
        className="fixed top-20 right-20 -z-10"
      >
        <Sun className="w-24 h-24 text-yellow-300" />
      </motion.div>
      
      {/* Moon */}
      <motion.div
        style={{ opacity: moonOpacity }}
        className="fixed top-20 right-20 -z-10"
      >
        <Moon className="w-24 h-24 text-gray-100" />
      </motion.div>
      
      {/* Stars */}
      <motion.div style={{ opacity: starOpacity }} className="fixed inset-0 -z-10">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
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
      </motion.div>
    </>
  );
}
