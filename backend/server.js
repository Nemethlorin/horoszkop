const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const zodiacRanges = [
  { sign: 'Bak', start: [12, 22], end: [1, 19] },
  { sign: 'Vizonto', start: [1, 20], end: [2, 18] },
  { sign: 'Halak', start: [2, 19], end: [3, 20] },
  { sign: 'Kos', start: [3, 21], end: [4, 19] },
  { sign: 'Bika', start: [4, 20], end: [5, 20] },
  { sign: 'Ikrek', start: [5, 21], end: [6, 20] },
  { sign: 'Rak', start: [6, 21], end: [7, 22] },
  { sign: 'Oroszlan', start: [7, 23], end: [8, 22] },
  { sign: 'Szuz', start: [8, 23], end: [9, 22] },
  { sign: 'Merleg', start: [9, 23], end: [10, 22] },
  { sign: 'Skorpio', start: [10, 23], end: [11, 21] },
  { sign: 'Nyilas', start: [11, 22], end: [12, 21] }
];

function isValidDate(month, day, year) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }

  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1) {
    return false;
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  return day <= daysInMonth;
}

function isInRange(month, day, start, end) {
  const [startMonth, startDay] = start;
  const [endMonth, endDay] = end;

  if (startMonth < endMonth || (startMonth === endMonth && startDay <= endDay)) {
    const afterStart = month > startMonth || (month === startMonth && day >= startDay);
    const beforeEnd = month < endMonth || (month === endMonth && day <= endDay);
    return afterStart && beforeEnd;
  }

  const afterStart = month > startMonth || (month === startMonth && day >= startDay);
  const beforeEnd = month < endMonth || (month === endMonth && day <= endDay);
  return afterStart || beforeEnd;
}

function getZodiacSign(month, day) {
  for (const range of zodiacRanges) {
    if (isInRange(month, day, range.start, range.end)) {
      return range.sign;
    }
  }

  return null;
}

app.get('/api/zodiac', (req, res) => {
  const { birthDate } = req.query;

  if (!birthDate || typeof birthDate !== 'string') {
    return res.status(400).json({ error: 'A birthDate query parameter kotelezo. Formatum: YYYY-MM-DD' });
  }

  const match = birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return res.status(400).json({ error: 'Hibas datumformatum. Hasznald: YYYY-MM-DD' });
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!isValidDate(month, day, year)) {
    return res.status(400).json({ error: 'Ervenytelen datum.' });
  }

  const sign = getZodiacSign(month, day);

  if (!sign) {
    return res.status(500).json({ error: 'Nem sikerult meghatarozni a csillagjegyet.' });
  }

  return res.json({ birthDate, sign });
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Backend server fut a(z) http://localhost:${PORT} cimen`);
});
