<script setup>
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const images = ref([
  '/images/Hero banner 1.jpg',
  '/images/Hero banner 2.jpg',
  '/images/Hero banner 3.jpg'
]);

const router = useRouter();
const goToRacePage = () => {
  router.push('/race');
}

const currentImageIndex = ref(0);

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;
};

const setupIntersectionObserver = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
};

const reviews = ref ([
  {
    id: 1,
    name: "Michael Andalas",
    event: "Borobudur Marathon 2023",
    image: "/images/Man 1.jpg",
    text: "Great experience using Race.id! Found my perfect marathon and the registration process was smooth."
  },
  {
   id: 2,
   name: "Johnny Wibawa",
   event: "Jakarta Run Festival 2024",
   image: "/images/Man 2.jpg",
   text: "This website is a great platform for marathon runners! The user-friendly interface makes it easy to navigate."
  },
  {
    id: 3, 
    name: "Charlotte Lestari",
    event: "Padma Run 2023",
    image: "/images/Woman 1.jpg",
    text: "I love using Race.id! It's my go-to platform for finding and registering for marathons. The website is user-friendly!"
  },
  {
    id: 4,
    name: "Sarah Kusuma",
    event: "Pocari Sweat Run 2024",
    image: "/images/Woman 2.jpg",
    text: "An excellent marathon website! The registration process is quick and hassle-free."
  },
  {
    id: 5,
    name: "David Chen",
    event: "Bali Beach Run 2024",
    image: "/images/Man 3.jpg",
    text: "I've been using Race.id for years, and it's been a game-changer for me. The website is user-friendly, and I've found some amazing marathons through it."
  },
  {
    id: 6,
    name: "Jessica Lim",
    event: "Jakarta City Run 2025",
    image: "/images/Woman 3.png",
    text: "Fantastic marathon website! The design is clean and easy to navigate, making registration a breeze. I especially love the live race tracking and the motivational training guides. It’s a great resource for both first-time runners and seasoned athletes. Highly recommended!"
  }
]);

const currentReviewIndex = ref(0);
const isReviewPaused = ref(false);
const extendedReviews = computed(() => {
  return [...reviews.value, ...reviews.value.slice(0, 3)]; 
});

const nextReview = () => {
  if (!isReviewPaused.value) {
    if (currentReviewIndex.value >= reviews.value.length - 1) {
      isTransitioning.value = true;
      currentReviewIndex.value = 0;
    } else {
      currentReviewIndex.value++;
    }
  }
};

const isTransitioning = ref(false);

onMounted(() => {
  setInterval(nextImage, 4000);
  setInterval(nextReview, 3000);
  setupIntersectionObserver();
});
</script>

