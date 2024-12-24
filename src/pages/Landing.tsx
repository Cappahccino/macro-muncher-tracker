import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4 relative overflow-hidden">
      {/* Animated background circles */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-primary/5 -top-48 -right-48"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-secondary/5 -bottom-48 -left-48"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Main content */}
      <motion.div
        className="text-center space-y-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 200,
          }}
        >
          Welcome to Macro Muncher
        </motion.h1>

        <motion.p
          className="text-lg text-muted-foreground max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Your personal nutrition tracker for achieving your fitness goals
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button
            size="lg"
            onClick={() => navigate("/onboarding")}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
          >
            Get Started
          </Button>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm">
            <h3 className="font-semibold text-lg mb-2">Track Macros</h3>
            <p className="text-sm text-muted-foreground">Monitor your daily nutrition intake with precision</p>
          </div>
          <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm">
            <h3 className="font-semibold text-lg mb-2">Custom Meals</h3>
            <p className="text-sm text-muted-foreground">Create and save your favorite meal combinations</p>
          </div>
          <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm">
            <h3 className="font-semibold text-lg mb-2">Progress Tracking</h3>
            <p className="text-sm text-muted-foreground">Visualize your journey towards your fitness goals</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;