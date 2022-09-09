<template>
  <div>
    <v-container>
      <v-card color="disabledGrey" outlined> </v-card>

      <div class="text-center ma-2"></div>
      <RecebimentosList />
    </v-container>
  </div>
</template>

<script>
import RecebimentosList from "@/components/Recebimentos/RecebimentosList.vue";

export default {
  name: "ContasReceber",
  components: { RecebimentosList },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
