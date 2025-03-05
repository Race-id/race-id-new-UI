<template>
  <header>
    <div class="top-header">
      <div class="top-container">
        <router-link to="/" class="logo">Race.id</router-link>
        <div class="tagline">We provide running information for you.</div>
        <div class="profile-menu">
          
        </div>
      </div>
    </div>


    <div class="nav-container">
      <nav class="nav-menu">
        <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/race">Race</router-link></li>
      <!-- <li><router-link to="/articles">Articles</router-link></li> -->
      <!-- <li><router-link to="/equipment">Equipment</router-link></li>  -->
      <li><router-link to="/faq">FAQ</router-link></li>
      <li><router-link to="/about-us">About Us</router-link></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

header {
  font-family: 'Poppins', sans-serif;
}

footer {
  font-family: 'Poppins', sans-serif;
}
.top-header {
  background: linear-gradient(to right, #283f95, #2252a4, #1c61b0, #127cc7, #0993d9, #04a3e6) !important;
  color: #fff;    
  padding: 10px 0;
}

.top-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  font-size: 1.5em;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}

.tagline {
  font-size: 0.9em;
  color: #fff;
}

.profile-menu {
  display: flex;
  gap: 20px;
  align-items: center;
}

header {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.nav-container {
  background: #fff;
  padding: 15px 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.nav-menu {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.nav-menu ul {
  list-style: none;
  display: flex;
  gap: 30px;
  margin: 0;
  padding: 0;
}

.nav-menu a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-menu a:hover {
  color: #ff4d4d;
}

.divider {
  text-align: center;
  color: #666;
  margin: 5px 0;
}

@media only screen and (max-width: 600px) {
  .top-container {
    flex-direction: row;
    justify-content: flex-start;
    padding: 10px;
    position: relative;
  }

  .logo {
    font-size: 1.3em;
    margin-right: 10px;
  }

  .tagline {
    font-size: 0.8em;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .nav-container {
    padding: 8px 0;
    overflow-x: auto;
    margin-bottom: 10px;
  }

  .nav-menu {
    padding: 0 10px;
  }

  .nav-menu ul {
    flex-direction: row;
    gap: 15px;
    width: max-content;
    padding: 0 10px;
  }

  .nav-menu li {
    width: auto;
  }

  .nav-menu a {
    white-space: nowrap;
    padding: 8px 12px;
  }
}


</style>
