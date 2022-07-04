<template>
  <div>
    <v-card class="margin-bottom-1-em">
      <v-card-title>
        <v-toolbar-title class="title">Cadastro de Fornecedor</v-toolbar-title>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              dense
              type="number"
              label="Codigo Fornecedor"
              v-model="codigoFilter"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              dense
              label="Nome"
              v-model="nomeFilter"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              dense
              label="CPF"
              type="number"
              v-model="cpfFilter"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn color="btnPrimary" @click="pesquisar()"> Pesquisar </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-actions>
        <v-col class="text-right">
          <v-btn @click="criarParceiro()" dark color="btnPrimary">Novo</v-btn>
        </v-col>
      </v-card-actions>

      <v-card-text>
        <v-data-table
          :headers="headers"
          item-key="codigo"
          :items="listaParceiros"
          :loading="loadingDataTable"
        >
          <template v-slot:[`item.action`]="{ item }">
            <v-icon color="btnPrimary" @click.stop="alterarParceiro(item)"
              >mdi-pencil</v-icon
            >
          </template>
          <template v-slot:[`item.active`]="{ item }">
            <v-simple-checkbox
              v-model="item.active"
              disabled
            ></v-simple-checkbox>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <CadastroDeParceiroModal
      v-model="mostrarJanela"
      :codigoParceiro="codigoParceiro"
      @resetarCodigoParceiro="resetarCodigoParceiro"
    />
  </div>
</template>

<script>
import CadastroDeParceiroModal from "./CadastroDeParceiroModal";

import { BUSCARTODOSOSPARCEIROS } from "@/store/types/ParceiroType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

export default {
  components: { CadastroDeParceiroModal },
  data() {
    return {
      headers: [
        { text: "Código", value: "id" },
        { text: "Nome", value: "name" },
        { text: "Telefone", value: "phoneNumber" },
        { text: "Email", value: "email" },
        { text: "CPF", value: "cpf" },
        { text: "Ativo", value: "active" },
        { text: "Ações", value: "action", sortable: false },
      ],
      mostrarJanela: false,
      codigoFilter: "",
      nomeFilter: "",
      cpfFilter: "",
      cnpjFilter: "",
      codigoParceiro: 0,
      loadingDataTable: false,
    };
  },
  methods: {
    criarParceiro() {
      this.mostrarJanela = true;
    },
    alterarParceiro(item) {
      this.codigoParceiro = item.id;
      this.mostrarJanela = true;
    },
    pesquisar() {
      let payload = {
        id: parseInt(this.codigoFilter),
        name: this.nomeFilter,
        cpf: this.cpfFilter,
        cnpj: this.cnpjFilter,
      };

      this.loadingDataTable = true;

      this.buscarParcieros(payload);
    },
    async buscarParcieros(payload) {
      await this.$store
        .dispatch(BUSCARTODOSOSPARCEIROS, payload)
        .then(() => {
          this.loadingDataTable = false;
        })
        .catch((error) => {
          if (error) {
            this.loadingDataTable = false;
            let payload = {
              message: "Ocorreu um erro ao carregar os dados de cliente",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
    },
    resetarCodigoParceiro() {
      this.codigoParceiro = 0;
    },
  },
  created() {},
  computed: {
    listaParceiros() {
      return this.$store.state.ParceiroStore.parceirosList;
    },
  },
};
</script>

<style scoped>
.margin-bottom-1-em {
  margin-bottom: 0.5em;
}
</style>
