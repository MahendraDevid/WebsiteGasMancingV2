<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-links">
        <a href="#">Tentang Kami</a><span>|</span>
        <a href="#">Kontak</a><span>|</span>
        <a href="#">Kebijakan Privasi</a><span>|</span>
        <a href="#">Syarat & Ketentuan</a>
      </div>
      <div class="footer-socials">
  <a href="https://www.instagram.com/modemade_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  </a>

  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 11.75a29 29 0 0 0-.46-5.33z"></path>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
  </a>

  <a href="https://www.facebook.com/share/17eU6wmbEC/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  </a>

  <a href="https://mail.google.com/mail/u/0/?fs=1&to=mahendradevid30@upi.edu&tf=cm" target="_blank" rel="noopener noreferrer" aria-label="Email">
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22 6 12 13 2 6"></polyline>
    </svg>
  </a>
</div>

      <div class="footer-disclaimer">
        <p>"GAS MANCING" adalah platform informasi dan komunitas yang didedikasikan untuk para penggemar memancing di Indonesia. Informasi disediakan "sebagaimana adanya" tanpa jaminan.</p>
      </div>
      <div class="footer-copyright">
        <p>© 2025 Gas Mancing. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Tidak ada logika JS yang dibutuhkan di sini
</script>

<style scoped>

.footer {
  background: linear-gradient(180deg, rgba(19, 62, 135, 0.95) 0%, rgba(19, 62, 135, 0.85) 100%);
  color: var(--white);
  padding: 50px 20px 30px;
  margin-top: 60px;
}

.footer-content {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  text-align: center;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.footer-links a {
  color: var(--white);
  text-decoration: none;
  font-size: 16px;
  transition: opacity 0.3s ease;
}

.footer-links a:hover {
  opacity: 0.8;
}

.footer-links span {
  color: var(--gray);
}

.footer-socials {
  display: flex;
  gap: 25px;
}

.footer-socials a {
  color: var(--white);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.footer-socials a:hover {
  opacity: 0.8;
  transform: scale(1.1);
}

.footer-disclaimer {
  font-size: 14px;
  color: var(--white);
  line-height: 1.6;
  max-width: 700px;
}

.footer-copyright {
  font-size: 14px;
  color: #BCCCDC;
  margin-top: 15px;
}

/* RESPONSIVE FOOTER */
@media (max-width: 768px) {
  .footer-links {
    gap: 10px;
  }
  
  .footer-links a,
  .footer-links span {
    font-size: 14px;
  }

  .footer-disclaimer,
  .footer-copyright {
    font-size: 12px;
  }
}
</style>