<template>
  <div>
    <v-container>
      <v-card color="disabledGrey" outlined> </v-card>

      <div class="text-center ma-2"></div>
      <RelatorioContasPagar />
    </v-container>
  </div>
</template>

<script>
import RelatorioContasPagar from "@/components/Relatorios/RelatorioContasPagar.vue";

export default {
  name: "CadastroDeClientePage",
  components: { RelatorioContasPagar },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
