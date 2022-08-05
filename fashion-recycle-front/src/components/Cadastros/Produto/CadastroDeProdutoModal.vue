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
                    label="Item*"
                    v-model="nomeForm"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Modelo*"
                    v-model="modeloForm"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Número de Série*"
                    v-model="serieForm"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Cor*"
                    v-model="corForm"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    dense
                    label="Marca"
                    :items="listaMarcas"
                    item-value="id"
                    item-text="name"
                    v-model="marcaForm"
                    clearable
                    :loading="loadingParceiros"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    label="Situação Do Produto*"
                    v-model="situacaoForm"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    dense
                    label="Fornecedor"
                    :items="listaParceirosResumida"
                    item-value="id"
                    item-text="name"
                    v-model="parceiroForm"
                    clearable
                    :loading="loadingParceiros"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-select
                    dense
                    label="Status"
                    :items="listStatus"
                    item-value="id"
                    item-text="name"
                    v-model="statusForm"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Preço Parceiro*"
                    v-model="precoParceiroForm"
                    type="number"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Preço Venda*"
                    v-model="precoVendaForm"
                    type="number"
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

import { BUSCARMARGEMPADRAO } from "@/store/types/PagamentosType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

export default {
  props: ["value", "codigoProduto"],
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
      corForm: "",
      serieForm: "",
      modeloForm: "",
      idBanco: 0,
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
      if (this.precoVendaForm > 0.0 && this.precoParceiroForm > 0.0) {
        if (this.precoParceiroForm > this.precoVendaForm) {
          let payload = {
            message: "O preço do parceiro não pode ser maior que o de venda!",
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
        active: this.ativoForm,
        productStatus: this.statusForm,
        serialNumber: this.serieForm,
        model: this.modeloForm,
        colour: this.corForm,
        observation: this.situacaoForm,
        brandId: this.marcaForm,
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
    },
  },
  watch: {
    precoParceiroForm() {
      this.precoVendaForm = this.precoParceiroForm * this.margem;
    },
  },
};
</script>

<style></style>
