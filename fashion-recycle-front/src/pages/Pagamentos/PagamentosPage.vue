<template>
  <div>
    <v-container>
      <v-card color="disabledGrey" outlined> </v-card>

      <div class="text-center ma-2"></div>
      <CadastrarPagamento />
    </v-container>
  </div>
</template>

<script>
import CadastrarPagamento from "@/components/Pagamentos/CadastrarPagamento.vue";

export default {
  name: "VendasPage",
  components: { CadastrarPagamento },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