<template>
    <Header />
    <main class="container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div
        v-for="(image, index) in images" 
        :key="index" 
        :class="[
        `hero-image-${index}`,
        { 'active': currentImageIndex === index }
      ]"
    >
    </div>
    <div class ="hero-content animate-fade-in-up">
      <h1 class ="hero-title">Track Your Races Achieve Your Goals</h1>
      <p class="hero-description">All in one place with Race.id.</p>
      <div class="hero-buttons">
        <button class="button-primary" @click ="goToRacePage">Find Race</button>
        </div>
      </div>
      </section>

      <!-- How It Works -->
        <section class="how-it-works animate-on-scroll">
    <header class="section-header">
      <h2 class="section-title">How It Works</h2>
      <p class="section-description">Three simple steps to join a race</p>
    </header>
    <div class="steps-container">
      <div class="step">
        <div class="step-number">1</div>
        <h3>Find Your Race</h3>
        <p>Browse through our curated list of running events</p>
      </div>
      <div class="step">
        <div class="step-number">2</div>
        <h3>Register & Pay</h3>
        <p>Quick and secure registration process</p>
      </div>
      <div class="step">
        <div class="step-number">3</div>
        <h3>Run & Track</h3>
        <p>Get your kit and track your race progress</p>
      </div>
    </div>
  </section>

       <!-- Sorting by place -->
      <section class="place-section animate-on-scroll">
        <header class="section-header">
          <h2 class="section-title">Race Destination</h2>
          </header>
          <div class="place-container">
        <div class="place-box">
          <img src="/images/Jakarta.jpg" alt="Place 1" class="place-image">
          <h3 class="place-title">Jakarta</h3>
        </div>
        <div class="place-box">
          <img src="/images/Bandung.jpg" alt="Place 3" class="place-image">
          <h3 class="place-title">Bandung</h3>
        </div>
        <div class="place-box">
          <img src="/images/Bali.jpg" alt="Place 4" class="place-image">
          <h3 class="place-title">Bali</h3>
        </div>
        <div class="place-box">
          <img src="/images/Yogyakarta.jpg" alt="Place 5" class="place-image">
          <h3 class="place-title">Yogyakarta</h3>
        </div>
      </div>
    </section>
  
      <!-- Events Section -->
      <section class="events-section animate-on-scroll">
        <header class="section-header">
          <h2 class="section-title">Featured Events</h2>
          <p class="section-description">
            Explore upcoming marathons and races near you.
          </p>
        </header>
        <div class="event-cards">
          <!-- Event Card 1 -->
          <article class="event-card">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/08d0ab485cc1814120cd7772c2c2c2346b87effd"
              alt="Jakarta Marathon"
              class="event-image"
            />
            <div class="event-content">
              <h3 class="event-title">Jakarta Marathon</h3>
              <p class="event-description">
                Experience the vibrant capital in a unique running event.
              </p>
            </div>
          </article>
  
          <!-- Event Card 2 -->
          <article class="event-card">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/5c2a8cbbf5df9ce92fc715639482380b6400c2b1"
              alt="Bali Beach Run"
              class="event-image"
            />
            <div class="event-content">
              <h3 class="event-title">Bali Beach Run</h3>
              <p class="event-description">
                Sprint along the beautiful beaches of Bali in this scenic run.
              </p>
            </div>
          </article>
  
          <!-- Event Card 3 -->
          <article class="event-card">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/dfe65c20cae7b65537242c1498c938ae3bb6b743"
              alt="Bandung City Dash"
              class="event-image"
            />
            <div class="event-content">
              <h3 class="event-title">Bandung City Dash</h3>
              <p class="event-description">
                Run through the cool highlands of Bandung and enjoy the city's
                views.
              </p>
            </div>
          </article>
        </div>
      </section>
  
      <!-- Articles Section -->
      <section class="articles-section animate-on-scroll">
        <h2 class="section-title">Featured Articles</h2>
        <div class="article-cards">
          <!-- Article Card 1 -->
          <article class="article-card">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/244ef2d248f440e092ec9900644f73d5ca675bbb"
              alt="Running Shoes"
              class="article-image"
            />
            <div class="article-content">
              <h3 class="article-title">The 5 Best Running Shoes for Men</h3>
              <p class="article-description">
                Top picks for every type of runner.
              </p>
            </div>
          </article>
  
          <!-- Article Card 2 -->
          <article class="article-card">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8161d2801043f441c8ab641fa99c4386d6a9cdfa"
              alt="Marathon Training"
              class="article-image"
            />
            <div class="article-content">
              <h3 class="article-title">How I Ran a Marathon Without Training</h3>
              <p class="article-description">A personal journey of resilience.</p>
            </div>
          </article>
  
          <!-- Article Card 3 -->
          <article class="article-card">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/97cd308392422486456fb6e3526bccb05826f478"
              alt="Pre-race Nutrition"
              class="article-image"
            />
            <div class="article-content">
              <h3 class="article-title">What to Eat Before a Race</h3>
              <p class="article-description">
                Tips on fueling for peak performance.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section class="reviews-section animate-on-scroll">
        <header class="section-header">
          <h2 class="section-title">Reviews</h2>
          <p class="section-description">Hear from our community</p>
        </header>
        
        <div class="review-slider" 
       @mouseenter="isReviewPaused = true"
       @mouseleave="isReviewPaused = false"
       @touchstart="isReviewPaused = true"
       @touchend="isReviewPaused = false">
    <div class="review-cards" 
         :class="{ 'no-transition': isTransitioning }"
         :style="{ transform: `translateX(-${currentReviewIndex * 33.33}%)` }"
         @transitionend="isTransitioning = false">
      <article v-for="review in extendedReviews" 
               :key="`${review.id}-${review.name}`"
               class="review-card">
        <div class="reviewer-info">
          <img :src="review.image" :alt="review.name" class="reviewer-avatar">
          <div class="reviewer-details">
            <h3 class="reviewer-name">{{ review.name }}</h3>
            <p class="reviewer-location">{{ review.event }}</p>
          </div>
        </div>
        <p class="review-text">"{{ review.text }}"</p>
      </article>
    </div>
    </div>
      </section>

        <!-- Newsletter Section -->
  <section class="newsletter-section animate-on-scroll">
    <div class="newsletter-container">
      <div class="newsletter-content">
        <h2 class="newsletter-title">Get Updates on Latest Races</h2>
        <p class="newsletter-description">Subscribe to our newsletter and never miss any running events</p>
        <div class="newsletter-form">
          <input type="email" placeholder="Enter your email" class="newsletter-input">
          <button class="newsletter-button">Subscribe</button>
        </div>
      </div>
    </div>
  </section>
    </main>
    <Footer />
  </template>
  
  <style scoped>

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .animate-slide-in {
    animation: slideInLeft -.6s ease-out forwards;
  }

  .animate-scale-in {
    animation: scaleIn 0.5s ease-out forwards;
  }

  .animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.animate-on-scroll.animate-in {
  opacity: 1;
  transform: translateY(0);
}

  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  .delay-400 { animation-delay: 400ms; }

  /* Main Container */
  .container {
    font-family: "Plus Jakarta Sans", sans-serif;
    max-width: 1280px;
    margin: 0 auto;
    background-color: #fff;
  }
  
  /* Hero Section */
  .hero-section {
    height: 480px;
    border-radius: 8px;
    margin: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

  .hero-image-0,
  .hero-image-1,
  .hero-image-2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 1s ease-in-out;
    background-size: cover;
    background-position: center;
  }

  .hero-image-0.active,
  .hero-image-1.active,
  .hero-image-2.active {
    opacity: 1;
  }

  .hero-image-0 {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.7) 100%),
    url("/images/Hero banner 1.jpg") lightgray 50% / cover no-repeat;
}

