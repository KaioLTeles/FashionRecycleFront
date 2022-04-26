<template>
  <div>
    <v-card class="margin-bottom-1-em">
      <v-card-title>
        <v-toolbar-title class="title">Cadastro de Produtos</v-toolbar-title>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              dense
              type="number"
              label="Codigo Produto"
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
              label="Marca"
              v-model="marcaFilter"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-autocomplete
              dense
              label="Parceiro"
              :items="listaParceirosResumida"
              item-value="id"
              item-text="name"
              v-model="parceiroFilter"
              clearable
              :loading="loadingParceiros"
            ></v-autocomplete>
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
          <v-btn @click="criarProduto()" dark color="btnPrimary">Novo</v-btn>
        </v-col>
      </v-card-actions>

      <v-card-text>
        <v-data-table
          :headers="headers"
          item-key="codigo"
          :items="listaProdutos"
          :loading="loadingDataTable"
        >
          <template v-slot:[`item.action`]="{ item }">
            <v-icon color="btnPrimary" @click.stop="alterarProduto(item)"
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
    <CadastroDeProdutoModal
      v-model="mostrarJanela"
      :codigoProduto="codigoProduto"
      @resetarCodigoProduto="resetarCodigoProduto"
    />
  </div>
</template>

<script>
import CadastroDeProdutoModal from "./CadastroDeProdutoModal";

import { BUSCARTODOSOSPRODUTOS, EMPTYPRODUTO } from "@/store/types/ProdutoType";

import { BUSCARLISTAPARCEIRORESUMIDA } from "@/store/types/ParceiroType";

export default {
  components: { CadastroDeProdutoModal },
  data() {
    return {
      headers: [
        { text: "Código", value: "id" },
        { text: "Descricao", value: "name" },
        { text: "Marca", value: "brand" },
        { text: "Quantidade", value: "amountInventory" },
        { text: "Valor Parceiro", value: "pricePartner" },
        { text: "Valor Revenda", value: "priceSale" },
        { text: "Parceiro", value: "partnerName" },
        { text: "Ativo", value: "active" },
        { text: "Ações", value: "action", sortable: false },
      ],
      mostrarJanela: false,
      loadingDataTable: false,
      loadingParceiros: false,
      codigoFilter: "",
      nomeFilter: "",
      marcaFilter: "",
      parceiroFilter: 0,
      codigoProduto: 0,
    };
  },
  methods: {
    pesquisar() {
      let payload = {
        id: parseInt(this.codigoFilter == "" ? "0" : this.codigoFilter),
        name: this.nomeFilter,
        brand: this.marcaFilter,
        idPartner: this.parceiroFilter,
      };

      this.loadingDataTable = true;

      this.buscarDadosProduto(payload);
    },
    async buscarDadosProduto(payload) {
      await this.$store
        .dispatch(BUSCARTODOSOSPRODUTOS, payload)
        .then(() => {
          this.loadingDataTable = false;
        })
        .catch((error) => {
          if (error) {
            this.loadingDataTable = false;
            let payload = {
              message: "Ocorreu um erro ao carregar os dados de produtos",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    criarProduto() {
      this.$store.commit(EMPTYPRODUTO);
      this.codigoProduto = 0;
      this.mostrarJanela = true;
    },
    alterarProduto(item) {
      this.codigoProduto = item.id;
      this.mostrarJanela = true;
    },
    async buscarListaDeParceiros() {
      this.loadingParceiros = true;
      await this.$store
        .dispatch(BUSCARLISTAPARCEIRORESUMIDA)
        .then(() => {
          this.loadingParceiros = false;
        })
        .catch((error) => {
          if (error) {
            this.loadingParceiros = false;
            let payload = {
              message: "Ocorreu um erro ao carregar a lista de parceiros",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    resetarCodigoProduto() {
      this.codigoProduto = 0;
    },
  },
  created() {
    this.buscarListaDeParceiros();
  },
  computed: {
    listaProdutos() {
      return this.$store.state.ProdutoStore.produtoList;
    },
    listaParceirosResumida() {
      return this.$store.state.ParceiroStore.listaParceiroResumida;
    },
  },
};
</script>

<style scoped>
.margin-bottom-1-em {
  margin-bottom: 0.5em;
}
</style>
