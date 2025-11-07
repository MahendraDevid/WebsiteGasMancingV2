// Kita pindahkan data dari 'PesananView.vue' ke sini
// Saya juga tambahkan data yang hilang (kodeBayar, totalPrice, nomorPesanan) 
// agar halaman DetailPesanan Anda berfungsi.

export const allOrders = [
  {
    id: 1,
    image: '/img/ancol.png', 
    title: 'Pantai Ancol',
    location: 'Ancol, Jakarta Barat',
    rating: '4.2',
    reviewCount: '300',
    orderDate: '23/10/2025',
    numPeople: 2,
    rentedEquipment: ['Joran Set', 'Umpan'],
    status: 'Lunas', 
    statusClass: 'lunas',
    // Data tambahan untuk halaman detail
    nomorPesanan: 'GAS-001',
    kodeBayar: '8881081000000001',
    totalPrice: 'Rp 250.000',
    paymentMethod: 'QRIS DANA' // ✅ contoh lain
  },
  {
    id: 2,
    image: '/img/kolam.png', 
    title: 'Kolam Pemancingan Cibiru',
    location: 'Cibiru, Bandung',
    rating: '4.5',
    reviewCount: '150',
    orderDate: '28/10/2025',
    numPeople: 4,
    rentedEquipment: ['Joran Set x4', 'Umpan Premium', 'Saung'],
    status: 'Menunggu Pembayaran',
    statusClass: 'menunggu',
    // Data tambahan untuk halaman detail
    nomorPesanan: 'GAS-002',
    kodeBayar: '8881081000000002',
    totalPrice: 'Rp 450.000',
    paymentMethod: 'QRIS DANA'
  },
  {
    id: 3,
    image: '/img/muara.png', 
    title: 'Pemancingan Muara Karang',
    location: 'Pluit, Jakarta Utara',
    rating: '4.7',
    reviewCount: '500',
    orderDate: '15/09/2025',
    numPeople: 1,
    rentedEquipment: ['Tidak ada'],
    status: 'Lunas',
    statusClass: 'lunas',
    // Data tambahan untuk halaman detail
    nomorPesanan: 'GAS-003',
    kodeBayar: '8881081000000003',
    totalPrice: 'Rp 150.000'
  },
];