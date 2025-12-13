import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Music, BookOpen, Newspaper, ChevronRight } from "lucide-react";

const videos = [
  { id: 1, title: "Les articles définis", duration: "5:30", level: "A1", thumbnail: "📚" },
  { id: 2, title: "Le passé composé", duration: "8:45", level: "A2", thumbnail: "⏰" },
  { id: 3, title: "Les pronoms relatifs", duration: "10:20", level: "B1", thumbnail: "🔗" },
];

const songs = [
  { id: 1, title: "La Vie en Rose", artist: "Édith Piaf", level: "A2" },
  { id: 2, title: "Tous les mêmes", artist: "Stromae", level: "B1" },
  { id: 3, title: "Je veux", artist: "Zaz", level: "A2" },
];

const stories = [
  { id: 1, title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", level: "B1", pages: 15 },
  { id: 2, title: "Le Chat Botté", author: "Charles Perrault", level: "A2", pages: 8 },
  { id: 3, title: "Cendrillon", author: "Charles Perrault", level: "A1", pages: 6 },
];

const Media = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Multimédia
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn French through videos, songs, and stories
            </p>
          </motion.div>

          {/* Video Lessons */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Play className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-display font-semibold">Video Lessons</h2>
              </div>
              <Button variant="ghost">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {videos.map((video) => (
                <Card key={video.id} variant="glass" className="hover-lift cursor-pointer">
                  <CardContent className="p-6">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-6xl mb-4">
                      {video.thumbnail}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                        {video.level}
                      </span>
                      <span className="text-sm text-muted-foreground">{video.duration}</span>
                    </div>
                    <h3 className="font-semibold">{video.title}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Songs */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                  <Music className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-display font-semibold">Songs with Lyrics</h2>
              </div>
              <Button variant="ghost">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {songs.map((song) => (
                <Card key={song.id} variant="glass" className="hover-lift cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl">
                      🎵
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{song.title}</h3>
                      <p className="text-sm text-muted-foreground">{song.artist}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                      {song.level}
                    </span>
                    <Button variant="ghost" size="icon">
                      <Play className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Short Stories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center text-success">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-display font-semibold">Short Stories</h2>
              </div>
              <Button variant="ghost">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {stories.map((story) => (
                <Card key={story.id} variant="glass" className="hover-lift cursor-pointer">
                  <CardContent className="p-6">
                    <div className="text-5xl mb-4">📖</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                        {story.level}
                      </span>
                      <span className="text-xs text-muted-foreground">{story.pages} pages</span>
                    </div>
                    <h3 className="font-semibold mb-1">{story.title}</h3>
                    <p className="text-sm text-muted-foreground">{story.author}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Media;
