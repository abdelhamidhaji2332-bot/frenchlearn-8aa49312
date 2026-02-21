import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-10 sm:py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <motion.div
              className="flex items-center gap-3 mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-2xl font-display font-bold text-secondary-foreground">F</span>
              </div>
              <span className="text-2xl font-display font-semibold">Français</span>
            </motion.div>
            <p className="text-primary-foreground/70 text-sm">
              Master French from A1 to C2 with interactive lessons, AI-powered tools, and a supportive community.
            </p>
          </div>

          {/* Learning */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Apprendre</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/levels" className="hover:text-secondary transition-colors">All Levels</Link></li>
              <li><Link to="/grammar" className="hover:text-secondary transition-colors">Grammar</Link></li>
              <li><Link to="/vocabulary" className="hover:text-secondary transition-colors">Vocabulary</Link></li>
              <li><Link to="/speaking" className="hover:text-secondary transition-colors">Speaking</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Ressources</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/dictionary" className="hover:text-secondary transition-colors">Dictionary</Link></li>
              <li><Link to="/conjugator" className="hover:text-secondary transition-colors">Verb Conjugator</Link></li>
              <li><Link to="/media" className="hover:text-secondary transition-colors">Videos & Songs</Link></li>
              <li><Link to="/stories" className="hover:text-secondary transition-colors">Short Stories</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Mon Compte</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/login" className="hover:text-secondary transition-colors">Login</Link></li>
              <li><Link to="/login" className="hover:text-secondary transition-colors">Sign Up</Link></li>
              <li><Link to="/dashboard" className="hover:text-secondary transition-colors">Dashboard</Link></li>
              <li><Link to="/settings" className="hover:text-secondary transition-colors">Settings</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © 2024 Français. Tous droits réservés. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-primary rounded-full" />
            <div className="w-8 h-1 bg-card rounded-full" />
            <div className="w-8 h-1 bg-destructive rounded-full" />
          </div>
        </div>
      </div>
    </footer>
  );
};
