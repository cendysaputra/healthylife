import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { KATEGORI, labelKategori } from '../utils/format';
import Icon from './Icon';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [akunOpen, setAkunOpen] = useState(false);
  const [notif, setNotif] = useState({ count: 0, items: [] });

  // Close pas pindah
  useEffect(() => {
    setMenuOpen(false);
    setNotifOpen(false);
    setAkunOpen(false);
  }, [location.pathname, location.search]);

  // Notifikasi
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

  // Open notifikasi
  const toggleNotif = async () => {
    const buka = !notifOpen;
    setNotifOpen(buka);
    setAkunOpen(false);
    // Tandai dilihat
    if (buka && notif.count > 0) {
      try {
        await client.put('/notifications/seen');
      } catch {
        // abaikan
      }
    }
  };

  // Close notifikasi
  const tutupNotif = () => {
    setNotifOpen(false);
    setNotif((n) => ({ ...n, count: 0 }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Menu aktif
  const kategoriAktif = new URLSearchParams(location.search).get('kategori');

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo">HealthyLife</Link>

        {/* Button hamburger */}
        <button
          type="button"
          className="header__burger"
          aria-expanded={menuOpen}
          aria-controls="menu-utama"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} />
          {menuOpen ? 'Tutup' : 'Menu'}
        </button>

        {/* Menu utama */}
        <nav id="menu-utama" className={`header__nav ${menuOpen ? 'is-open' : ''}`} aria-label="Menu utama">
          <ul className="header__menu">
            <li><NavLink to="/" end>Beranda</NavLink></li>
            {KATEGORI.map((k) => (
              <li key={k.value}>
                <Link
                  to={`/konten?kategori=${k.value}`}
                  aria-current={location.pathname === '/konten' && kategoriAktif === k.value ? 'page' : undefined}
                >
                  {k.label}
                </Link>
              </li>
            ))}
            <li><NavLink to="/aktivitas">Aktivitas</NavLink></li>
          </ul>

          <div className="header__actions">
            <Link to="/konten" className="header__action header__action--icon">
              <Icon name="search" />
              <span className="header__action-text">Cari</span>
            </Link>

            {/* Belum login */}
            {!user && (
              <>
                <Link to="/login" className="header__action">Masuk</Link>
                <Link to="/register" className="btn btn--primary btn--sm">Daftar</Link>
              </>
            )}

            {/* Sudah login */}
            {user && (
              <>
                <div className="dropdown">
                  <button
                    type="button"
                    className="header__action header__action--icon"
                    onClick={toggleNotif}
                    aria-expanded={notifOpen}
                  >
                    <Icon name="bell" />
                    <span className="header__action-text">Notifikasi</span>
                    {notif.count > 0 && <span className="badge header__badge">{notif.count}</span>}
                  </button>
                  {notifOpen && (
                    <div className="dropdown__panel">
                      <p className="dropdown__title">Konten baru</p>
                      {notif.items.length === 0 && <p className="dropdown__empty">Belum ada konten baru.</p>}
                      <ul className="dropdown__list">
                        {notif.items.map((item) => (
                          <li key={item._id}>
                            <Link to={`/konten/${item.slug}`} onClick={tutupNotif}>
                              <span className="dropdown__meta">{labelKategori(item.category)}</span>
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
                    className="header__action"
                    onClick={() => {
                      setAkunOpen((v) => !v);
                      setNotifOpen(false);
                    }}
                    aria-expanded={akunOpen}
                  >
                    <span className="account__avatar" aria-hidden="true">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                    <span className="account__name">{user.name}</span>
                    <Icon name="chevron-down" className="account__chevron" />
                  </button>
                  {akunOpen && (
                    <div className="dropdown__panel">
                      <ul className="dropdown__list">
                        <li><Link to="/profil">Profil</Link></li>
                        <li><Link to="/profil#favorit">Favorit</Link></li>
                        <li className="dropdown__divider" aria-hidden="true" />
                        <li><button type="button" className="dropdown__danger" onClick={handleLogout}>Keluar</button></li>
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
