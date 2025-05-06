<template>
  <div 
    class="depth-frame" 
    :class="{ 'hidden': isHeaderHidden }"
    @mouseenter="showHeader"
  >
    <div class="depth-frame-wrapper">
      <div class="div-wrapper">
        <router-link to="/" class="logo" @click="showHeader">Race.id</router-link>
      </div>
    </div>

    <div class="div">
      <div class="div-2">
        <div class="div-wrapper">
          <router-link to="/" class="nav-link" @click="showHeader">Home</router-link>
        </div>
        <div class="div-wrapper">
          <router-link to="/race" class="nav-link" @click="showHeader">Race</router-link>
        </div>
        <div class="div-wrapper">
          <router-link to="/articles" class="nav-link" @click="showHeader">Article</router-link>
        </div>
        <div class="div-wrapper">
          <router-link to="/faq" class="nav-link" @click="showHeader">FAQ</router-link>
        </div>
        <div class="div-wrapper">
          <router-link to="/about-us" class="nav-link" @click="showHeader">About</router-link>
        </div>
      </div>
    </div>
    
    <!-- Tombol kecil untuk trigger menampilkan header saat disembunyikan -->
    <div 
      class="header-trigger" 
      @click="showHeader" 
      v-if="isHeaderHidden"
      aria-label="Show navigation"
      role="button"
      tabindex="0"
    ></div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: "DepthFrame",
  setup() {
    const isHeaderHidden = ref(false);
    const lastScrollY = ref(0);
    const scrollThreshold = 70; // Minimal scroll sebelum header disembunyikan
    const scrollTimeout = ref(null);
    const hideDelay = ref(null);
    
    // Fungsi untuk menangani scroll
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Jika scroll ke bawah lebih dari threshold, sembunyikan header dengan delay
      if (currentScrollY > lastScrollY.value && currentScrollY > scrollThreshold) {
        // Batal hide delay yang ada jika ada
        if (hideDelay.value) {
          clearTimeout(hideDelay.value);
        }
        
        // Set delay baru untuk menghindari header hilang terlalu cepat saat scrolling
        hideDelay.value = setTimeout(() => {
          isHeaderHidden.value = true;
        }, 300);
      } 
      // Jika scroll ke atas, tampilkan header segera
      else if (currentScrollY < lastScrollY.value) {
        if (hideDelay.value) {
          clearTimeout(hideDelay.value);
        }
        isHeaderHidden.value = false;
      }
      
      lastScrollY.value = currentScrollY;
      
      // Reset timer jika user scroll
      if (scrollTimeout.value) {
        clearTimeout(scrollTimeout.value);
      }
      
      // Sembunyikan header setelah 3 detik tidak scroll
      // hanya jika posisi scroll cukup jauh dari atas
      scrollTimeout.value = setTimeout(() => {
        if (currentScrollY > scrollThreshold + 100) {
          isHeaderHidden.value = true;
        }
      }, 3000);
    };
    
    // Fungsi untuk memunculkan header (dipanggil dari komponen lain)
    const showHeader = () => {
      // Batalkan semua timer yang berpotensi menyembunyikan header
      if (hideDelay.value) {
        clearTimeout(hideDelay.value);
      }
      if (scrollTimeout.value) {
        clearTimeout(scrollTimeout.value);
      }
      
      isHeaderHidden.value = false;
      
      // Reset timer baru untuk auto-hide
      scrollTimeout.value = setTimeout(() => {
        if (window.scrollY > scrollThreshold + 100) {
          isHeaderHidden.value = true;
        }
      }, 4000); // Waktu lebih lama agar header tetap muncul setelah interaksi
    };
    
    // Tambahkan event listener saat komponen di-mount
    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
      
      // Tambahkan event listener untuk keyboard navigation
      window.addEventListener('keydown', (e) => {
        // Show header when Tab key is pressed (for keyboard navigation)
        if (e.key === 'Tab') {
          showHeader();
        }
      });
    });
    
    // Bersihkan event listener saat komponen di-unmount
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', (e) => {
        if (e.key === 'Tab') showHeader();
      });
      
      if (scrollTimeout.value) {
        clearTimeout(scrollTimeout.value);
      }
      if (hideDelay.value) {
        clearTimeout(hideDelay.value);
      }
    });
    
    return {
      isHeaderHidden,
      showHeader
    };
  }
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
  transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 1280px; 
  margin: 0 auto; 
  width: 100%;
}

/* Kelas untuk header tersembunyi */
.depth-frame.hidden {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}

/* Trigger untuk memunculkan kembali header */
.header-trigger {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 15px;
  z-index: 99;
  cursor: pointer;
  background: linear-gradient(rgba(255,255,255,0.8), transparent);
  transition: height 0.3s ease, background 0.3s ease;
}

.header-trigger:hover {
  height: 20px;
  background: linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.6), transparent);
}

.header-trigger:focus {
  outline: none;
  height: 20px;
  background: linear-gradient(rgba(4, 163, 230, 0.1), transparent);
}

.depth-frame .depth-frame-wrapper {
  align-items: flex-start;
  display: flex;
  gap: 16px;
  justify-content: flex-start;
  width: 141px;
}

.depth-frame .div-wrapper {
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
  transition: color 0.3s ease;
}

.logo:hover {
  color: #04a3e6;
}

.nav-link {
  color: #111416;
  font-family: "Lexend-Medium", Helvetica;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  line-height: 21px;
  transition: color 0.3s ease;
  padding: 6px 8px;
  border-radius: 4px;
}

.nav-link:hover {
  color: #04a3e6;
  background-color: rgba(4, 163, 230, 0.05);
}

.nav-link:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(4, 163, 230, 0.2);
}

/* Tambahkan indikator active link */
.router-link-active {
  color: #04a3e6;
  font-weight: 600;
}

@media (max-width: 900px) {
  .depth-frame {
    padding: 12px 24px;
  }
  
  .depth-frame .div-2 {
    gap: 20px;
    margin-right: 20px;
  }
}

@media (max-width: 768px) {
  .depth-frame {
    flex-direction: column;
    padding: 12px 20px;
  }
  
  .depth-frame .div {
    flex-direction: column;
    width: 100%;
    margin-top: 12px;
  }
  
  .depth-frame .div-2 {
    flex-direction: column;
    width: 100%;
    height: auto;
    margin-right: 0;
    gap: 12px;
  }
  
  .depth-frame .div-wrapper {
    width: 100%;
    text-align: center;
  }
  
  .nav-link {
    display: block;
    padding: 8px;
    width: 100%;
  }
  
  .header-trigger {
    height: 12px;
  }
  
  .header-trigger:hover {
    height: 18px;
  }
}
</style>