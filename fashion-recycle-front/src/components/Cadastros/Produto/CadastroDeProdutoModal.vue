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
                    label="Data de Entrada"
                    v-model="dataCriacaoForm"
                    disabled
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Item*"
                    v-model="nomeForm"
                    clearable
                    :readonly="modoVisualizacao"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Modelo*"
                    v-model="modeloForm"
                    clearable
                    :readonly="modoVisualizacao"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Número de Série"
                    v-model="serieForm"
                    :readonly="modoVisualizacao"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Cor*"
                    :readonly="modoVisualizacao"
                    v-model="corForm"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    dense
                    label="Marca*"
                    :items="listaMarcas"
                    item-value="id"
                    item-text="name"
                    :rules="marcaRule"
                    :readonly="modoVisualizacao"
                    v-model="marcaForm"
                    clearable
                    :loading="loadingParceiros"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    label="Detalhamento do Produto*"
                    v-model="situacaoForm"
                    :readonly="modoVisualizacao"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    dense
                    label="Fornecedor*"
                    :items="listaParceirosResumida"
                    item-value="id"
                    item-text="name"
                    v-model="parceiroForm"
                    :readonly="modoVisualizacao"
                    clearable
                    :rules="fornecedorRule"
                    :loading="loadingParceiros"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-select
                    dense
                    label="Status*"
                    :items="listStatus"
                    :readonly="modoVisualizacao"
                    :rules="statusRule"
                    item-value="id"
                    item-text="name"
                    v-model="statusForm"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <vuetify-money
                    label="Preço Fornecedor*"
                    v-model="precoParceiroForm"
                    clearable
                    :readonly="modoVisualizacao"
                    v-bind:options="options"
                  ></vuetify-money>
                </v-col>
                <v-col cols="12">
                  <vuetify-money
                    label="Preço Venda*"
                    v-model="precoVendaForm"
                    clearable
                    :readonly="modoVisualizacao"
                    v-bind:options="options"
                  ></vuetify-money>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Margem%"
                    v-model="margemForm"
                    disabled
                    type="number"
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
          <v-btn
            v-show="!modoVisualizacao"
            @click="salvar()"
            dark
            color="btnPrimary"
            >Salvar</v-btn
          >
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

import { BUSCARMARGEMPADRAO } from "@/store/types/PagamentosType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

