<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const places = ref([])
const loading = ref(true)

const loadPlaces = async () => {
  try {
    loading.value = true
    const location = route.query.location
    
    if (location) {
      // Search by location
      const response = await api.searchPlaces(location)
      places.value = response.data.data
    } else {
      // Get all places
      const response = await api.getAllPlaces()
      places.value = response.data.data
    }
  } catch (error) {
    console.error('Error loading places:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPlaces()
})
</script>