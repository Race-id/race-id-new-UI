<script setup>
import { ref, reactive } from 'vue'
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'

const isPartnershipModalVisible = ref(false)
const isEOModalVisible = ref(false)

const infoCards = reactive([
  {
    title: 'Visi Kami',
    content: 'Menjadi platform terpercaya yang menginspirasi dan mendukung komunitas pelari Indonesia untuk mencapai potensi terbaik mereka.'
  },
  {
    title: 'Misi Kami',
    content: 'Menyediakan akses mudah ke event lari berkualitas, informasi terpercaya, dan produk terbaik untuk mendukung perjalanan lari Anda.'
  },
  {
    title: 'Layanan Kami',
    content: 'Event Management untuk komunitas pelari Indonesia.'
  },
  {
    title: 'Lokasi',
    content: `<a href="https://maps.app.goo.gl/1hQPwaaTqHspL6Qy5" target="_blank" style="text-decoration: none; color: black;">Equity Tower 17th Floor. SCBD Jakarta Selatan Jl. Jend. Sudirman Kav. 52-53 DKI Jakarta 12190</a><br><br>
      <a href="mailto:info@steelytoe.com" style="text-decoration: none; color: black;">Email: info@steelytoe.com</a><br>
      <a href="tel:+6221 5151392" style="text-decoration: none; color: black;">Tel: +62 21 5151 392</a>`
  }
])

const partnershipForm = reactive({
  companyName: '',
  businessType: '',
  contactPerson: '',
  email: '',
  phone: '',
  proposal: ''
})

const eoForm = reactive({
  orgName: '',
  picName: '',
  position: '',
  email: '',
  phone: '',
  portfolio: '',
  eventPlans: '',
  whyRaceId: ''
})

const closePartnershipModal = () => {
  isPartnershipModalVisible.value = false
}

const closeEOModal = () => {
  isEOModalVisible.value = false
}

const submitPartnershipForm = () => {
  alert('Thank you for your interest! We will review your proposal and contact you soon.')
  isPartnershipModalVisible.value = false
  Object.keys(partnershipForm).forEach(key => {
    partnershipForm[key] = ''
  })
}

const submitEOForm = () => {
  alert('Thank you for your application! We will review it and contact you soon.')
  isEOModalVisible.value = false
  Object.keys(eoForm).forEach(key => {
    eoForm[key] = ''
  })
}
</script>



<template>
  <Header />
    <div class="about-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <h1 class="hero-title">About Race.id</h1>
        <p class="hero-subtitle">
          Platform komunitas lari terdepan di Indonesia yang menghubungkan pelari dengan event-event berkualitas dan produk terbaik untuk mendukung performa Anda.
        </p>
      </section>
  
      <!-- Content Grid -->
      <div class="content-grid">
      <div v-for="(card, index) in infoCards" 
           :key="index" 
           class="info-card"
           :style="`transition-delay: ${index * 0.2}s`">
        <h3 class="info-title">{{ card.title }}</h3>
        <p class="info-content" v-html="card.content"></p>
      </div>
    </div>
  
      <!-- Contact Section -->
      <!-- <section class="contact-section">
        <h2 class="contact-title">Mari Berkolaborasi</h2>
        <p>Tertarik untuk bekerjasama dengan Race.id?</p>
        <div class="contact-links">
          <a href="#" class="contact-link" @click.prevent="showPartnershipForm">Partnership</a>
          <a href="#" class="contact-link" @click.prevent="showEOForm">Event Organizer</a>
        </div>
      </section> -->
  
      <!-- Partnership Modal -->
      <div class="modal" v-if="isPartnershipModalVisible" @click.self="closePartnershipModal">
        <div class="modal-content">
          <span class="close-btn" @click="closePartnershipModal">×</span>
          <h2>Partnership Form</h2>
          <form class="partnership-form" @submit.prevent="submitPartnershipForm">
            <div class="form-group">
              <label>Company Name</label>
              <input type="text" v-model="partnershipForm.companyName" required>
            </div>
            <div class="form-group">
              <label>Business Type</label>
              <select v-model="partnershipForm.businessType" required>
                <option value="">Select Type</option>
                <option value="event">Event Organizer</option>
                <option value="brand">Brand/Sponsor</option>
                <option value="media">Media Partner</option>
              </select>
            </div>
            <div class="form-group">
              <label>Contact Person</label>
              <input type="text" v-model="partnershipForm.contactPerson" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="partnershipForm.email" required>
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" v-model="partnershipForm.phone" required>
            </div>
            <div class="form-group">
              <label>Partnership Proposal</label>
              <textarea rows="4" v-model="partnershipForm.proposal" placeholder="Tell us about your partnership idea"></textarea>
            </div>
            <button type="submit" class="submit-btn">Submit Proposal</button>
          </form>
        </div>
      </div>
  
      <!-- EO Modal -->
      <div class="modal" v-if="isEOModalVisible" @click.self="closeEOModal">
        <div class="modal-content">
          <span class="close-btn" @click="closeEOModal">×</span>
          <h2>Event Organizer Registration</h2>
          <form class="partnership-form" @submit.prevent="submitEOForm">
            <div class="form-group">
              <label>Organization Name</label>
              <input type="text" v-model="eoForm.orgName" required>
            </div>
            <div class="form-group half">
              <label>PIC Name</label>
              <input type="text" v-model="eoForm.picName" required>
            </div>
            <div class="form-group half">
              <label>Position</label>
              <input type="text" v-model="eoForm.position" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="eoForm.email" required>
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" v-model="eoForm.phone" required>
            </div>
            <div class="form-group">
              <label>Previous Events Portfolio</label>
              <textarea rows="4" v-model="eoForm.portfolio" placeholder="List your previous running events"></textarea>
            </div>
            <div class="form-group">
              <label>Upcoming Event Plans</label>
              <textarea rows="4" v-model="eoForm.eventPlans" placeholder="Tell us about your upcoming event plans"></textarea>
            </div>
            <div class="form-group">
              <label>Why Choose Race.id?</label>
              <textarea rows="4" v-model="eoForm.whyRaceId" placeholder="Tell us why you want to partner with Race.id"></textarea>
            </div>
            <button type="submit" class="submit-btn">Submit Application</button>
          </form>
        </div>
      </div>
    </div>
    <Footer />
  </template>
  
  
  <style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

