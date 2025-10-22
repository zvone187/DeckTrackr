import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Layout } from "./components/Layout"
import { Dashboard } from "./pages/Dashboard"
import { Analytics } from "./pages/Analytics"
import { ViewerDetails } from "./pages/ViewerDetails"
import { PublicDeckView } from "./pages/PublicDeckView"

function App() {
  return (
  <AuthProvider>
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/view/:deckId" element={<PublicDeckView />} />
          <Route path="/" element={<ProtectedRoute> <Layout /> </ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="deck/:deckId/analytics" element={<Analytics />} />
            <Route path="deck/:deckId/viewer/:viewerId" element={<ViewerDetails />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  </AuthProvider>
  )
}

export default App