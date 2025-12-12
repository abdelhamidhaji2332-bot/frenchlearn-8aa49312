import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlitchLoginEffect } from "@/components/GlitchLoginEffect";
import { Mail, Lock, User, Phone, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "login" | "signup";
type SignupMethod = "email" | "phone" | "google";

const Login = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [signupMethod, setSignupMethod] = useState<SignupMethod>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login - trigger glitch effect
    setShowGlitch(true);
  };

  const handleGlitchComplete = () => {
    setShowGlitch(false);
    setIsLoading(false);
    toast({
      title: "Bienvenue!",
      description: "You have successfully logged in.",
    });
    navigate("/dashboard");
  };

  const handleGoogleSignup = () => {
    toast({
      title: "Google Sign-In",
      description: "Google authentication will be available after connecting to Supabase.",
    });
  };

  return (
    <>
      <GlitchLoginEffect isActive={showGlitch} onComplete={handleGlitchComplete} />

      <div className="min-h-screen flex items-center justify-center bg-hero-pattern relative overflow-hidden px-4 py-8">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative z-10 w-full max-w-md">
          {/* Back button */}
          <Link to="/">
            <Button variant="ghost" className="mb-6 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Retour
            </Button>
          </Link>

          {/* Logo */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-4 shadow-glow">
              <span className="text-3xl font-display font-bold text-primary-foreground">F</span>
            </div>
            <h1 className="text-2xl font-display font-bold">
              {mode === "login" ? "Bon retour!" : "Créer un compte"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {mode === "login" ? "Welcome back!" : "Create your account"}
            </p>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="glass">
              <CardHeader className="text-center pb-2">
                {/* Mode Toggle */}
                <div className="flex bg-muted rounded-lg p-1 mb-4">
                  <button
                    onClick={() => setMode("login")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      mode === "login"
                        ? "bg-card shadow-soft text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => setMode("signup")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      mode === "signup"
                        ? "bg-card shadow-soft text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Inscription
                  </button>
                </div>
              </CardHeader>

              <CardContent>
                {mode === "signup" && (
                  <div className="flex gap-2 mb-6">
                    <Button
                      variant={signupMethod === "email" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSignupMethod("email")}
                      className="flex-1"
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </Button>
                    <Button
                      variant={signupMethod === "phone" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSignupMethod("phone")}
                      className="flex-1"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Phone
                    </Button>
                    <Button
                      variant={signupMethod === "google" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSignupMethod("google")}
                      className="flex-1"
                    >
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                  </div>
                )}

                {signupMethod === "google" && mode === "signup" ? (
                  <Button
                    variant="outline"
                    className="w-full h-12"
                    onClick={handleGoogleSignup}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    {mode === "signup" && signupMethod === "email" && (
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          variant="elegant"
                          placeholder="Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    )}

                    {(signupMethod === "email" || mode === "login") && (
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          variant="elegant"
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    )}

                    {signupMethod === "phone" && mode === "signup" && (
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          variant="elegant"
                          type="tel"
                          placeholder="Phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    )}

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        variant="elegant"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {mode === "login" && (
                      <div className="text-right">
                        <a href="#" className="text-sm text-primary hover:underline">
                          Mot de passe oublié?
                        </a>
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="hero"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : mode === "login" ? (
                        "Se connecter"
                      ) : (
                        "Créer un compte"
                      )}
                    </Button>
                  </form>
                )}

                {/* Divider */}
                {mode === "login" && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">ou</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleSignup}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