body, .about-container {
  font-family: 'Poppins', sans-serif;
}

.about-container {
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

/* Enhanced Keyframes */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Hero Section Animations */
.hero-section {
  animation: slideUpFade 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.hero-title {
  animation: scaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

.hero-subtitle {
  animation: slideUpFade 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.5s both;
}

.hero-section {
    text-align: center;
    margin-bottom: 60px;
}

.hero-title {
    font-size: 2.5em;
    font-weight: 700;
    color: #333;
    margin-bottom: 20px;
}

.hero-subtitle {
    font-size: 1.2em;
    color: #666;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
}

/* Info Cards Enhanced Animation */
.info-card {
  opacity: 0;
  transform: translateY(30px);
  animation: slideUpFade 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.info-card:nth-child(1) { animation-delay: 0.6s; }
.info-card:nth-child(2) { animation-delay: 0.7s; }
.info-card:nth-child(3) { animation-delay: 0.8s; }
.info-card:nth-child(4) { animation-delay: 0.9s; }

.info-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.content-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
    margin-top: 40px;
}

.info-card {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    transition: transform 0.3s ease;
}

.info-card:hover {
    transform: translateY(-5px);
}

.info-title {
    font-size: 1.2em;
    font-weight: 600;
    color: #333;
    margin-bottom: 15px;
}

.info-content {
    color: #666;
    line-height: 1.6;
}

/* Modal Animations */
.modal {
  animation: fadeIn 0.3s ease-out;
  backdrop-filter: blur(8px);
}

.modal-content {
  animation: modalEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-40px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Form Input Animations */
.form-group input,
.form-group select,
.form-group textarea {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  border-color: #333;
}

/* Submit Button Animation */
.submit-btn {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.submit-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  background: #444;
}

.submit-btn:active {
  transform: translateY(-2px);
}

/* Close Button Animation */
.close-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.close-btn:hover {
  transform: rotate(90deg);
  color: #000;
}

/* Responsive Animations */
@media (max-width: 768px) {
  .info-card {
    animation-delay: 0.3s;
  }
  
  .modal-content {
    animation: slideUpFade 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

.contact-section {
    text-align: center;
    margin-top: 60px;
    padding: 40px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.contact-title {
    font-size: 1.8em;
    margin-bottom: 20px;
    color: #333;
}

.contact-links {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 20px;
}

.contact-link {
    color: #333;
    text-decoration: none;
    padding: 10px 20px;
    border: 1px solid #ddd;
    border-radius: 25px;
    transition: all 0.3s ease;
}

.contact-link:hover {
    background: #333;
    color: white;
    border-color: #333;
}

.modal {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 1000;
    overflow-y: auto;
    padding: 20px 0;
}

.modal-content {
    background: white;
    width: 90%;
    max-width: 600px;
    margin: 50px auto;
    padding: 30px;
    border-radius: 12px;
    position: relative;
    animation: slideDown 0.3s ease;
}

.close-btn {
    position: absolute;
    right: 20px;
    top: 20px;
    font-size: 24px;
    cursor: pointer;
    color: #666;
}

.no-underline {
    text-decoration: none !important;
    color: #333 !important;
}

.partnership-form {
    margin-top: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group.half {
    display: inline-block;
    width: 48%;
    margin-right: 2%;
}

.form-group.half:nth-child(even) {
    margin-right: 0;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-family: 'Libre Franklin', sans-serif;
}

.submit-btn {
    background: #333;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 25px;
    cursor: pointer;
    font-family: 'Libre Franklin', sans-serif;
    transition: all 0.3s ease;
}

.submit-btn:hover {
    background: #555;
    transform: translateY(-2px);
}


@keyframes slideDown {
    from {
        transform: translateY(-100px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@media (max-width: 768px) {
    .content-grid {
        grid-template-columns: 1fr;
    }
}

  </style>