.hero-image-1 {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.7) 100%),
    url("/images/Hero banner 2.jpg") lightgray 50% / cover no-repeat;
}

.hero-image-2 {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.7) 100%),
    url("/images/Hero banner 3.jpg") lightgray 50% / cover no-repeat;
}
  
  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    color: #fff;
    max-width: 689px;
    padding: 0 20px;
    animation: fadeInUp 0.8s ease-out;
  }

    .hero-title {
    font-size: 48px;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 16px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .hero-description {
    font-size: 18px;
    line-height: 1.6;
    margin-bottom: 32px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .hero-buttons {
    font-size: 18px;
    line-height: 1.6;
    margin-bottom: 32px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .button-primary {
    background: #04a3e6;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .button-primary:hover {
    background: #283f95;
  }

    /* How It Works Section */
  .how-it-works {
    padding: 40px 16px;
    background-color: #f8f9fa;
    border-radius: 8px;
    margin: 16px;
  }

  .steps-container {
    display: flex;
    gap: 24px;
    margin-top: 32px;
    justify-content: center;
  }

  .step {
    opacity: 0;
    animation: slideInLeft 0.6s ease-out forwards;
  }

  .step:nth-child(1) { animation-delay: 200ms; }
  .step:nth-child(2) { animation-delay: 400ms; }
  .step:nth-child(3) { animation-delay: 600ms; }

  .step-card {
    flex: 1;
    max-width: 320px;
    text-align: center;
    padding: 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .step-icon {
    width: 48px;
    height: 48px;
    background: #04a3e6;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    font-size: 24px;
    font-weight: 700;
  }

  .step-title {
    color: #141414;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .step-description {
    color: #3d4d5c;
    font-size: 14px;
    line-height: 1.6;
  }


  /* Place section */
    .place-section {
    padding: 40px 16px;
  }

  .place-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
  }

  .place-box {
    width: 272.33px;
    height: 272.33px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    transition: transform 0.3s ease;
    opacity: 0;
    animation: scaleIn 0.5s ease-out forwards;
  }

  .place-box:nth-child(1) { animation-delay: 100ms; }
  .place-box:nth-child(2) { animation-delay: 200ms; }
  .place-box:nth-child(3) { animation-delay: 300ms; }
  .place-box:nth-child(4) { animation-delay: 400ms; }


  .place-box:hover {
    transform: translateY(-5px);
  }

  .place-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .place-title {
    position: absolute;
    bottom: 16px;
    left: 16px;
    color: white;
    font-size: 24px;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  /* Events Section */
  .events-section {
    padding: 40px 16px;
  }
  
  .section-header {
    max-width: 720px;
    margin-bottom: 17px;
  }
  
  .section-title {
    color: #141414;
    font-size: 36px;
    font-weight: 800;
    line-height: 45px;
    letter-spacing: -1px;
    margin-bottom: 16px;
    margin-top: 0;
  }
  
  .section-description {
    color: #141414;
    font-size: 16px;
    line-height: 24px;
    margin: 0;
  }
  
  .event-cards {
    display: flex;
    gap: 12px;
  }
  
  /* Event Card */
  .event-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 12px;
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .event-card:nth-child(1) { animation-delay: 200ms; }
  .event-card:nth-child(2) { animation-delay: 400ms; }
  .event-card:nth-child(3) { animation-delay: 600ms; }
  
  .event-image {
    width: 100%;
    height: 169px;
    border-radius: 8px;
    object-fit: cover;
  }
  
  .event-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .event-title {
    color: #141414;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    margin: 0;
  }
  
  .event-description {
    color: #3d4d5c;
    font-size: 14px;
    line-height: 21px;
    margin: 0;
  }
  
  /* Articles Section */
  .articles-section {
    padding: 0 16px;
  }
  
  .section-title-2 {
    color: #141414;
    font-size: 22px;
    font-weight: 700;
    line-height: 28px;
    letter-spacing: -1px;
    margin-bottom: 16px;
    margin: 20px 0 12px;
  }
  
  .article-cards {
    display: flex;
    gap: 12px;
  }
  
  /* Article Card */
  .article-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 12px;
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .article-image {
    width: 100%;
    height: 169px;
    border-radius: 8px;
    object-fit: cover;
  }
  
  .article-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .article-title {
    color: #141414;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    margin: 0;
  }
  
  .article-description {
    color: #3d4d5c;
    font-size: 14px;
    line-height: 21px;
    margin: 0;
  }

  /* Reviews Section */
.reviews-section {
  padding: 40px 16px;
  background-color: #f8f9fa;
  margin: 40px 0;
  border-radius: 8px;
  overflow: hidden;
}

.review-slider {
  position: relative;
  overflow: hidden;
  padding: 20px 0;
}

.review-cards {
  display: flex;
  transition: transform 0.5s ease;
  gap: 24px;
  margin-top: 32px;
}

.review-cards.no-transition {
  transition: none;
}

.review-cards.resetting {
  transition: none;
}

.review-card {
  flex: 0 0 calc(33.33% - 16px);
  min-width: calc(33.33% - 16px);
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.reviewer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
}

.reviewer-name {
  font-size: 16px;
  font-weight: 600;
  color: #141414;
  margin: 0;
}

.reviewer-location {
  font-size: 14px;
  color: #3d4d5c;
  margin: 0;
}

.review-text {
  font-size: 14px;
  line-height: 1.6;
  color: #141414;
  margin: 0;
}

/* Newsletter Section */
.newsletter-section {
  padding: 40px 16px;
  display: flex;
  justify-content: center;
}

.newsletter-container {
  width: 844.67px;
  height: 235.33px;
  background: #fff;
  border-radius: 16px;
  padding: 32px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 2px solid #E5E7EB;
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation: scaleIn 0.6s ease-out forwards;
  animation-delay: 200ms;
}

.newsletter-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #04a3e6, #283f95);
}

.newsletter-title {
  color: #3d4d5c;
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 12px;
  position: relative;
  display: inline-block;
}

.newsletter-title {
  color: #141414;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
}

.newsletter-content {
  text-align: center;
  max-width: 600px;
}

.newsletter-description {
  color: #3d4d5c;
  font-size: 16px;
  margin-bottom: 24px;
}

.newsletter-form {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.newsletter-input {
  width: 320px;
  height: 48px;
  padding: 0 16px;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  transition: all 0.3s ease;
}

.newsletter-input:hover {
  border-color: #D1D5DB;
}

.newsletter-input:focus {
  outline: none;
  border-color: #04a3e6;
}

.newsletter-button {
  height: 48px;
  padding: 0 32px;
  background: #04a3e6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(4, 163, 230, 0.2);
}

.newsletter-button:hover {
  background: #283f95;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(40, 163, 149, 0.2);
}

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
  to {
    opacity: 1;
    transform: translateY(0);
  }
  }

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
  
  /* Responsive Styles */
  @media (max-width: 991px) {
    .event-cards,
    .article-cards {
      flex-direction: column;
    }
  
    .event-card,
    .article-card {
      width: 100%;
    }

    .place-container {
      gap: 12px;
    }

    .place-box {
      width: 100%;
      height: 180px;
    }

    .review-cards {
      flex: 0 0 calc(50% - 12px);
      min-width: calc(50% - 12px);
    }
  }
  
  @media (max-width: 640px) {
    .hero-title {
      font-size: 32px;
    }
    .hero-description {
      font-size: 16px;
    }

    .hero-buttons {
      flex-direction: column;
      gap: 12px;
    }

    .hero-section {
      height: 400px;
      margin: 8px;
    }
  
    .events-section,
    .articles-section {
      padding: 20px 8px;
    }
  
    .section-title {
      font-size: 28px;
      line-height: 36px;
    }
  
    .section-description {
      font-size: 14px;
      line-height: 20px;
    }
  
    .section-title-2 {
      font-size: 28px;
      line-height: 36px;
    }

    .place-box {
      width: 100%;
      height: 180px;
    }

    .reviews-section {
      padding: 24px 16px;
      margin: 24px 0;
    }

      .newsletter-section {
      padding: 32px 16px;
    }

    .newsletter-form {
      flex-direction: column;
    }

    .newsletter-input {
      width: 100%;
    }

    .review-card {
      flex: 0 0 100%;
      min-width: 100%
    }
  }

  @media (max-width: 880px) {
  .newsletter-container {
    width: 100%;
    height: auto;
    padding: 32px 24px;
  }

  .newsletter-form {
    flex-direction: column;
    align-items: center;
  }

  .newsletter-input {
    width: 100%;
    max-width: 320px;
  }

  .newsletter-button {
    width: 100%;
    max-width: 320px;
  }

  @media (max-width: 768px) {
  .steps-container {
    flex-direction: column;
    align-items: center;
  }

  .step-card {
    width: 100%;
  }
}
}
  </style>

