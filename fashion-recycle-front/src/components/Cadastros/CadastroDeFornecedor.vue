<template>
  <div>
    <v-card>
      <v-card-title>
        <v-toolbar-title>Cadastro de Fornecedores</v-toolbar-title>
      </v-card-title>
      <v-card-actions>
        <v-col
          ><v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
        <v-col class="text-right">
          <v-btn @click="criarMotivo()" dark color="btnPrimary">Novo</v-btn>
        </v-col>
      </v-card-actions>

      <v-card-text>
        <v-data-table
          :headers="headers"
          item-key="codigo"          
          :search="search"
        >
          <template v-slot:[`item.action`]="{ item }">
            <v-icon color="btnPrimary" @click.stop="alterarMotivo(item)"
              >mdi-pencil</v-icon
            >
          </template>
          <template v-slot:[`item.ativo`]="{ item }">
            <v-simple-checkbox
              v-model="item.ativo"
              disabled
            ></v-simple-checkbox>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      headers: [
        { text: "Código", value: "codigo" },
        { text: "Nome", value: "descricao" },
        { text: "Cpf", value: "descricao" },
        { text: "Email", value: "descTipoMotivo" },
        { text: "Telefone", value: "dataControle" },  
        { text: "Ativo", value: "ativo" },
        { text: "Ações", value: "action", sortable: false },
      ],
      motivo: {},
      mostrarJanelaManterMotivo: false,
      codigoMotivo: "",
      search: "",
    };
  },
  methods: {
    criarMotivo() {
      alert('Fornecedor Criado!')
    },
    alterarMotivo(item) {
      this.codigoMotivo = item.codigo;
      this.mostrarJanelaManterMotivo = true;
    },
  },
  created() {},
  computed: {},
};
</script>

<style scoped></style>
