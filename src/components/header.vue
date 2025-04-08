<template>
  <div class="depth-frame">
    <div class="depth-frame-wrapper">
      <div class="div-wrapper">
        <router-link to="/" class="logo">Race.id</router-link>
      </div>
    </div>

    <div class="div">
      <div class="div-2">
        <div class="div-wrapper">
          <router-link to="/" class="nav-link">Home</router-link>
        </div>

        <div class="div-wrapper">
          <router-link to="/race" class="nav-link">Race</router-link>
        </div>

        <div class="div-wrapper">
          <router-link to="/articles" class="nav-link">Article</router-link>
        </div>

        <div class="div-wrapper">
          <router-link to="/faq" class="nav-link">FAQ</router-link>
        </div>

        <div class="div-wrapper">
          <router-link to="/about-us" class="nav-link">About</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DepthFrame",
};
</script>

<style>
.depth-frame {
  align-items: center;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-color: #e5e8ea;
  display: flex;
  justify-content: space-between;
  padding: 12px 40px;
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 1280px; 
  margin: 0 auto; 
}

.depth-frame router-link {
  text-decoration: none;
  color: inherit;
}

.text-wrapper,
.text-wrapper-2,
.text-wrapper-3 {
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;
}

.text-wrapper:hover,
.text-wrapper-2:hover, 
.text-wrapper-3:hover {
  color: #04a3e6;
}

.depth-frame .depth-frame-wrapper {
  align-items: center;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 16px;
  position: relative;
}

.depth-frame .div-wrapper {
  align-items: flex-start;
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  position: relative;
  padding: 0 8px; 
}

.depth-frame .text-wrapper {
  align-self: stretch;
  color: #111416;
  font-family: "Lexend-Bold", Helvetica;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 23px;
  margin-top: -1.00px;
  position: relative;
  white-space: nowrap;
}

.depth-frame .div {
  align-items: flex-start;
  display: flex;
  flex: 1;
  flex-grow: 1;
  gap: 32px;
  justify-content: flex-end;
  position: relative;
}

.depth-frame .div-2 {
  align-items: center;
  display: flex;
  gap: 32px; 
  height: 40px;
  position: relative;
  width: auto; 
  margin-right: 40px; 
}

.depth-frame .text-wrapper-2 {
  align-self: stretch;
  color: #111416;
  font-family: "Lexend-Medium", Helvetica;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 21px;
  margin-top: -1.00px;
  position: relative;
  white-space: nowrap;
}

.depth-frame .text-wrapper-3 {
  align-self: stretch;
  color: #111416;
  font-family: "Lexend-Medium", Helvetica;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 21px;
  margin-top: -1.00px;
  position: relative;
}

.depth-frame .div-3 {
  flex: 0 0 auto;
  position: relative;
}

.depth-frame .div-4 {
  flex: 0 0 auto;
  position: relative;
}

.logo {
  color: #111416;
  font-family: "Lexend-Bold", Helvetica;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  line-height: 23px;
}

.nav-link {
  color: #111416;
  font-family: "Lexend-Medium", Helvetica;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  line-height: 21px;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #04a3e6;
}

@media (max-width: 768px) {
  .depth-frame {
    padding: 12px 24px;
  }

  .logo-wrapper {
    padding-right: 24px;
  }

  .nav-menu {
    gap: 24px;
  }

  .logo {
    font-size: 16px;
  }

  .nav-link {
    font-size: 13px;
  }

  .depth-frame .div-2 {
    gap: 24px;
    margin-right: 24px;
  }
}

@media (max-width: 480px) {
  .depth-frame {
    padding: 10px 16px;
  }

  .logo-wrapper {
    padding-right: 16px;
  }

  .nav-menu {
    gap: 16px;
  }

  .nav-link {
    font-size: 12px;
  }

  .depth-frame .div-2 {
    gap: 16px;
    margin-right: 16px;
  }
}

@media (max-width: 360px) {
  .logo-wrapper {
    padding-right: 12px;
  }

  .nav-menu {
    gap: 12px;
  }

  .nav-link {
    font-size: 11px;
  }
}
</style>