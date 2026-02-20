import { Link, useLocation } from "react-router-dom";
import { Heart, FileSearch, FlaskConical, Pill, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/scan-reader", label: "ScanReader", icon: FileSearch },
  { path: "/trial-finder", label: "TrialFinder", icon: FlaskConical },
  { path: "/treatment-navigator", label: "Treatment", icon: Pill },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80 border-b border-border/50">
      <div className="container flex h-18 items-center justify-between py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Heart className="h-5 w-5" />
          </div>
          <span className="font-serif text-xl font-bold text-foreground tracking-tight">
            Cancer<span className="text-primary">Companion</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </button>
              </Link>
            );
          })}
        </div>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link to="/scan-reader" className="hidden md:block">
            <Button className="rounded-xl px-6 shadow-lg shadow-primary/20">
              Get Started
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="block"
              >
                <div
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </div>
              </Link>
            );
          })}
          <div className="pt-2">
            <Link to="/scan-reader" onClick={() => setMobileOpen(false)}>
              <Button className="w-full rounded-xl">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
