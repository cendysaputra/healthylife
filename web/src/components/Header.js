import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import client from '../api/client';
import { KATEGORI, labelKategori } from '../utils/format';
import Icon, { BookmarkIcon } from './Icon';
import logo from '../assets/images/logo.png';

function Header() {
  const { user, logout } = useAuth();
  const { items: favorit } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const akunRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [akunOpen, setAkunOpen] = useState(false);
  const [notif, setNotif] = useState({ count: 0, items: [] });

  // Tutup saat pindah halaman
  useEffect(() => {
    setMenuOpen(false);
    setNotifOpen(false);
    setAkunOpen(false);
  }, [location.pathname, location.search]);

  // Klik luar / Escape
  useEffect(() => {
    if (!notifOpen && !akunOpen) return undefined;
    const onClick = (e) => {
      if (akunRef.current && !akunRef.current.contains(e.target)) {
        setNotifOpen(false);
        setAkunOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setNotifOpen(false);
        setAkunOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [notifOpen, akunOpen]);

  useEffect(() => {
    if (!user) {
      setNotif({ count: 0, items: [] });
      return;
    }
    client
      .get('/notifications')
      .then(({ data }) => setNotif(data))
      .catch(() => setNotif({ count: 0, items: [] }));
  }, [user, location.pathname]);

  const toggleNotif = async () => {
    const buka = !notifOpen;
    setNotifOpen(buka);
    setAkunOpen(false);
    // Tandai dibaca
    if (buka && notif.count > 0) {
      try {
        await client.put('/notifications/seen');
      } catch {
        // Abaikan
      }
    }
  };

  const tutupNotif = () => {
    setNotifOpen(false);
    setNotif((n) => ({ ...n, count: 0 }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Menu kategori aktif
  const kategoriAktif = location.pathname === '/konten' ? new URLSearchParams(location.search).get('kategori') : null;
  const navKategori = ['artikel', 'video', 'olahraga', 'nutrisi'].map((v) => KATEGORI.find((k) => k.value === v));

  return (
    <header className="header">
      <div className="nav-wrap container">
        <Link to="/" className="brand hl-brand" aria-label="HealthyLife beranda">
          <img src={logo} alt="HealthyLife" width="380" height="120" />
        </Link>

        <nav className={`nav ${menuOpen ? 'open' : ''}`} aria-label="Navigasi utama" id="main-nav">
          {navKategori.map((k) => (
            <Link
              key={k.value}
              to={`/konten?kategori=${k.value}`}
              aria-current={kategoriAktif === k.value ? 'page' : undefined}
            >
              {k.label}
            </Link>
          ))}
          <NavLink to="/aktivitas">Aktivitas</NavLink>
          {!user && (
            <NavLink to="/login" className="nav-mobile-only">
              Masuk
            </NavLink>
          )}
        </nav>

        <div className="nav-account" ref={akunRef}>
          {!user && (
            <>
              <Link to="/login" className="text-link is-plain">
                Masuk
              </Link>
              <Link to="/register" className="hl-button hl-button--sm">
                Daftar
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                to="/profil#favorit"
                className="icon-button icon-button--fav"
                aria-label={favorit.length > 0 ? `Favorit, ${favorit.length} tersimpan` : 'Favorit'}
              >
                <BookmarkIcon />
              </Link>

              <div className="dropdown">
                <button
                  type="button"
                  className="icon-button"
                  onClick={toggleNotif}
                  aria-expanded={notifOpen}
                  aria-label={notif.count > 0 ? `Notifikasi, ${notif.count} konten baru` : 'Notifikasi'}
                >
                  <Icon name="bell" />
                  {notif.count > 0 && (
                    <span className="notif-badge" aria-hidden="true">
                      {notif.count}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="dropdown-panel">
                    <p className="dropdown-title">KONTEN BARU</p>
                    {notif.items.length === 0 && (
                      <p className="dropdown-empty">Belum ada konten baru. Kami kabari kalau ada.</p>
                    )}
                    <ul className="dropdown-list">
                      {notif.items.map((item) => (
                        <li key={item._id}>
                          <Link to={`/konten/${item.slug}`} onClick={tutupNotif}>
                            <span className="dropdown-meta">{labelKategori(item.category)}</span>
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="dropdown">
                <button
                  type="button"
                  className="account-trigger"
                  onClick={() => {
                    setAkunOpen((v) => !v);
                    setNotifOpen(false);
                  }}
                  aria-expanded={akunOpen}
                  aria-label={`Akun ${user.name}`}
                >
                  <span className="avatar" aria-hidden="true">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="account-name">{user.name}</span>
                  <Icon name="chevron-down" />
                </button>
                {akunOpen && (
                  <div className="dropdown-panel dropdown-panel--small">
                    <ul className="dropdown-list">
                      <li>
                        <Link to="/profil">Profil</Link>
                      </li>
                      <li>
                        <Link to="/profil#favorit">Favorit</Link>
                      </li>
                      <li>
                        <Link to="/aktivitas">Aktivitas</Link>
                      </li>
                      <li className="dropdown-divider" aria-hidden="true" />
                      <li>
                        <button type="button" className="dropdown-danger" onClick={handleLogout}>
                          Keluar
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

export default Header;
