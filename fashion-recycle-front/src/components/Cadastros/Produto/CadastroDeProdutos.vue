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
              label="Codigo Produto"
              v-model="codigoFilter"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-autocomplete
              dense
              label="Marca"
              :items="listaMarcas"
              item-value="id"
              item-text="name"
              v-model="marcaFilter"
              clearable
              :loading="loadingParceiros"
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-autocomplete
              dense
              label="Fornecedor"
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
          <v-btn @click="gerenciarMarcas()" color="light-blue">Marcas</v-btn>
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
          <template v-slot:[`item.pricePartner`]="{ item }">
            {{ item.pricePartner.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) }}
          </template>
          <template v-slot:[`item.priceSale`]="{ item }">
            {{ item.priceSale.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) }}
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-icon color="btnPrimary" @click.stop="alterarProduto(item)"
              >mdi-pencil</v-icon
            >
          </template>
          <template v-slot:[`item.action2`]="{ item }">
            <v-icon color="btnPrimary" @click.stop="verProduto(item)"
              >mdi-eye</v-icon
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
      :modoVisualizacao="modoVisualizacao"
      @resetarCodigoProduto="resetarCodigoProduto"
      @pesquisar="pesquisar"
    />
    <CadastroDeMarcas v-model="mostrarJanelaMarca" />
  </div>
</template>

<script>
import CadastroDeProdutoModal from "./CadastroDeProdutoModal";
import CadastroDeMarcas from "./Marcas/CadastroDeMarcas";

import { SET_MESSAGE } from "@/store/types/NotificationType";

import { BUSCARTODOSOSPRODUTOS, EMPTYPRODUTO } from "@/store/types/ProdutoType";

import { BUSCARLISTAPARCEIRORESUMIDA } from "@/store/types/ParceiroType";

export default {
  components: { CadastroDeProdutoModal, CadastroDeMarcas },
  data() {
    return {
      headers: [
        { text: "Código", value: "alternativeId" },
        { text: "Item", value: "name" },
        { text: "Modelo", value: "model" },
        { text: "Número De Série", value: "serialNumber" },
        { text: "Cor", value: "colour" },
        { text: "Marca", value: "brand" },
        { text: "Valor Fornecedor", value: "pricePartner" },
        { text: "Margem(%)", value: "margim" },
        { text: "Valor Revenda", value: "priceSale" },
        { text: "Fornecedor", value: "partnerName" },
        { text: "Data da Entrada", value: "creationDateFormat" },
        { text: "Status", value: "productStatusDescription" },        
        { text: "Alterar", value: "action", sortable: false },
        { text: "Visualização", value: "action2", sortable: false },
      ],
      mostrarJanela: false,
      mostrarJanelaMarca: false,
      loadingDataTable: false,
      loadingParceiros: false,
      codigoFilter: "",
      nomeFilter: "",
      marcaFilter: null,
      parceiroFilter: null,
      codigoProduto: 0,
      margem: "30%",
      modoVisualizacao: false,
    };
  },
  methods: {
    pesquisar() {
      let payload = {
        id: this.codigoFilter,
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
          this.carregarMargemPadrãoDataTable();
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
    carregarMargemPadrãoDataTable() {
      this.listaProdutos.forEach((element) => {
        element.margem = "30%";
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
    verProduto(item) {
      this.modoVisualizacao = true;
      this.codigoProduto = item.id;
      this.mostrarJanela = true;
    },
    gerenciarMarcas() {
      console.log("Entrou na função");
      this.mostrarJanelaMarca = true;
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
      this.modoVisualizacao = false;
    },
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
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
    listaMarcas() {
      return this.$store.state.MarcaStore.marcaList;
    },
  },
};
</script>

<style scoped>
.margin-bottom-1-em {
  margin-bottom: 0.5em;
}
</style>
