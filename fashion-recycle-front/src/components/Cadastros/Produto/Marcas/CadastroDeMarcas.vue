<template>
  <v-row>
    <v-dialog v-model="show" persistent max-width="800px">
      <v-card>
        <v-card-title class="justify-center">
          Cadastro de Marcas
          <v-spacer />
          <v-icon medium @click.stop="fechar"> mdi-close </v-icon>
        </v-card-title>
        <v-card-text v-show="modfy">
          <v-row>
            <v-col>
              <v-text-field
                dense
                label="Nome"
                v-model="nomeForm"
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-btn color="btnPrimary" @click="salvarNovaMarca()">
              Salvar Nova Marca
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn @click="criarMarca()" dark color="btnPrimary">Novo</v-btn>
          </v-col>
        </v-card-actions>

        <v-card-text>
          <v-data-table
            :headers="headers"
            item-key="codigo"
            :items="listaMarcas"
            :loading="loadingDataTable"
          >
            <template v-slot:[`item.name`]="props">
              <v-edit-dialog
                :return-value.sync="props.item.name"
                @save="save(props.item)"
                @cancel="cancel"
              >
                {{ props.item.name }}
                <template v-slot:input>
                  <v-text-field
                    v-model="props.item.name"
                    label="Edit"
                    single-line
                    counter
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <v-icon color="btnPrimary" @click.stop="removerMarca(item)"
                >mdi-delete</v-icon
              >
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { SET_MESSAGE } from "@/store/types/NotificationType";

import {
  BUSCARTODASASMARCAS,
  CRIARMARCA,
  REMOVERMARCA,
} from "@/store/types/MarcaType";

export default {
  props: ["value"],
  data() {
    return {
      headers: [
        { text: "Código", value: "id" },
        { text: "Nome", value: "name" },
        { text: "Ações", value: "action", sortable: false },
      ],
      modfy: false,
      valid: false,
      nomeForm: "",
      codigoForm: 0,
      loadingDataTable: false,
    };
  },
  methods: {
    save(item) {
      const payload = {
        id: item.id,
        name: item.name,
      };

      this.$store
        .dispatch(CRIARMARCA, payload)
        .then(() => {
          this.loadingDataTable = false;
          let payload = {
            message: "Alterado Com Sucesso!",
            color: "success",
          };
          this.alertaParaUsuario(payload);
          this.buscarMarcas();
        })
        .catch((error) => {
          if (error) {
            this.loadingDataTable = false;
            let payload = {
              message: "Ocorreu um erro ao alterar descrição",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    cancel() {
      let payload = {
        message: "Operação Cancelada",
        color: "warning",
      };
      this.alertaParaUsuario(payload);
    },
    criarMarca() {
      this.modfy = true;
    },
    fechar() {
      this.modfy = false;
      this.show = !this.show;
    },
    salvarNovaMarca() {
      if (this.nomeForm != "") {
        const payload = {
          id: 0,
          name: this.nomeForm,
        };

        this.$store
          .dispatch(CRIARMARCA, payload)
          .then(() => {
            this.loadingDataTable = false;
            let payload = {
              message: "Criado Com Sucesso!",
              color: "success",
            };
            this.alertaParaUsuario(payload);
            this.buscarMarcas();
            this.modfy = false;
            this.nomeForm = "";
          })
          .catch((error) => {
            if (error) {
              this.loadingDataTable = false;
              let payload = {
                message: "Ocorreu um erro ao Criar a nova marca",
                color: "error",
              };
              this.alertaParaUsuario(payload);
            }
          });
      } else {
        this.loadingDataTable = false;
        let payload = {
          message: "Favor digitar o nome da marca!",
          color: "warning",
        };
        this.alertaParaUsuario(payload);
      }
    },
    removerMarca(item) {
      let id = item.id;

      this.$store
        .dispatch(REMOVERMARCA, id)
        .then(() => {
          this.loadingDataTable = false;
          let payload = {
            message: "Removido Com Sucesso!",
            color: "success",
          };
          this.alertaParaUsuario(payload);
          this.buscarMarcas();
        })
        .catch((error) => {
          if (error) {
            this.loadingDataTable = false;
            let payload = {
              message: "Ocorreu um erro ao remover a marca",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    async buscarMarcas() {
      this.loadingDataTable = true;
      await this.$store
        .dispatch(BUSCARTODASASMARCAS)
        .then(() => {
          this.loadingDataTable = false;
        })
        .catch((error) => {
          if (error) {
            this.loadingDataTable = false;
            let payload = {
              message: "Ocorreu um erro ao carregar os dados de marcas",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
    },
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
    listaMarcas() {
      return this.$store.state.MarcaStore.marcaList;
    },
  },
  created() {
    this.buscarMarcas();
  },
};
</script>

<style></style>
