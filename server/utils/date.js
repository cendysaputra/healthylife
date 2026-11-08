// zona WIB

const OFFSET_WIB = 7 * 60 * 60 * 1000;
const SATU_HARI = 24 * 60 * 60 * 1000;

// awal hari WIB
const awalHariWIB = (date = new Date()) => {
  const wib = new Date(date.getTime() + OFFSET_WIB);
  wib.setUTCHours(0, 0, 0, 0);
  return new Date(wib.getTime() - OFFSET_WIB);
};

// tanggal format WIB
const tanggalWIB = (date) => new Date(date.getTime() + OFFSET_WIB).toISOString().slice(0, 10);

module.exports = { awalHariWIB, tanggalWIB, SATU_HARI };
