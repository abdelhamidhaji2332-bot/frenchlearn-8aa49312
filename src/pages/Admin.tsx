import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  UserCog,
  UserPlus,
  GraduationCap,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserProfile {
  id: string;
  user_id: string;
  username: string | null;
  level: string | null;
  xp_points: number | null;
  streak_days: number | null;
  last_activity_date: string | null;
}

interface Teacher {
  id: string;
  name: string;
  email: string | null;
  bio: string | null;
  specialization: string[] | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "teacher" | "student">("student");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    totalLessons: 0,
    totalVocabulary: 0
  });

  useEffect(() => {
    checkAdminAndFetchData();
  }, [user]);

  const checkAdminAndFetchData = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Check if user is admin
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
      return;
    }

    setIsAdmin(true);

    // Fetch users
    const { data: usersData } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (usersData) {
      setUsers(usersData);
    }

    // Fetch teachers
    const { data: teachersData } = await supabase
      .from("teachers")
      .select("*");

    if (teachersData) {
      setTeachers(teachersData);
    }

    // Fetch stats
    const { count: userCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { count: lessonCount } = await supabase
      .from("lessons")
      .select("*", { count: "exact", head: true });

    const { count: vocabCount } = await supabase
      .from("vocabulary")
      .select("*", { count: "exact", head: true });

    setStats({
      totalUsers: userCount || 0,
      activeToday: Math.floor((userCount || 0) * 0.3), // Estimate
      totalLessons: lessonCount || 0,
      totalVocabulary: vocabCount || 0
    });

    setLoading(false);
  };

  const handlePromoteUser = async (userId: string, role: "admin" | "teacher") => {
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role });

    if (error) {
      if (error.code === "23505") {
        toast.error("User already has this role");
      } else {
        toast.error("Failed to update role");
      }
      return;
    }

    toast.success(`User promoted to ${role}`);
    checkAdminAndFetchData();
  };

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statCards = [
    { label: "Total Users", value: stats.totalUsers.toString(), icon: Users, color: "from-primary to-primary/80" },
    { label: "Active Today", value: stats.activeToday.toString(), icon: TrendingUp, color: "from-success to-success/80" },
    { label: "Lessons", value: stats.totalLessons.toString(), icon: BookOpen, color: "from-secondary to-secondary/80" },
    { label: "Vocabulary", value: stats.totalVocabulary.toString(), icon: FileText, color: "from-warning to-warning/80" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

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
            {statCards.map((stat, index) => (
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

          {/* Teachers Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Teachers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teachers.map((teacher) => (
                    <Card key={teacher.id} className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                            {teacher.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{teacher.name}</h4>
                            <p className="text-sm text-muted-foreground">{teacher.email}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{teacher.bio}</p>
                        <div className="flex flex-wrap gap-1">
                          {teacher.specialization?.map((spec, i) => (
                            <span key={i} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => setShowInviteDialog(true)}
            >
              <UserPlus className="w-5 h-5" />
              <span>Invite User</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <BookOpen className="w-5 h-5" />
              <span>Manage Lessons</span>
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
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">XP</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Streak</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-sm font-medium">
                                {(user.username || "U").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium">{user.username || "Anonymous"}</p>
                                <p className="text-sm text-muted-foreground truncate max-w-[150px]">{user.user_id.substring(0, 8)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                              {user.level || "A1"}
                            </span>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            <span className="text-foreground">{user.xp_points || 0} XP</span>
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell">
                            <span className="text-foreground">🔥 {user.streak_days || 0} days</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handlePromoteUser(user.user_id, "teacher")}
                              >
                                <GraduationCap className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handlePromoteUser(user.user_id, "admin")}
                              >
                                <Shield className="w-4 h-4" />
                              </Button>
                            </div>
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

      {/* Invite User Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Invite a new user and assign them a role. They will need to sign up first, then you can promote them.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Instructions</Label>
              <p className="text-sm text-muted-foreground">
                1. Have the user sign up at the login page<br/>
                2. Find them in the users table above<br/>
                3. Click the Teacher or Admin icon to promote them
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowInviteDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;