<template>
  <div>
    <v-card class="margin-bottom-1-em">
      <v-card-title>
        <v-toolbar-title class="title"
          >Relatório de Fluxo de Caixa</v-toolbar-title
        >
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              dense
              type="number"
              label="Fornecedor"
              v-model="codigoFilter"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              dense
              label="Parceiro"
              v-model="nomeFilter"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-autocomplete
              dense
              label="Tipo de Despesa"
              :items="listaDeDespesas"
              item-value="Codigo"
              item-text="Descricao"
              v-model="fornecedorForm"
              clearable
              return-object
              :loading="loadingFornecedor"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn color="btnPrimary" @click="pesquisar()"> Pesquisar </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          item-key="codigo"
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
  </div>
</template>

<script>
import { BUSCARTODOSOSPRODUTOS, EMPTYPRODUTO } from "@/store/types/ProdutoType";

import { BUSCARLISTAPARCEIRORESUMIDA } from "@/store/types/ParceiroType";

export default {
  components: {},
  data() {
    return {
      headers: [
        { text: "Código", value: "id" },
        { text: "Fornecedor", value: "name" },
        { text: "Parceiro", value: "email" },
        { text: "Classificação", value: "phoneNumber" },
        { text: "Valor", value: "cpf" },
        { text: "Data Vencimento", value: "active" },
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
    listaDeDespesas() {
      let array = [
        { Codigo: 1, Descricao: "Despesa com Marketing" },
        { Codigo: 2, Descricao: "Despesa com Aluguel" },
        { Codigo: 3, Descricao: "Despesa com Energia Elétrica" },
        { Codigo: 4, Descricao: "Despesa com Materiais de Escritório" },
        { Codigo: 5, Descricao: "Despesa com Funcionários" },
        { Codigo: 6, Descricao: "Despesa com Material de Embalagem" },
        { Codigo: 7, Descricao: "Despesa com Assessoria Jurídica" },
        { Codigo: 8, Descricao: "Receita com Vendas (Comissões)" },
      ];
      return array;
    },
  },
};
</script>

<style scoped>
.margin-bottom-1-em {
  margin-bottom: 0.5em;
}
</style>
