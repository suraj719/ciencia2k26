import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EventDetailPage from "./pages/EventDetailPage";
import EventsPage from "./pages/EventsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/AdminDashboard";
import MyRegistrationsPage from "./pages/MyRegistrationsPage";
import TeamPage from "./pages/TeamPage";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/event/:eventId" element={<EventDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/my-registrations" element={<MyRegistrationsPage />} />
          <Route path="/team" element={<TeamPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
