<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import memberDashboard from './member'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard, memberDashboard },
  data() {
    return {
      currentRole: 'memberDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (this.roles.includes('doctor')) {
      this.currentRole = 'editorDashboard'
    } else if (this.roles.includes('admin')) {
      this.currentRole = 'adminDashboard'
    } else {
      this.currentRole = 'memberDashboard'
    }
  }
}
</script>
