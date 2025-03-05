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

const filterFAQs = () => {
  return true
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

  body, .faq-container {
    font-family: 'Poppins', sans-serif;
}
  
  main {
    animation: fadeSlideIn 0.5s ease-out;
  }
  
  .faq-container {
    animation: fadeSlideIn 0.5s ease-out;
    max-width: 900px;
    margin: 60px auto;
    padding: 0 20px;
  }
  
  @keyframes fadeSlideIn {
    0% {
      opacity: 0;
      transform: translateX(-20px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .faq-header {
    text-align: center;
    margin-bottom: 50px;
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
  }
  
  .category-btn {
    padding: 10px 20px;
    border: none;
    background: white;
    border-radius: 25px;
    cursor: pointer;
    font-family: 'Libre Franklin', sans-serif;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  }
  
  .category-btn.active {
    background: #333;
    color: white;
  }
  
  .faq-item {
    background: white;
    border-radius: 12px;
    margin-bottom: 15px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    overflow: hidden;
    opacity: 1;
    transform: translateY(0);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .faq-question {
    padding: 20px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .faq-question:hover {
    background: #f9f9f9;
  }
  
  .faq-answer {
    padding: 0 20px;
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s ease;
    color: #666;
  }
  
  .faq-answer.active {
    padding: 20px;
    max-height: 500px;
  }
  
  .toggle-icon {
    font-size: 1.2em;
    transition: transform 0.3s ease;
  }
  
  .faq-item.active .toggle-icon {
    transform: rotate(45deg);
  }
  
  .search-box {
    margin-bottom: 30px;
    text-align: center;
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
  }

  .search-input-container {
    position: relative;
    display: inline-block;
    width: 100%;
    max-width: 500px;
  }

  .reset-button {
  position: absolute;
  right: 10px;
  left: 445px;
  bottom: 40%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  z-index: 1;
}


  .reset-button:hover {
    color: #333;
  }

  </style>
  