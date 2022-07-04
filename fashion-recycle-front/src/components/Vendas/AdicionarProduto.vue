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
                    label="Produto"
                    :items="listaProdutosParaVenda"
                    item-value="id"
                    item-text="name"
                    v-model="produtoForm"
                    clearable
                    return-object
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Preço Unitário"
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
import { BUSCARPRODUTOSDISPONIVEISPARAVENDA } from "@/store/types/ProdutoType";

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
    itemsVenda() {
      return this.$store.state.VendasStore.listaItensVenda;
    },
  },
  updated() {
    this.buscarProdutosVenda();
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
  },
  watch: {
    produtoForm() {
      this.precoVendaForm = this.produtoForm.priceSale;
    },
  },
};
</script>

<style></style>
