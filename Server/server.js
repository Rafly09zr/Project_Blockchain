const express = require('express');
const cors = require('cors');

const app = express();

// Menggunakan middleware CORS untuk izin akses dari semua asal
app.use(cors());

// Endpoint sederhana untuk pengujian
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Endpoint untuk menangani permintaan GET ke /items
app.get('/items', (req, res) => {
  // Lakukan operasi untuk mengambil data items dari server atau database
  // Misalnya, ambil data dari database dan kirim sebagai respons
  const items = [ /* Data items dari database atau server */ ];
  res.json(items); // Mengembalikan data items sebagai respons JSON
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
