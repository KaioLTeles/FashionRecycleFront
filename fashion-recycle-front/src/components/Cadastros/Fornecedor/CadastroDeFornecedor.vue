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
              v-model="codigoFilter"
              label="Codigo Fornecedor"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              dense
              label="CNPJ"
              type="number"
              v-model="cnpjFilter"
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
          <v-btn @click="criarFornecedor()" dark color="btnPrimary">Novo</v-btn>
        </v-col>
      </v-card-actions>

      <v-card-text>
        <v-data-table
          :headers="headers"
          item-key="codigo"
          :loading="loadingDataTable"
          :items="fornecedorList"
        >
          <template v-slot:[`item.action`]="{ item }">
            <v-icon color="btnPrimary" @click.stop="alterarFornecedor(item)"
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
    <CadastroDeFornecedorModal
      v-model="mostrarJanela"
      :codigoFornecedor="codigoFornecedor"
      @resetarCodigoFornecedor="resetarCodigoFornecedor"
    />
  </div>
</template>

<script>
import CadastroDeFornecedorModal from "./CadastroDeFornecedorModal";

import {
  BUSCARTODOSFORNECEDORES,
  EMPTYFORNECEDOR,
} from "@/store/types/FornecedorType";

export default {
  components: { CadastroDeFornecedorModal },
  data() {
    return {
      headers: [
        { text: "Código", value: "id" },
        { text: "Razão Social", value: "legalCompanyName" },
        { text: "CNPJ", value: "cnpj" },
        { text: "Email", value: "email" },
        { text: "Telefone", value: "phoneNumber" },
        { text: "Ativo", value: "active" },
        { text: "Ações", value: "action", sortable: false },
      ],
      mostrarJanela: false,
      codigoFornecedor: 0,
      codigoFilter: "",
      cnpjFilter: "",
      loadingDataTable: false,
    };
  },
  methods: {
    criarFornecedor() {
      this.$store.commit(EMPTYFORNECEDOR);
      this.codigoFornecedor = 0;
      this.mostrarJanela = true;
    },
    alterarFornecedor(item) {
      this.codigoFornecedor = item.id;
      this.mostrarJanela = true;
    },
    resetarCodigoFornecedor() {
      this.codigoFornecedor = 0;
    },
    pesquisar() {
      let payload = {
        id: parseInt(this.codigoFilter == "" ? "0" : this.codigoFilter),
        cnpj: this.cnpjFilter,
      };

      this.loadingDataTable = true;

      this.buscarDadosFornecedor(payload);
    },
    async buscarDadosFornecedor(payload) {
      await this.$store
        .dispatch(BUSCARTODOSFORNECEDORES, payload)
        .then(() => {
          this.loadingDataTable = false;
        })
        .catch((error) => {
          if (error) {
            this.loadingDataTable = false;
            let payload = {
              message: "Ocorreu um erro ao carregar os dados de fornecedor",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
  },
  created() {},
  computed: {
    fornecedorList() {
      return this.$store.state.FornecedorStore.fornecedorList;
    },
  },
};
</script>

<style scoped>
.margin-bottom-1-em {
  margin-bottom: 0.5em;
}
</style>