export default {
  props: ["value", "codigoProduto", "modoVisualizacao"],
  data() {
    return {
      valid: false,
      codigoForm: "0",
      ativoForm: true,
      precoVendaForm: 0.0,
      precoParceiroForm: 0.0,
      parceiroForm: 0,
      estoqueForm: 0,
      marcaForm: 0,
      nomeForm: "",
      statusForm: 0,
      situacaoForm: 0,
      dataCriacaoForm: "",
      corForm: "",
      serieForm: "",
      modeloForm: "",
      margemForm: 0,
      idBanco: 0,
      statusRule: [(v) => !!v || "Status é Obrigatório"],
      marcaRule: [(v) => !!v || "Marca do Produto é obrigatório"],
      fornecedorRule: [(v) => !!v || "Fornecedor é obrigatório"],
      options: {
        locale: "pt-BR",
        prefix: "R$",
        suffix: "",
        length: 11,
        precision: 2,
      },
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
    listaMarcas() {
      return this.$store.state.MarcaStore.marcaList;
    },
    margem() {
      return this.$store.state.PagamentosStore.margemPadrao;
    },
    listStatus() {
      let array = [
        { id: 1, name: "Disponivel" },
        { id: 2, name: "Vendido" },
        { id: 3, name: "Devolvido" },
      ];
      return array;
    },
  },
  created() {
    this.buscarListaDeParceiros();
    this.buscarMargemPadrao();
  },
  methods: {
    async buscarMargemPadrao() {
      await this.$store.dispatch(BUSCARMARGEMPADRAO).catch((error) => {
        if (error) {
          let payload = {
            message: "Ocorreu um erro ao buscar a margem padrão",
            color: "error",
          };
          this.alertaParaUsuario(payload);
        }
      });
    },
    fechar() {
      this.$emit("resetarCodigoProduto");
      this.$store.commit(EMPTYPRODUTO);
      this.limparCamposForm();
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
      this.show = !this.show;
    },
    salvar() {
      if (this.$refs.form.validate()) {
        if (this.precoVendaForm > 0.0 && this.precoParceiroForm > 0.0) {
          console.log(this.precoParceiroForm + "-" + this.precoVendaForm);
          if (
            parseFloat(this.precoParceiroForm) > parseFloat(this.precoVendaForm)
          ) {
            let payload = {
              message:
                "O preço do fornecedor não pode ser maior que o de venda!",
              color: "warning",
            };
            this.alertaParaUsuario(payload);
          } else {
            this.gravarProduto();
          }
        } else {
          let payload = {
            message: "Favor preencher todos os campos Obrigatórios!",
            color: "warning",
          };
          this.alertaParaUsuario(payload);
        }
      }
    },
    gravarProduto() {
      let payload = {
        id:
          this.idBanco == "" ||
          this.idBanco == null ||
          this.idBanco == undefined
            ? 0
            : parseInt(this.idBanco),
        name: this.nomeForm,
        amountInventory: 1,
        pricePartner: parseFloat(this.precoParceiroForm),
        priceSale: parseFloat(this.precoVendaForm),
        partnerId: this.parceiroForm,
        active: true,
        productStatus: this.statusForm,
        serialNumber: this.serieForm,
        model: this.modeloForm,
        colour: this.corForm,
        observation: this.situacaoForm,
        brandId: this.marcaForm,
        margim: this.margemForm,
      };
      console.log(payload);
      this.$store
        .dispatch(ALTERAROUCRIARPRODUTO, payload)
        .then(() => {
          if (this.idBanco == "0" || this.idBanco == "" || this.idBanco == 0) {
            let payload = {
              message: "Produto criado com sucesso!",
              color: "success",
            };
            this.alertaParaUsuario(payload);
            this.$emit("pesquisar");
            this.fechar();
          } else {
            let payload = {
              message: "Produto alterado com sucesso!",
              color: "success",
            };
            this.alertaParaUsuario(payload);
            this.$emit("pesquisar");
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
      console.log(this.codigoProduto);
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
      } else {
        this.$store.commit(EMPTYPRODUTO);
        this.ativoForm = true;
        this.statusForm = 1;
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
              message: "Ocorreu um erro ao carregar a lista de fornecedores",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    carregarDadosForm() {
      this.codigoForm = this.produtoSelecionado.alternativeId;
      this.idBanco = this.produtoSelecionado.id;
      this.nomeForm = this.produtoSelecionado.name;
      this.marcaForm = this.produtoSelecionado.brand;
      this.parceiroForm = this.produtoSelecionado.partnerId;
      this.precoParceiroForm = this.produtoSelecionado.pricePartner;
      this.precoVendaForm = this.produtoSelecionado.priceSale;
      this.ativoForm = this.produtoSelecionado.active;
      this.marcaForm = this.produtoSelecionado.brandId;
      this.statusForm = this.produtoSelecionado.productStatus;
      this.situacaoForm = this.produtoSelecionado.observation;
      this.corForm = this.produtoSelecionado.colour;
      this.serieForm = this.produtoSelecionado.serialNumber;
      this.modeloForm = this.produtoSelecionado.model;
      this.dataCriacaoForm = this.produtoSelecionado.creationDateFormat;
    },
    limparCamposForm() {
      this.codigoForm = "0";
      this.nomeForm = "";
      this.marcaForm = "";
      this.parceiroForm = 0.0;
      this.precoParceiroForm = 0.0;
      this.precoVendaForm = 0.0;
      this.ativoForm = false;
      this.marcaForm = 0;
      this.statusForm = 0;
      this.situacaoForm = "";
      this.corForm = "";
      this.serieForm = "";
      this.modeloForm = "";
      this.dataCriacaoForm = "";
      this.idBanco = 0;
    },
  },
  watch: {
    precoVendaForm() {
      this.margemForm =
        (parseFloat(this.precoVendaForm - parseFloat(this.precoParceiroForm)) /
          parseFloat(this.precoParceiroForm)) *
        100;
    },
  },
};
</script>

<style></style>
