import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const levels = [
  { id: "a1", name: "A1", label: "Débutant", color: "bg-emerald-500", description: "Beginner" },
  { id: "a2", name: "A2", label: "Élémentaire", color: "bg-teal-500", description: "Elementary" },
  { id: "b1", name: "B1", label: "Intermédiaire", color: "bg-blue-500", description: "Intermediate" },
  { id: "b2", name: "B2", label: "Indépendant", color: "bg-indigo-500", description: "Upper Intermediate" },
  { id: "c1", name: "C1", label: "Avancé", color: "bg-purple-500", description: "Advanced" },
  { id: "c2", name: "C2", label: "Maîtrise", color: "bg-amber-500", description: "Mastery" },
];

interface LevelSelectorProps {
  onSelectLevel?: (level: string) => void;
}

export const LevelSelector = ({ onSelectLevel }: LevelSelectorProps) => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Choisissez votre niveau
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose your level and start your French learning journey
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {levels.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="glass"
                className="w-full h-auto flex-col py-8 group hover-lift"
                onClick={() => onSelectLevel?.(level.id)}
              >
                <div
                  className={`w-16 h-16 rounded-full ${level.color} flex items-center justify-center mb-4 text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform`}
                >
                  {level.name}
                </div>
                <span className="font-display font-semibold text-lg">{level.label}</span>
                <span className="text-sm text-muted-foreground">{level.description}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
