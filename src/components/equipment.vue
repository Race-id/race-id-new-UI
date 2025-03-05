<template>
  <Header />
  
    <div class="coming-soon-container">
      <div class="content-wrapper">
        <h1 class="title">Race.id Equipment Store</h1>
        <p class="subtitle">Get ready for the ultimate running gear experience. Coming to elevate your run.</p>
        
        <form class="notify-form" @submit.prevent="submitNotification">
          <input type="email" class="notify-input" placeholder="Enter your email" v-model="email" required>
          <button type="submit" class="notify-button">Notify Me</button>
        </form>
  
        <div class="waitlist-section">
          <div class="early-bird-banner">
            <span class="sparkle">✨</span>
            <h3>Early Bird Special Offer</h3>
            <span class="sparkle">✨</span>
          </div>
          
          <div class="waitlist-benefits">
            <div v-for="benefit in benefits" :key="benefit.icon" class="benefit-item">
              <span class="benefit-icon">{{ benefit.icon }}</span>
              <p>{{ benefit.text }}</p>
            </div>
          </div>
  
          <div class="waitlist-counter">
            <p>Join <span id="waitlist-count">{{ waitlistCount }}</span> runners on the waitlist!</p>
            <div class="progress-bar">
              <div class="progress" :style="{ width: progressWidth + '%' }"></div>
            </div>
            <p class="slots-left">Only <strong>{{ remainingSlots }}</strong> slots left!</p>
          </div>
        </div>
  
        <div class="countdown">
          <div v-for="(unit, index) in countdownUnits" :key="index" class="countdown-item">
            <div class="countdown-number">{{ unit.value }}</div>
            <div class="countdown-label">{{ unit.label }}</div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </template>
  
  <script>

  import Header from '@/components/header.vue'
  import Footer from '@/components/footer.vue'
  export default {
    name: 'Equipment',
    components: {
      Header,
      Footer
    },
    data() {
      return {
        email: '',
        waitlistCount: 480,
        targetCount: 486,
        benefits: [
          { icon: '🎁', text: '20% Off First Purchase' },
          { icon: '⭐', text: 'Exclusive Member Preview' },
          { icon: '🏃', text: 'Free Running Socks' }
        ],
        countdownUnits: [
          { value: '00', label: 'Days' },
          { value: '00', label: 'Hours' },
          { value: '00', label: 'Minutes' },
          { value: '00', label: 'Seconds' }
        ],
        launchDate: null
      }
    },
    computed: {
      remainingSlots() {
        return 1000 - this.waitlistCount
      },
      progressWidth() {
        return (this.waitlistCount / 1000) * 100
      }
    },
    methods: {
      submitNotification() {
        alert(`Thank you! We'll notify ${this.email} when we launch.`)
        this.email = ''
      },
      incrementCounter() {
        if (this.waitlistCount < this.targetCount) {
          this.waitlistCount++
          setTimeout(this.incrementCounter, 50)
        }
      },
      updateCountdown() {
        const now = new Date().getTime()
        const distance = this.launchDate - now
  
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
  
        this.countdownUnits = [
          { value: days.toString().padStart(2, '0'), label: 'Days' },
          { value: hours.toString().padStart(2, '0'), label: 'Hours' },
          { value: minutes.toString().padStart(2, '0'), label: 'Minutes' },
          { value: seconds.toString().padStart(2, '0'), label: 'Seconds' }
        ]
      }
    },
    mounted() {
      this.launchDate = new Date()
      this.launchDate.setMonth(this.launchDate.getMonth() + 1)
      
      setTimeout(this.incrementCounter, 2000)
      this.updateCountdown()
      setInterval(this.updateCountdown, 1000)
    }
  }
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
  body {
  font-family: 'Montserrat', sans-serif;
}
  .coming-soon-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #000000, #1a1a1a);
    color: white;
    padding: 20px;
  }
  
  .content-wrapper {
    text-align: center;
    max-width: 800px;
  }
  
  .title {
    font-family: 'Libre Franklin', sans-serif;
    font-weight: 700;
    font-size: 3.5em;
    margin-bottom: 20px;
    animation: fadeInDown 1s ease;
  }
  
  .subtitle {
    font-family: 'Libre Franklin', sans-serif;
    font-weight: 300;
    font-size: 1.5em;
    margin-bottom: 40px;
    color: #888;
    animation: fadeInUp 1s ease 0.3s both;
  }
  
  .notify-form {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 30px;
    animation: fadeIn 1s ease 0.6s both;
  }
  
  .notify-input {
    padding: 15px 20px;
    width: 300px;
    border: none;
    border-radius: 25px;
    font-size: 1em;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transition: all 0.3s ease;
  }
  
  .notify-input:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.2);
  }
  
  .notify-button {
    padding: 15px 30px;
    border: none;
    border-radius: 25px;
    background: #04a3e6;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.3s ease;
  }
  
  .notify-button:hover {
    transform: scale(1.05);
    background: #2154a5;
  }
  
  .countdown {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-top: 40px;
    animation: fadeIn 1s ease 0.9s both;
  }
  
  .countdown-item {
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 10px;
    min-width: 100px;
  }
  
  .countdown-number {
    font-size: 2em;
    font-weight: bold;
  }
  
  .countdown-label {
    font-size: 0.9em;
    color: #2154a5;
  }
  
  .waitlist-section {
    margin-top: 40px;
    animation: fadeIn 1s ease 1.2s both;
  }
  
  .early-bird-banner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .sparkle {
    font-size: 1.5em;
    animation: sparkle 1.5s infinite;
  }
  
  .waitlist-benefits {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin: 20px 0;
  }
  
  .benefit-item {
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
    width: 150px;
    transition: transform 0.3s ease;
  }
  
  .benefit-item:hover {
    transform: translateY(-5px);
  }
  
  .benefit-icon {
    font-size: 2em;
    margin-bottom: 10px;
    display: block;
  }
  
  .progress-bar {
    background: rgba(255, 255, 255, 0.1);
    height: 10px;
    border-radius: 5px;
    margin: 15px auto;
    width: 80%;
    max-width: 400px;
  }
  
  .progress {
    background: #2154a5;
    height: 100%;
    border-radius: 5px;
    transition: width 1s ease;
  }
  
  .slots-left {
    color: #ff4d4d;
    font-size: 0.9em;
  }
  
  @keyframes sparkle {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media screen and (max-width: 600px) {
  .title {
    font-size: 2em;
  }

  .subtitle {
    font-size: 1.2em;
  }

  .notify-form {
    flex-direction: column;
    padding: 0 20px;
  }

  .notify-input {
    width: 100%;
  }

  .countdown {
    flex-wrap: wrap;
    gap: 10px;
  }

  .countdown-item {
    min-width: 70px;
  }

  .waitlist-benefits {
    flex-direction: column;
    align-items: center;
  }

  .benefit-item {
    width: 80%;
  }
}
  </style>
  