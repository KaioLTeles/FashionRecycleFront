<template>
  <v-row>
    <v-dialog v-model="show" persistent max-width="800px">
      <v-card>
        <v-card-title class="justify-center">
          Cadastro de Comprador
          <v-spacer />
          <v-icon medium @click.stop="fechar"> mdi-close </v-icon>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Código Comprador"
                    v-model="codigoForm"
                    disabled
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Nome*"
                    v-model="nomeForm"
                    :rules="nomeRule"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="E-mail"
                    v-model="emailForm"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Telefone*"
                    v-model="telefoneForm"
                    :rules="telefoneRule"
                    v-mask="'(##) #####-####'"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="CPF"
                    v-model="cpfForm"
                    v-mask="'###.###.###-##'"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Endereço"
                    v-model="enderecoForm"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Complemento"
                    v-model="numeroForm"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="CEP"
                    v-model="cepForm"
                    v-mask="'#####-###'"
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
  BUSCARCLIENTEPELOID,
  EMPTYBUSCARCLIENTEPELOID,
  CRIAROUALTERARCLIENTE,
} from "@/store/types/ClienteType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

export default {
  props: ["value", "codigoCliente"],
  data() {
    return {
      valid: false,
      nomeRule: [(v) => !!v || "Nome é Obrigatório"],      
      telefoneRule: [(v) => !!v || "Telefone é obrigatório"],      
      codigoForm: "0",
      nomeForm: "",
      emailForm: "",
      telefoneForm: "",
      cpfForm: "",
      enderecoForm: "",
      numeroForm: "",
      cepForm: "",
      ativoForm: null,
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
    clienteSelecionado() {
      return this.$store.state.ClienteStore.clientObjeto;
    },
  },
  created(){
    this.buscarCliente();
  },
  updated() {},
  beforeUpdate() {},
  methods: {
    salvar() {
      if (this.$refs.form.validate()) {
        this.gravarCliente();
      } else {
        let payload = {
          message: "Favor preencher todos os campos!",
          color: "warning",
        };
        this.alertaParaUsuario(payload);
      }
    },
    gravarCliente() {
      const payload = {
        id:
          this.codigoForm == "" ||
          this.codigoForm == null ||
          this.codigoForm == undefined
            ? 0
            : parseInt(this.codigoForm),
        name: this.nomeForm,
        phoneNumber: this.telefoneForm
          .replace("(", "")
          .replace(")", "")
          .replace("-", "")
          .replace(" ", ""),
        email: this.emailForm,
        cpf: this.cpfForm.replace(".", "").replace(".", "").replace("-", ""),
        address: this.enderecoForm,
        streetNumber: this.numeroForm,
        cep: this.cepForm.replace("-", ""),
        active: this.ativoForm,
      };
      this.$store
        .dispatch(CRIAROUALTERARCLIENTE, payload)
        .then(() => {
          if (this.codigoForm == "0" || this.codigoForm == "") {
            let payload = {
              message: "Comprador criado com sucesso!",
              color: "success",
            };
            this.alertaParaUsuario(payload);
            this.$emit("pesquisar");
            this.fechar();
          } else {
            let payload = {
              message: "Comprador alterado com sucesso!",
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
              message: "Ocorreu um erro ao carregar os dados do Comprador",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    fechar() {
      this.$emit("resetarCodigoCliente");
      this.$store.commit(EMPTYBUSCARCLIENTEPELOID);
      this.limparCamposForm();
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
      this.show = !this.show;
    },
    async buscarCliente() {
      if (this.codigoCliente != 0 || this.codigoCliente != "0" ) {
        console.log("entrou no if");
        let payload = {
          idClient: this.codigoCliente,
        };

        await this.$store
          .dispatch(BUSCARCLIENTEPELOID, payload)
          .then(() => {
            this.carregarDadosForm();
          })
          .catch((error) => {
            if (error) {
              let payload = {
                message: "Ocorreu um erro ao carregar os dados do Comprador",
                color: "error",
              };
              this.alertaParaUsuario(payload);
            }
          });
      }
      else{
        console.log("entrou no else");
        this.ativoForm = true;
      }
    },
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
    },
    carregarDadosForm() {
      console.log(this.clienteSelecionado.active);
      this.codigoForm = this.clienteSelecionado.id;
      this.nomeForm = this.clienteSelecionado.name;
      this.emailForm = this.clienteSelecionado.email;
      this.telefoneForm = this.clienteSelecionado.phoneNumber;
      this.cpfForm = this.clienteSelecionado.cpf;
      this.enderecoForm = this.clienteSelecionado.address;
      this.numeroForm = this.clienteSelecionado.streetNumber;
      this.cepForm = this.clienteSelecionado.cep;
      this.ativoForm = this.clienteSelecionado.active;
      console.log(this.ativoForm);
    },
    limparCamposForm() {
      this.codigoForm = 0;
      this.nomeForm = "";
      this.emailForm = "";
      this.telefoneForm = "";
      this.cpfForm = "";
      this.enderecoForm = "";
      this.numeroForm = "";
      this.cepForm = "";
      this.ativoForm = false;
    },
  },
  watch: {},
};
</script>

<style scoped></style>
