import { useState } from 'react';
import { KEBIASAAN } from '../../data/home';
import { urlGambar } from '../../utils/format';
import fotoCadangan from '../../assets/images/gerak.jpg';
import Cloud from '../Cloud';
import Mascot from '../Mascot';
import Sym from '../Svg';

const KUNCI = 'healthylife_habit';

const bacaPilihan = () => {
  try {
    return localStorage.getItem(KUNCI);
  } catch {
    return null;
  }
};

function HabitSection() {
  const tersimpanAwal = bacaPilihan();
  const [pilihan, setPilihan] = useState(
    KEBIASAAN.some((k) => k.id === tersimpanAwal) ? tersimpanAwal : KEBIASAAN[0].id
  );
  const [fotoGagal, setFotoGagal] = useState({});

  const rencana = KEBIASAAN.find((k) => k.id === pilihan);
  const foto = fotoGagal[rencana.id] ? fotoCadangan : urlGambar(rencana.foto);

  // Dibaca juga oleh halaman Profil
  const pilih = (id) => {
    setPilihan(id);
    try {
      localStorage.setItem(KUNCI, id);
    } catch {
      // penyimpanan tidak tersedia
    }
  };

  return (
    <section className="hl-habits" id="kebiasaan">
      <Cloud warna="#ff6600" className="hl-habits-cloud" />
      <div className="hl-habits-body">
        <div className="container">
          <Mascot varian="putih" className="hl-habits-smile" />
          <h2 className="hl-habits-title">
            Kebiasaan sehat apa
            <br />
            yang mau kamu mulai?
          </h2>

          <div className="hl-habit-options" role="radiogroup" aria-label="Pilih kebiasaan sehat">
            {KEBIASAAN.map((k) => {
              const aktif = k.id === pilihan;
              return (
                <button
                  key={k.id}
                  type="button"
                  role="radio"
                  aria-checked={aktif}
                  className={`hl-habit-option ${aktif ? 'is-active' : ''}`.trim()}
                  onClick={() => pilih(k.id)}
                >
                  <Sym id={k.simbol} />
                  <span>{k.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hl-habit-plan" aria-live="polite">
            <div className="hl-habit-copy">
              <h3>
                {rencana.judul[0]}
                <br />
                {rencana.judul[1]}
              </h3>
              <p>{rencana.teks}</p>
              <p className="hl-habit-tip">
                <strong>Tips:</strong> {rencana.tip}
              </p>
            </div>
            <div className="hl-habit-photo">
              <img
                key={rencana.id}
                src={foto}
                alt=""
                loading="lazy"
                width="1168"
                height="784"
                onError={() => setFotoGagal((g) => ({ ...g, [rencana.id]: true }))}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HabitSection;
