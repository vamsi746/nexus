import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Home from './pages/Home.jsx';
import Startups from './pages/Startups.jsx';
import Hackathons from './pages/Hackathons.jsx';
import Opportunities from './pages/Opportunities.jsx';
import COE from './pages/COE.jsx';
import ForStudents from './pages/ForStudents.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg0)' }}>
      <Navbar />
      <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/startups" element={<Startups />} />
        <Route path="/hackathons" element={<Hackathons />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/coe" element={<COE />} />
        <Route path="/for-students" element={<ForStudents />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      </main>
    </div>
  );
}
