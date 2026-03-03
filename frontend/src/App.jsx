import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EventDetailPage from "./pages/EventDetailPage";
import EventsPage from "./pages/EventsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/AdminDashboard";
import MyRegistrationsPage from "./pages/MyRegistrationsPage";
import { AuthProvider } from "./context/AuthContext";
import Preloader from "./components/Preloader";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <AuthProvider>
      <BrowserRouter>
        {loading && <Preloader onFinish={() => setLoading(false)} />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/event/:eventId" element={<EventDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/my-registrations" element={<MyRegistrationsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
