<template>
  <div class="dashboard-editor-container">
    <div>普通会员无法访问后台管理系统</div>
  </div>
</template>

<script>

export default {
  name: 'DashboardMember'
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: fixed;
  width: 100%;
  height: 100vh;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
