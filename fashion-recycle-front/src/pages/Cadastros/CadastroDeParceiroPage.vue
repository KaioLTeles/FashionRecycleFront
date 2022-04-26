<template>
  <div>
    <v-container>
      <v-card color="disabledGrey" outlined> </v-card>

      <div class="text-center ma-2"></div>
      <CadastroParceiro />
    </v-container>
  </div>
</template>

<script>
import CadastroParceiro from "@/components/Cadastros/Parceiro/CadastroParceiro";

export default {
  components: { CadastroParceiro },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
