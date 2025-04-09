<script setup>
import { ref, computed } from 'vue'
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'
const searchQuery = ref('')
const activeCategory = ref('All')
const categories = ref(['All', 'Events', 'Payment'])

const resetSearch = () => {
  searchQuery.value = ''
}

const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

const faqs = ref([
  {
    question: 'Apa itu Race.id?',
    answer: 'Race.id adalah platform yang menyediakan kalender event lari di Indonesia, termasuk informasi pendaftaran, jadwal, lokasi, kategori lomba, dan detail lainnya tentang berbagai ajang lari seperti maraton, ultra-maraton, dan fun run.',
    category: 'Events',
    isOpen: false
  },
  {
    question: 'Bagaimana caranya melihat daftar event lari yang tersedia?',
    answer: 'Bisa membuka menu "Race" yang ada di bagian atas halaman, setelah itu akan muncul daftar event lari yang tersedia.',
    category: 'Events',
    isOpen: false
  },
  {
    question: 'Apakah Race.id menyelenggarakan event sendiri?',
    answer: 'Tidak, Race.id adalah platform yang membantu penyelenggara event dalam mempromosikan dan mengelola pendaftaran. Namun, kami bekerja sama dengan berbagai penyelenggara untuk memastikan event berjalan dengan baik.',
    category: 'Events',
    isOpen: false
  },
  {
    question: 'Apakah Race.id menyediakan informasi event lari di luar Indonesia?',
    answer: 'Saat ini, Race.id berfokus pada event lari di Indonesia.',
    category: 'Events',
    isOpen: false
  },
  {
    question: 'Bagaimana caranya saya mendaftar untuk sebuah event?',
    answer: 'Untuk mendaftar, silakan kunjungi halaman event yang ingin Anda ikuti dan klik tombol "Daftar". Lengkapi formulir pendaftaran dan ikuti instruksi yang diberikan.',
    category: 'Payment',
    isOpen: false
  },
  {
    question: 'Apa saja metode pembayaran yang diterima?',
    answer: 'Kami menerima berbagai metode pembayaran termasuk kartu kredit, transfer bank, dan e-wallet seperti GoPay dan OVO.',
    category: 'Payment',
    isOpen: false
  },
  {
    question: 'Apa saya bisa membatalkan pendaftaran setelah pembayaran?',
    answer: 'Kebijakan pembatalan tergantung pada masing-masing penyelenggara event. Umumnya, biaya pendaftaran tidak dapat dikembalikan setelah pembayaran dilakukan. Silakan cek syarat dan ketentuan pada halaman event yang Anda pilih.',
    category: 'Payment',
    isOpen: false
  },
  {
    question: 'Bagaimana jika saya tidak menerima email konfirmasi setelah mendaftar?',
    answer: 'Jika Anda tidak menerima email konfirmasi dalam waktu 24 jam setelah pembayaran, cek folder Spam atau Promosi di email Anda. Jika masih belum ada, hubungi tim Race.id melalui halaman Bantuan atau kontak penyelenggara event.',
    category: 'Payment',
    isOpen: false
  },
  {
    question: 'Bagaimana cara mendapatkan race pack setelah mendaftar?',
    answer: 'Informasi tentang pengambilan race pack akan diinformasikan oleh penyelenggara melalui email atau diumumkan di halaman event. Biasanya, race pack dapat diambil secara langsung di lokasi yang telah ditentukan sebelum hari lomba.',
    category: 'Events',
    isOpen: false
  }
])

const filteredFAQs = computed(() => {
  return faqs.value.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = activeCategory.value === 'All' || faq.category === activeCategory.value
    return matchesSearch && matchesCategory
  })
})

const toggleFAQ = (index) => {
  const targetFAQ = filteredFAQs.value[index]
  const originalIndex = faqs.value.findIndex(faq => faq.question === targetFAQ.question)
  
  faqs.value = faqs.value.map((faq, i) => ({
    ...faq,
    isOpen: i === originalIndex ? !faq.isOpen : false
  }))
}

const filterByCategory = (category) => {
  activeCategory.value = category
}
</script>

<template>
  <Header />
    <div class="faq-container">
      <div class="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Temukan jawaban untuk pertanyaan yang biasa ditanyakan seputar Race.id</p>
      </div>
  
      <div class="search-box">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Cari pertanyaan..."
          v-model="searchQuery"
          @input="debounce(filterFAQs, 300)"
        >
        <button 
      v-if="searchQuery" 
      class="reset-button"
      @click="resetSearch"
    >
      ×
    </button>
      </div>
  
      <div class="faq-categories">
        <button 
          v-for="category in categories" 
          :key="category"
          :class="['category-btn', { active: activeCategory === category }]"
          @click="filterByCategory(category)"
        >
          {{ category }}
        </button>
      </div>
  
      <div class="faq-list">
        <div 
          v-for="(faq, index) in filteredFAQs" 
          :key="index"
          :class="['faq-item', { active: faq.isOpen }]"
          :data-category="faq.category"
        >
          <div class="faq-question" @click="toggleFAQ(index)">
            {{ faq.question }}
            <span class="toggle-icon">+</span>
          </div>
          <div :class="['faq-answer', { active: faq.isOpen }]">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </template>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

.faq-container {
  font-family: 'Poppins', sans-serif;
  max-width: 900px;
  margin: 60px auto;
  padding: 0 20px;
  animation: fadeSlideIn 0.5s ease-out;
}

@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.faq-header {
  text-align: center;
  margin-bottom: 50px;
  animation: slideDown 0.6s ease-out forwards;
}

.faq-header h1 {
  font-size: 2.5em;
  color: #333;
  margin-bottom: 15px;
}

.faq-header p {
  color: #666;
  font-size: 1.1em;
}

.faq-categories {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  animation: fadeSlideIn 0.5s ease-out 0.4s both;
}

.category-btn {
  padding: 10px 20px;
  border: none;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  font-family: 'Libre Franklin', sans-serif;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.category-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.category-btn.active {
  background: #617afa;
  color: white;
  transform: translateY(-2px);
}

.faq-item {
  background: white;
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  overflow: hidden;
  opacity: 1;
  transform: translateY(0);
  animation: fadeSlideIn 0.5s ease-out backwards;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-item:nth-child(1) { animation-delay: 0.5s; }
.faq-item:nth-child(2) { animation-delay: 0.6s; }
.faq-item:nth-child(3) { animation-delay: 0.7s; }
.faq-item:nth-child(4) { animation-delay: 0.8s; }
.faq-item:nth-child(5) { animation-delay: 0.9s; }

.faq-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.faq-question {
  padding: 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-question:hover {
  background: #f9f9f9;
}

.faq-answer {
  padding: 0 20px;
  max-height: 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  color: #666;
  opacity: 0;
  transform: translateY(-10px);
}

.faq-answer.active {
  padding: 20px;
  max-height: 500px;
  opacity: 1;
  transform: translateY(0);
}

.toggle-icon {
  font-size: 1.2em;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-item.active .toggle-icon {
  transform: rotate(45deg) scale(1.2);
}

.search-box {
  margin-bottom: 30px;
  text-align: center;
  animation: scaleIn 0.5s ease-out 0.3s both;
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: 15px 25px;
  border: none;
  border-radius: 25px;
  font-size: 1em;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  padding-right: 40px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input:focus {
  transform: scale(1.02);
  box-shadow: 0 4px 20px rgba(97, 122, 250, 0.15);
}

.search-input-container {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 500px;
}

.reset-button {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  padding: 5px;
  transition: all 0.3s ease;
}

.reset-button:hover {
  color: #333;
  transform: rotate(90deg);
}
</style>
