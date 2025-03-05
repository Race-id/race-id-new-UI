<template>
  <footer class="site-footer">
    <div class="footer-content">
      <div class="footer-container">
        <div class="footer-section about">
          <h3>About Race.id</h3>
          <p>Your trusted platform for inspiring and supporting the Indonesian running community to reach their best potential.</p>
        </div>

        <div class="footer-section contact">
          <h3>Contact Us</h3>
          <ul>
            <li>
              <a href="mailto:info@steelytoe.com">{{ contactInfo.email }}</a>
            </li>
            <li>
              <a href="tel:+62 21 5151 392">{{ contactInfo.phone }}</a>
            </li>
            <li>
              <a href="https://maps.app.goo.gl/1hQPwaaTqHspL6Qy5" target="_blank">{{ contactInfo.address }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© {{ currentYear }} Race.id All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      contactInfo: {
        email: 'info@steelytoe.com',
        phone: '+62 21 5151 392',
        address: 'Equity Tower 17th Floor. SCBD Jakarta Selatan Jl. Jend. Sudirman Kav. 52-53 DKI Jakarta 12190'
      }
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');

footer {
  font-family: 'Lato', sans-serif;
}

.site-footer {
  background: linear-gradient(to right, #283f95, #2252a4, #1c61b0, #127cc7, #0993d9, #04a3e6) !important;
  color: #fff;
  padding: 40px 0 0 0;
  font-size: 0.9em;
}

.footer-content {
  margin-bottom: 20px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.footer-section {
  padding: 0 15px;
}

.footer-section.about {
  flex: 0 0 60%;
}

.footer-section.contact {
  flex: 0 0 30%;
}

.footer-section h3 {
  font-size: 1.2em;
  margin-bottom: 15px;
  color: #fff;
}

.footer-section p {
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 10px;
}

.footer-section ul li a {
  color: #fff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: #ff4d4d;
}

.footer-bottom {
  text-align: center;
  padding: 20px;
  margin-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.02);
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-section {
    margin-bottom: 30px;
  }
  
  .footer-section.about,
  .footer-section.contact {
    flex: 0 0 100%;
  }
}
</style>
