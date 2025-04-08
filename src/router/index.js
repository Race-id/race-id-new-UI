import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/home.vue'
import Race from '../components/race.vue'
import Articles from '../components/articles.vue'
import Equipment from '../components/equipment.vue'
import FAQ from '../components/faq.vue'
import AboutUs from '../components/about-us.vue'
import UpcomingEvents from '@/components/upcoming-events.vue'
import PastEvents from '@/components/past-events.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Race.id - Home'
    }
  },
  {
    path: '/race',
    name: 'Race',
    component: Race,
    meta: {
      title: 'Race.id - Race'
    }
  },
  {
    path: '/upcoming-events',
    name: 'UpcomingEvents',
    component: UpcomingEvents
  },
  {
    path: '/past-events',
    name: 'PastEvents',
    component: PastEvents
  },
  {
    path: '/articles',
    name: 'Articles',
    component: Articles,
    meta: {
      title: 'Race.id - Articles'
    }
  },
  {
    path: '/equipment',
    name: 'Equipment',
    component: Equipment,
    meta: {
      title: 'Coming soon!'
    }
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: FAQ,
    meta: {
      title: 'FAQ'
    }
  },
  {
    path: '/about-us',
    name: 'AboutUs',
    component: AboutUs,
    meta: {
    title: 'About Us'
  }
  },
  {
    path: '/race-detail/:id',
    name: 'RaceDetail',
    component: () => import('@/components/race-detail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.name === from.name) {
      return
    }
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Race.id'
  next()
})

export default router
