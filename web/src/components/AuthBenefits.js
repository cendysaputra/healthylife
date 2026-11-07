import Sym from './Svg';

const MANFAAT = [
  { simbol: 'cat-shoe', warna: 'benefit-blue', judul: 'Catat gerakmu', teks: 'Jalan, yoga, atau peregangan. Semua menit dihitung dan terkumpul tiap hari.' },
  { simbol: 'heart', warna: 'benefit-pink', judul: 'Simpan favorit', teks: 'Tandai bacaan dan video yang ingin kamu buka lagi nanti.' },
  { simbol: 'sun', warna: 'benefit-yellow', judul: 'Target yang nyaman', teks: 'Atur sendiri target harianmu, dari 5 sampai 300 menit.' }
];

function AuthBenefits() {
  return (
    <section className="benefit-section container" aria-labelledby="manfaat-akun">
      <Sym id="buddy" className="section-doodle doodle-b" />
      <div className="section-heading compact">
        <div>
          <span className="eyebrow">KENAPA PUNYA AKUN</span>
          <h2 id="manfaat-akun">Langkah kecilmu, tersimpan rapi.</h2>
        </div>
        <p>Gratis, dan bisa dibuka dari perangkat mana pun.</p>
      </div>
      <div className="benefit-grid">
        {MANFAAT.map((m) => (
          <div key={m.judul} className={`benefit-card ${m.warna}`}>
            <Sym id={m.simbol} />
            <h3>{m.judul}</h3>
            <p>{m.teks}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AuthBenefits;
