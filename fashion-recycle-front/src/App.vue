<template>
  <v-app>
    <Header />
    <v-main justify="center">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Header from './components/Shared/Header'

export default {
  name: "App",
  components: { Header },
};
</script>
<style>
#nprogress .bar {
  background: #4caf50 !important;
}
</style>
