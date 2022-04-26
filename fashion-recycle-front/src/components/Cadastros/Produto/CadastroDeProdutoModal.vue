<template>
  <v-row>
    <v-dialog v-model="show" persistent max-width="800px">
      <v-card>
        <v-card-title class="justify-center">
          Cadastro de Produto
          <v-spacer />
          <v-icon medium @click.stop="fechar"> mdi-close </v-icon>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Código Produto"
                    v-model="codigoForm"
                    disabled
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Descrição*"
                    v-model="nomeForm"
                    :rules="nomeRule"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Marca*"
                    v-model="marcaForm"
                    :rules="marcaRule"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Quantidade Estoque*"
                    v-model="estoqueForm"
                    type="number"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    dense
                    label="Parceiro"
                    :items="listaParceirosResumida"
                    item-value="id"
                    item-text="name"
                    v-model="parceiroForm"
                    clearable
                    :loading="loadingParceiros"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Preço Parceiro*"
                    v-model="precoParceiroForm"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Preço Venda*"
                    v-model="precoVendaForm"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-checkbox v-model="ativoForm" label="Ativo" />
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
  BUSCARPRODUTOPORID,
  EMPTYPRODUTO,
  ALTERAROUCRIARPRODUTO,
} from "@/store/types/ProdutoType";

import { BUSCARLISTAPARCEIRORESUMIDA } from "@/store/types/ParceiroType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

export default {
  props: ["value", "codigoProduto"],
  data() {
    return {
      nomeRule: [(v) => !!v || "Descrição é Obrigatório"],
      marcaRule: [(v) => !!v || "Marca é Obrigatório"],
      valid: false,
      codigoForm: "0",
      ativoForm: false,
      precoVendaForm: 0.0,
      precoParceiroForm: 0.0,
      parceiroForm: null,
      estoqueForm: 0,
      marcaForm: "",
      nomeForm: "",
    };
  },
  computed: {
    show: {
      get() {
        this.buscarProduto();
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    produtoSelecionado() {
      return this.$store.state.ProdutoStore.produtoObjeto;
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
      this.$emit("resetarCodigoProduto");
      this.$store.commit(EMPTYPRODUTO);
      this.limparCamposForm();
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
      this.show = !this.show;
    },
    salvar() {
      if (
        this.$refs.form.validate() &&
        this.precoVendaForm > 0.0 &&
        this.precoParceiroForm > 0.0 &&
        this.estoqueForm > 0
      ) {
        this.gravarProduto();
      } else {
        let payload = {
          message: "Favor preencher todos os campos Obrigatórios!",
          color: "warning",
        };
        this.alertaParaUsuario(payload);
      }
    },
    gravarProduto() {
      const payload = {
        id: parseInt(this.codigoForm),
        name: this.nomeForm,
        brand: this.marcaForm,
        amountInventory: this.estoqueForm,
        pricePartner: this.precoVendaForm,
        priceSale: this.precoVendaForm,
        partnerId: this.parceiroForm,
        active: this.ativoForm,
      };
      this.$store
        .dispatch(ALTERAROUCRIARPRODUTO, payload)
        .then(() => {
          if (this.codigoForm == "0" || this.codigoForm == "") {
            let payload = {
              message: "Produto criado com sucesso!",
              color: "success",
            };
            this.alertaParaUsuario(payload);
            this.fechar();
          } else {
            let payload = {
              message: "Produto alterado com sucesso!",
              color: "success",
            };
            this.alertaParaUsuario(payload);
            this.fechar();
          }
        })
        .catch((error) => {
          if (error) {
            let payload = {
              message: "Ocorreu um erro ao criar/alterar o produto",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
    },
    async buscarProduto() {
      if (this.codigoProduto != 0) {
        console.log(this.codigoProduto);
        let payload = {
          idProduct: this.codigoProduto,
        };

        await this.$store
          .dispatch(BUSCARPRODUTOPORID, payload)
          .then(() => {
            this.carregarDadosForm();
          })
          .catch((error) => {
            if (error) {
              let payload = {
                message: "Ocorreu um erro ao carregar os dados do produto",
                color: "error",
              };
              this.alertaParaUsuario(payload);
            }
          });
      }
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
    carregarDadosForm() {
      this.codigoForm = this.produtoSelecionado.id;
      this.nomeForm = this.produtoSelecionado.name;
      this.marcaForm = this.produtoSelecionado.brand;
      this.estoqueForm = this.produtoSelecionado.amountInventory;
      this.parceiroForm = this.produtoSelecionado.PartnerId;
      this.precoParceiroForm = this.produtoSelecionado.pricePartner;
      this.precoVendaForm = this.produtoSelecionado.priceSale;
      this.ativoForm = this.produtoSelecionado.active;
    },
    limparCamposForm() {
      this.codigoForm = "0";
      this.nomeForm = "";
      this.marcaForm = "";
      this.estoqueForm = 0;
      this.parceiroForm = 0.0;
      this.precoParceiroForm = 0.0;
      this.precoVendaForm = 0.0;
      this.ativoForm = false;
    },
  },
};
</script>

<style></style>
