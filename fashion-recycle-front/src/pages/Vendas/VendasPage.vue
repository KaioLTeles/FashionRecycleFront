<template>
  <div>
    <v-container>
      <v-card color="disabledGrey" outlined> </v-card>

      <div class="text-center ma-2"></div>
      <RegistroDeVenda />
    </v-container>
  </div>
</template>

<script>
import RegistroDeVenda from "@/components/Vendas/RegistroDeVenda.vue";

export default {
  name: "VendasPage",
  components: { RegistroDeVenda },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
