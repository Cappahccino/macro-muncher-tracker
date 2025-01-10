import { motion, AnimatePresence } from "framer-motion";
import { NavigationMenu } from "./NavigationMenu";
import { MenuItem } from "./types";

interface MobileMenuProps {
  isOpen: boolean;
  items: MenuItem[];
  onItemClick: () => void;
}

export const MobileMenu = ({ isOpen, items, onItemClick }: MobileMenuProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="md:hidden border-t bg-background/95 backdrop-blur-sm"
      >
        <NavigationMenu
          items={items}
          onItemClick={onItemClick}
          className="container max-w-4xl mx-auto p-4 flex flex-col space-y-2"
        />
      </motion.div>
    )}
  </AnimatePresence>
);