import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import bg from "@/img/2.jpg";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success("Welcome back to Chocolate Bravo!");
      } else {
        setError(result.error || "Invalid email or password");
        toast.error(result.error || "Login failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
      toast.error(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 font-poppins text-[#2B170E]", className)} {...props}>
      <Card className="overflow-hidden p-0 border border-chocolate-200 shadow-2xl rounded-3xl bg-white">
        <CardContent className="grid p-0 md:grid-cols-12 min-h-[500px]">
          
          {/* Form Area */}
          <form className="p-8 md:p-12 md:col-span-7 flex flex-col justify-center space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center space-y-1.5">
                <span className="text-[10px] font-black tracking-widest text-[#d4af37] uppercase">Premium Hub</span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#3D1E11]">Welcome Back</h1>
                <p className="text-xs text-gray-500 font-medium">
                  Login to view your customized chocolate catalog
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                  title="Please enter a valid email address"
                  className="rounded-xl border-chocolate-200 px-4 py-2.5 focus:border-[#3D1E11] focus:ring-1 focus:ring-[#3D1E11]"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-chocolate-600 font-bold hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl border-chocolate-200 px-4 py-2.5 pr-10 focus:border-[#3D1E11] focus:ring-1 focus:ring-[#3D1E11]"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-sm cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {error && (
                  <p className="text-red-500 text-xs font-semibold mt-1">{error}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gold-gradient text-[#2B170E] font-extrabold py-3 rounded-xl transition hover:shadow-lg hover:shadow-amber-500/10 active:scale-[0.98] cursor-pointer" 
                disabled={loading}
              >
                {loading ? "Verifying Credentials..." : "Login"}
              </Button>

              <div className="text-center text-sm text-gray-500 pt-2 border-t border-gray-100">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-chocolate-600 font-bold hover:underline ml-1">
                  Create One
                </Link>
              </div>
            </div>
          </form>

          {/* Graphical Side Panel */}
          <div className="relative hidden md:block md:col-span-5 bg-[#1E100A] overflow-hidden">
            <img
              src={bg}
              alt="Artisanal Chocolate Background"
              className="absolute inset-0 h-full w-full object-cover brightness-[0.4] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E100A]/90 to-transparent flex flex-col justify-end p-8 space-y-3">
              <span className="text-[10px] font-black tracking-widest text-[#dfb15b] uppercase">Artisanal Hub</span>
              <h2 className="text-xl font-bold text-white leading-tight">Authentic Cacao Bliss</h2>
              <p className="text-xs text-gray-300 leading-relaxed font-medium">
                Indulge in certified fairtrade collections made with fresh ingredients and luxury wrapping options.
              </p>
            </div>
          </div>

        </CardContent>
      </Card>
      
      <div className="text-gray-400 text-center text-xs text-balance px-4">
        By checking in, you agree to our{" "}
        <Link to="/terms" className="hover:text-chocolate-600 underline">Terms</Link> and{" "}
        <Link to="/privacy" className="hover:text-chocolate-600 underline">Privacy Policy</Link>.
      </div>
    </div>
  );
}
