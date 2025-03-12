<template>
  <div class="footer">
    <div class="footer-content">
      <!-- Simple Brand Section -->
      <div class="brand">
        <span class="brand-name">Race.id</span>
        <div class="brand-motto">Run Together 🏃‍♂️</div>
      </div>

      <!-- Clean Navigation -->
      <div class="nav-grid">
        <a href="#" class="nav-item">Events</a>
        <a href="#" class="nav-item">Routes</a>
        <a href="#" class="nav-item">Community</a>
        <a href="#" class="nav-item">Stories</a>
      </div>

    </div>
  </div>
</template>

<style scoped>
.footer {
  background: linear-gradient(to right, #283f95, #04a3e6);
  padding: 40px 20px;
}

.footer-content {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.brand {
  text-align: left;
}

.brand-name {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 1px;
}

.brand-motto {
  margin-top: 8px;
  font-size: 14px;
  opacity: 0.9;
}

.nav-grid {
  display: flex;
  gap: 32px;
}

.nav-item {
  color: white;
  text-decoration: none;
  font-size: 16px;
  position: relative;
}

.nav-item::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background: white;
  transition: width 0.3s ease;
}

.nav-item:hover::after {
  width: 100%;
}

.social {
  display: flex;
  gap: 20px;
}

.social-link {
  color: white;
  text-decoration: none;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 30px;
    text-align: center;
  }

  .nav-grid {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
