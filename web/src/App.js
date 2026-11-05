import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import ContentList from './pages/ContentList';
import ContentDetail from './pages/ContentDetail';
import Activity from './pages/Activity';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Halaman publik */}
        <Route path="/" element={<Home />} />
        <Route path="/konten" element={<ContentList />} />
        <Route path="/konten/:slug" element={<ContentDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Wajib login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/aktivitas" element={<Activity />} />
          <Route path="/profil" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
