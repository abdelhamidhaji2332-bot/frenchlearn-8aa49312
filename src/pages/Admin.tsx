import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  BookOpen, 
  Settings, 
  BarChart3, 
  FileText, 
  Shield,
  Clock,
  MapPin,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  UserCog
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for users
  const users = [
    { id: 1, name: "Marie Dupont", email: "marie@example.com", level: "B1", lastLogin: "2 hours ago", location: "Paris, FR", progress: 67, status: "active" },
    { id: 2, name: "Jean Martin", email: "jean@example.com", level: "A2", lastLogin: "1 day ago", location: "Lyon, FR", progress: 45, status: "active" },
    { id: 3, name: "Sophie Bernard", email: "sophie@example.com", level: "C1", lastLogin: "3 hours ago", location: "Marseille, FR", progress: 89, status: "active" },
    { id: 4, name: "Pierre Leclerc", email: "pierre@example.com", level: "A1", lastLogin: "1 week ago", location: "Bordeaux, FR", progress: 12, status: "inactive" },
    { id: 5, name: "Camille Roux", email: "camille@example.com", level: "B2", lastLogin: "5 hours ago", location: "Nice, FR", progress: 78, status: "active" },
  ];

  const stats = [
    { label: "Total Users", value: "1,234", icon: Users, color: "from-primary to-primary/80" },
    { label: "Active Today", value: "456", icon: TrendingUp, color: "from-success to-success/80" },
    { label: "Lessons Created", value: "89", icon: BookOpen, color: "from-secondary to-secondary/80" },
    { label: "Pending Reviews", value: "23", icon: AlertCircle, color: "from-warning to-warning/80" },
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Admin Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold">
                  Admin Panel
                </h1>
                <p className="text-muted-foreground">
                  Manage users, content, and platform settings
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="hover-lift">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-primary-foreground`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <BookOpen className="w-5 h-5" />
              <span>Manage Lessons</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <FileText className="w-5 h-5" />
              <span>Create Quiz</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <BarChart3 className="w-5 h-5" />
              <span>View Analytics</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Button>
          </motion.div>

          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card variant="glass">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Management
                  </CardTitle>
                  <div className="flex gap-2">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search users..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Level</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Last Login</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Location</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Progress</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-sm font-medium">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                              {user.level}
                            </span>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {user.lastLogin}
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              {user.location}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                  style={{ width: `${user.progress}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground">{user.progress}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {user.status === "active" ? (
                                <span className="flex items-center gap-1 text-success text-sm">
                                  <CheckCircle className="w-4 h-4" />
                                  Active
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-muted-foreground text-sm">
                                  <XCircle className="w-4 h-4" />
                                  Inactive
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="icon">
                              <UserCog className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
