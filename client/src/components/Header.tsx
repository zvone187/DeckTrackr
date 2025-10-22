import { LogOut, Home } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ui/theme-toggle"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export function Header() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleHome = () => {
    navigate("/")
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-emerald-200/50 dark:border-emerald-800/50 bg-white/80 dark:bg-emerald-950/80 backdrop-blur-md shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div
          className="text-xl font-bold cursor-pointer flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors"
          onClick={handleHome}
        >
          <Home className="h-5 w-5" />
          DeckTrackr
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="hover:bg-emerald-100 dark:hover:bg-emerald-900 hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}