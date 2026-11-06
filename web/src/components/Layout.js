import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Layout() {
  return (
    <div className="page">
      {/* Lewati menu */}
      <a href="#konten" className="skip-link">Lewati ke konten</a>
      <Header />
      <main id="konten" className="main" tabIndex="-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
