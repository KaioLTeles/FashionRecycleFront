<template>
  <v-row>
    <v-dialog v-model="show" persistent max-width="800px">
      <v-card>
        <v-card-title class="justify-center">
          Adicionar Produto
          <v-spacer />
          <v-icon medium @click.stop="fechar"> mdi-close </v-icon>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    dense
                    label="Fornecedor"
                    :items="listaParceirosResumida"
                    item-value="id"
                    :loading="loadingFornecedor"
                    item-text="name"
                    v-model="fornecedorForm"
                    clearable
                    return-object
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    dense
                    label="Produto"
                    :items="listaProdutosParaVendaPorFornecedor"
                    item-value="id"
                    item-text="name"
                    v-model="produtoForm"
                    :loading="loadingProduto"
                    clearable
                    return-object
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Valor do Produto"
                    v-model="precoVendaForm"
                    clearable
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="info" outlined @click.stop="fechar"> Cancelar </v-btn>
          <v-btn @click="salvar()" dark color="btnPrimary">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import {
  BUSCARPRODUTOSDISPONIVEISPARAVENDA,
  BUSCARPRODUTOSPORFORNECEDORDISPONIVEISPARAVENDA,
} from "@/store/types/ProdutoType";

import { BUSCARLISTAPARCEIRORESUMIDA } from "@/store/types/ParceiroType";

import { ADICIONARPRODUTONALISTA } from "@/store/types/VendasType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

export default {
  props: ["value"],
  data() {
    return {
      valid: false,
      produtoForm: null,
      precoVendaForm: 0,
      quantidadeForm: 1,
      fornecedorForm: 0,
      loadingProduto: false,
      loadingFornecedor: false,
    };
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    listaProdutosParaVenda() {
      return this.$store.state.ProdutoStore.produtoVendaList;
    },
    listaProdutosParaVendaPorFornecedor() {
      return this.$store.state.ProdutoStore.produtoPorFornecedorList;
    },
    itemsVenda() {
      return this.$store.state.VendasStore.listaItensVenda;
    },
    listaParceirosResumida() {
      return this.$store.state.ParceiroStore.listaParceiroResumida;
    },
  },
  created() {
    this.buscarListaDeParceiros();
  },
  methods: {
    fechar() {
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
      this.show = !this.show;
    },
    salvar() {
      var produtoJaInseridoNalista = this.itemsVenda.find(
        (item) => item.idProduto === this.produtoForm.id
      );

      if (this.produtoForm == null || this.produtoForm == undefined) {
        let payload = {
          message: "Favor selecionar um produto!",
          color: "warning",
        };
        this.alertaParaUsuario(payload);
        return;
      }

      if (
        this.precoVendaForm == null ||
        this.precoVendaForm == undefined ||
        this.precoVendaForm == 0
      ) {
        let payload = {
          message: "Favor digitar o preço do produto!",
          color: "warning",
        };
        this.alertaParaUsuario(payload);
        return;
      }

      if (
        produtoJaInseridoNalista != null ||
        produtoJaInseridoNalista != undefined
      ) {
        let payload = {
          message: "Esse produto ja foi inserido!",
          color: "warning",
        };
        this.alertaParaUsuario(payload);
        return;
      }
      let totalDeItems = this.itemsVenda.length;
      let payloadProduto = {
        sequencia: totalDeItems + 1,
        idProduto: this.produtoForm.id,
        descricaoProduto: this.produtoForm.name,
        idParceiro: this.produtoForm.partner.id,
        nomeParceiro: this.produtoForm.partner.name,
        precoDevenda: this.precoVendaForm,
        quantidade: 1,
      };
      this.adiconarProdutoALista(payloadProduto);
    },
    adiconarProdutoALista(payload) {
      this.$store.dispatch(ADICIONARPRODUTONALISTA, payload).then(() => {
        this.fechar();
      });
    },
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
    },
    async buscarProdutosVenda() {
      await this.$store
        .dispatch(BUSCARPRODUTOSDISPONIVEISPARAVENDA)
        .then(() => {})
        .catch((error) => {
          if (error) {
            let payload = {
              message: "Ocorreu um erro ao carregar a lista de produtos",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    async buscarProdutosVendaPorFornecedor(payload) {
      this.loadingProduto = true;
      await this.$store
        .dispatch(BUSCARPRODUTOSPORFORNECEDORDISPONIVEISPARAVENDA, payload)
        .then(() => {
          this.loadingProduto = false;
        })
        .catch((error) => {
          this.loadingProduto = false;
          if (error) {
            let payload = {
              message: "Ocorreu um erro ao carregar a lista de produtos",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    async buscarListaDeParceiros() {
      this.loadingFornecedor = true;
      await this.$store
        .dispatch(BUSCARLISTAPARCEIRORESUMIDA)
        .then(() => {
          this.loadingFornecedor = false;
        })
        .catch((error) => {
          if (error) {
            this.loadingFornecedor = false;
            let payload = {
              message: "Ocorreu um erro ao carregar a lista de parceiros",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
  },
  watch: {
    produtoForm() {
      this.precoVendaForm = this.produtoForm.priceSale;
    },
    fornecedorForm(newValue) {
      if (newValue != null && newValue != undefined && newValue != 0) {
        let payload = {
          idPartner: this.fornecedorForm.id,
        };
        this.buscarProdutosVendaPorFornecedor(payload);
      }
      else{
        this.produtoForm = 0
      }
    },
  },
};
</script>

<style></style>
