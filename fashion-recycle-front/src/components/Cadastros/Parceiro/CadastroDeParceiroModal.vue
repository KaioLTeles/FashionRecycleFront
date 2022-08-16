<template>
  <v-row>
    <v-dialog v-model="show" persistent max-width="800px">
      <v-card>
        <v-card-title class="justify-center">
          Cadastro de Fornecedor
          <v-spacer />
          <v-icon medium @click.stop="fechar"> mdi-close </v-icon>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Código Fornecedor"
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
                  <v-menu
                    v-model="date.initialMenuDate"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        v-model="initialDateFormatted"
                        label="Data de Nascimento"
                        prepend-icon="fa-calendar-alt"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date.initialDate"
                      @input="date.initialMenuDate = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="E-mail*"
                    v-model="emailForm"
                    :rules="emailRule"
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
                    label="CPF*"
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
                    label="Numero"
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
  ALTERAROUCRIARPARCEIRO,
  BUSCARPARCEIROPORID,
  EMPTYPARCEIRO,
} from "@/store/types/ParceiroType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

export default {
  props: ["value", "codigoParceiro"],
  data() {
    return {
      nomeRule: [(v) => !!v || "Nome é Obrigatório"],
      emailRule: [(v) => !!v || "E-mail é obrigatório"],
      telefoneRule: [(v) => !!v || "Telefone é obrigatório"],
      valid: false,
      codigoForm: "0",
      nomeForm: "",
      emailForm: "",
      telefoneForm: "",
      cpfForm: "",
      cnpjForm: "",
      enderecoForm: "",
      numeroForm: "",
      cepForm: "",
      ativoForm: true,
      date: {
        todayDate: new Date().toISOString().substr(0, 10),
        initialMenuDate: false,
        initialDate: new Date().toISOString().substr(0, 10),
      },
    };
  },
  computed: {
    show: {
      get() {
        this.buscarParceiro();
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    ParceiroSelecionado() {
      return this.$store.state.ParceiroStore.parceiroObjeto;
    },
    initialDateFormatted: {
      get: function () {
        return this.formatDate(this.date.initialDate);
      },
      // setter
      set: function (newValue) {
        this.date.initialDate = newValue;
      },
    },
  },
  methods: {
    fechar() {
      this.$emit("resetarCodigoParceiro");
      this.$store.commit(EMPTYPARCEIRO);
      this.limparCamposForm();
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
      this.show = !this.show;
    },
    salvar() {
      if (this.$refs.form.validate()) {
        this.gravarParceiro();
      } else {
        let payload = {
          message: "Favor preencher todos os campos!",
          color: "warning",
        };
        this.alertaParaUsuario(payload);
      }
    },
    gravarParceiro() {
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
        cpf:
          this.cpfForm == "" ||
          this.cpfForm == null ||
          this.cpfForm == undefined
            ? ""
            : this.cpfForm.replace(".", "").replace(".", "").replace("-", ""),
        cnpj: "",
        address: this.enderecoForm,
        streetNumber: this.numeroForm,
        cep: this.cepForm == "" ? "" : this.cepForm.replace("-", ""),
        active: this.ativoForm,
        dateOfBirth: this.date.initialDate,
      };
      this.$store
        .dispatch(ALTERAROUCRIARPARCEIRO, payload)
        .then(() => {
          if (this.codigoForm == "0" || this.codigoForm == "") {
            let payload = {
              message: "Fornecedor criado com sucesso!",
              color: "success",
            };
            this.alertaParaUsuario(payload);
            this.fechar();
          } else {
            let payload = {
              message: "Fornecedor alterado com sucesso!",
              color: "success",
            };
            this.alertaParaUsuario(payload);
            this.fechar();
          }
        })
        .catch((error) => {
          if (error) {
            let payload = {
              message: "Ocorreu um erro ao criar o Fornecedor",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
    },
    async buscarParceiro() {
      if (this.codigoParceiro != 0) {
        let payload = {
          idPartner: this.codigoParceiro,
        };

        await this.$store
          .dispatch(BUSCARPARCEIROPORID, payload)
          .then(() => {
            this.carregarDadosForm();
          })
          .catch((error) => {
            if (error) {
              let payload = {
                message: "Ocorreu um erro ao carregar os dados do Fornecedor",
                color: "error",
              };
              this.alertaParaUsuario(payload);
            }
          });
      }
    },
    carregarDadosForm() {
      this.codigoForm = this.ParceiroSelecionado.id;
      this.nomeForm = this.ParceiroSelecionado.name;
      this.emailForm = this.ParceiroSelecionado.email;
      this.telefoneForm = this.ParceiroSelecionado.phoneNumber;
      this.cpfForm = this.ParceiroSelecionado.cpf;
      this.enderecoForm = this.ParceiroSelecionado.address;
      this.numeroForm = this.ParceiroSelecionado.streetNumber;
      this.cepForm = this.ParceiroSelecionado.cep;
      this.ativoForm = this.ParceiroSelecionado.active;
      this.date.initialDate = this.ParceiroSelecionado.dateOfBirthFormat
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
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [day, month, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
  },
};
</script>

<style></style>
