import { motion } from "framer-motion";
import { BookOpen, MessageSquare, Award, Mic, Brain, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: BookOpen,
    title: "Interactive Lessons",
    titleFr: "Leçons Interactives",
    description: "Complete curriculum from A1 to C2 with audio, flashcards, and quizzes",
  },
  {
    icon: MessageSquare,
    title: "Grammar Mastery",
    titleFr: "Maîtrise de la Grammaire",
    description: "Conjugations, rules, examples with audio, and video lessons",
  },
  {
    icon: Mic,
    title: "Speaking Practice",
    titleFr: "Pratique Orale",
    description: "Record-and-compare feature with AI pronunciation scoring",
  },
  {
    icon: Brain,
    title: "AI Writing Correction",
    titleFr: "Correction IA",
    description: "Smart corrections for grammar, vocabulary, and sentence structure",
  },
  {
    icon: Award,
    title: "Certifications",
    titleFr: "Certifications",
    description: "Earn verified certificates with unique verification codes",
  },
  {
    icon: Users,
    title: "Community",
    titleFr: "Communauté",
    description: "Join level-based chat rooms, study groups, and leaderboards",
  },
];

export const FeaturesGrid = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to master French
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass" className="h-full hover-lift cursor-pointer group">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 text-primary-foreground group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-secondary mb-2">{feature.titleFr}</p>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
