<template>
  <div class="index-container">
    <h1 style="text-align: center; font-size: 30px;">Indeks Website GasMancing</h1>
    
    <div class="info-kelompok">
      <strong>Nama Kelompok:</strong> GasMancing <br>
      <strong>Nomor Kelompok:</strong> Kelompok 4 </br>
      <br>
    <br>
    <strong>Anggota Kelompok:</strong> </br>
    <ol class="number">
        <li>
            Arya Purnama Sauri (NIM : 2408521)
        </li>
        <li>
            Imam Azizun Hakim (NIM : 2404420)
        </li>
        <li>
            Mahendra Devid Putra Anwar (NIM : 2407792)
        </li>
        <li>
            Muhammad Rangga Nur Praditha (NIM: 2400297)
        </li>
    </ol>
      
    </div>

    <nav class="halaman-nav">
      <ul>
        <li><router-link to="/">1. Halaman Depan (Home)</router-link></li>
        <li><router-link to="/ensiklopedia">2. Ensiklopedia</router-link></li>
        <li><router-link to="/search">3. Pencarian (Search)</router-link></li>
        <li><router-link to="/detail/1">4. Detail Tempat</router-link></li>
        <li><router-link to="/booking">5. Booking</router-link></li>
        <li><router-link to="/payment">6. Pembayaran (Payment)</router-link></li>
        <li><router-link to="/paymentconfirmation">6. Konfirmasi Pembayaran</router-link></li>
        <li><router-link to="/pesanan">7. List Pesanan Saya</router-link></li>
        <li><router-link to="/profile">8. Edit Profile</router-link></li>
        <li><router-link to="/detailpesanan/1">9. Detail Pesanan</router-link></li>
        </ul>
    </nav>
  </div>
</template>

<style scoped src="./IndexView.css"></style>