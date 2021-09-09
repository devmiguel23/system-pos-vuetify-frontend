<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="clients"
        item-key="id"
        :sort-by="['fullname']"
        :sort-desc="[false, true]"
        multi-sort
        :search="search"
        :loading="tableLoading"
        loading-text="Por favor... espere un momento."
        class="elevation-1"
        dense
        :items-per-page="20"
        :footer-props="{
          itemsPerPageAllText: 'Todo',
          itemsPerPageText: 'Filas por página',
          itemsPerPageOptions: [10, 20, 50, 100, -1],
          pageText: '{0}-{1} de {2}',
        }"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Clientes</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog
              @keydown.esc="closeDelete"
              @keydown.enter="deleteItemConfirm"
              persistent
              v-model="dialogDelete"
              max-width="600px"
            >
              <v-card>
                <v-toolbar dark color="primary">
                  <v-btn icon dark @click="closeDelete">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-toolbar-title
                    >Seguro que desea deshabilitar este
                    registro?</v-toolbar-title
                  >
                  <v-spacer></v-spacer>
                  <v-toolbar-items>
                    <v-btn
                      dark
                      text
                      :loading="btnDLoading"
                      @click="deleteItemConfirm"
                    >
                      Save
                    </v-btn>
                  </v-toolbar-items>
                </v-toolbar>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <template v-slot:[`item.options`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                small
                class="mr-2"
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>
            </template>
            <span>Editar</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" small @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
            <span>Borrar</span>
          </v-tooltip>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="getClients"> Actualizar </v-btn>
        </template>
        <template v-slot:no-results> Lo que esta buscando no aparece </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
import moment from "moment";
import { validationMixin } from "vuelidate";
// import {
//   required,
//   maxLength,
//   minLength,
//   email,
//   helpers,
// } from "vuelidate/lib/validators";
// const alpha = helpers.regex("alpha", /^[a-zA-Z-0-9- ]*$/);
export default {
  mixins: [validationMixin],
  validations: {
    editedItem: {},
  },
  name: "Dashboard-Client",
  data: () => ({
    search: null,
    tableLoading: false,
    btnLoading: false,
    btnDLoading: false,
    headers: [
      {
        text: "Nombre",
        align: "start",
        sortable: true,
        value: "fullname",
      },
      { text: "RNC", value: "rnc" },
      { text: "Cedula", value: "aid" },
      { text: "Correo", value: "email" },
      { text: "Telefono", value: "phone1" },
      { text: "Telefono 2", value: "phone2" },
      { text: "Direccion", value: "address" },
      { text: "Descripción", value: "description" },
      { text: "Fecha de Creacion", value: "createdDate" },
      { text: "Opciones", align: "end", value: "options", sortable: false },
    ],
    clients: [],
    dialog: false,
    dialogDelete: false,
    dialogSaveLoading: false,
    editedIndex: -1,
    editedItem: {
      fullname: null,
      description: null,
      rnc: null,
      aid: null,
      email: null,
      phone1: null,
      phone2: null,
      address: null,
    },
    defaultItem: {
      fullname: null,
      description: null,
      rnc: null,
      aid: null,
      email: null,
      phone1: null,
      phone2: null,
      address: null,
    },
  }),
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    this.getClients();
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.clients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.clients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.deleteClient(this.editedItem);
    },
    close() {
      this.$v.$reset();
      this.btnLoading = false;
      this.tableLoading = false;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.tableLoading = false;
      this.btnDLoading = false;
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) this.updateClient(this.editedItem);
      else this.createClient(this.editedItem);
    },
    async getClients() {
      this.clients = [];
      this.tableLoading = true;
      await this.axios
        .get("/client")
        .then((res) => {
          if (!res.data[1].permission) {
            this.$swal({
              icon: "error",
              title: "Oops...",
              text: res.data.msg,
            });
          } else {
            res.data[0].forEach((e) => {
              e.createdDate = moment(e.createdDate).format("yyyy-MM-DD");
              this.clients.push(e);
            });
          }
          this.tableLoading = false;
        })
        .catch((err) => {
          this.$swal({
            icon: "error",
            title: "Oops...",
            text: err.response.data.msg,
          });
        });
    },
    hideDetails(val) {
      if (val <= 0) {
        return true;
      } else {
        return false;
      }
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Cliente" : "Editar Cliente";
    },
  },
};
</script>