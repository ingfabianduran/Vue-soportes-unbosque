<template>
  <div class="error503">
    <Error503/>
  </div>
</template>

<script>
// @ is an alias to /src
import Error503 from '@/components/Error503.vue'

export default {
  name: 'error503',
  components: {
    Error503
  }
}
</script>