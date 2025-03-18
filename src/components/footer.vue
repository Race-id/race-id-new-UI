<script setup>
import { computed } from 'vue';

const currentYear = computed(() => {
  return new Date().getFullYear();
})
</script>

<template>
  <footer class="footer">
    <div class="footer-wrapper">
      <!-- Main Footer -->
      <div class="footer-main">
        <!-- Logo Section -->
        <div class="footer-brand">
          <h2 class="brand-logo">Race.id</h2>
          <p class="brand-tagline">Discover Your Next Running Adventure</p>
          </div>

        <!-- Links Grid -->
        <div class="footer-grid">
          <div class="footer-column">
            <h3>Events</h3>
            <ul>
              <li><a href="#">Upcoming Races</a></li>
              <li><a href="#">Past Events</a></li>
              <li><a href="#">Virtual Runs</a></li>
            </ul>
          </div>

          <div class="footer-column">
            <h3>Support</h3>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <p class="copyright">© {{ currentYear }} Race.id All rights reserved.</p>
        </div>
      </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #ffffff;
  padding: 64px 24px 24px;
  border-top: 2px solid #f3f4f6;
  font-family: "Plus Jakarta Sans", sans-serif;
}

.footer-wrapper {
  max-width: 1280px;
  margin: 0 auto;
}

.footer-main {
  display: grid;
  grid-template-columns: 1.5fr 2fr;
  gap: 64px;
  margin-bottom: 48px;
}

.footer-brand {
  padding-right: 48px;
}

.brand-logo {
  color: #04a3e6;
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 16px;
}

.brand-tagline {
  color: #6b7280;
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 24px;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
}

.footer-column h3 {
  color: #111827;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 20px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column li {
  margin-bottom: 12px;
}

.footer-column a {
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.footer-column a:hover {
  color: #04a3e6;
}

.footer-bottom {
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

@media (max-width: 768px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .footer-brand {
    padding-right: 0;
    text-align: center;
  }

  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 40px 16px 24px;
  }

  .footer-main {
    grid-template-columns: 1fr;
    gap: 32px;
    margin-bottom: 32px;
  }

  .footer-brand {
    padding-right: 0;
    text-align: center;
  }

  .brand-logo {
    font-size: 24px;
    margin: 0 0 12px;
  }

  .brand-tagline {
    font-size: 14px;
    margin-bottom: 20px;
  }

  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .footer-column h3 {
    font-size: 15px;
    margin: 0 0 16px;
  }

  .footer-column li {
    margin-bottom: 10px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
    padding-top: 20px;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 32px 16px 20px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 32px;
  }

  .footer-column {
    padding: 0 16px;
  }

  .footer-column h3 {
    font-size: 16px;
  }

  .footer-column ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .footer-column li {
    margin-bottom: 0;
  }

  .brand-tagline {
    padding: 0 16px;
  }
}
</style>