<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="products"
        item-key="id"
        :sort-by="['description']"
        :sort-desc="[false, true]"
        multi-sort
        :search="search"
        :loading="tableLoading"
        loading-text="Por favor... espere un momento."
        class="elevation-1"
        dense
        :footer-props="{
          itemsPerPageAllText: 'Todo',
          itemsPerPageText: 'Filas por página',
          itemsPerPageOptions: [10, 50, 100, -1],
          pageText: '{0}-{1} de {2}',
        }"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Productos</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog
              @keydown.esc="close"
              @keydown.enter="save"
              persistent
              v-model="dialog"
              max-width="900px"
            >
              <template v-slot:activator="{ on, attrs }">
                <div class="d-flex justify-center align-center">
                  <v-text-field
                    class="mx-4"
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Buscar"
                    single-line
                    hide-details
                    solo
                    dense
                  ></v-text-field>
                  <v-btn color="primary" dark v-bind="attrs" v-on="on">
                    Nuevo Producto
                  </v-btn>
                </div>
              </template>
              <v-card>
                <v-toolbar dark color="primary">
                  <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-toolbar-title v-text="formTitle"></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-toolbar-items>
                    <v-btn dark text @click="save"> Save </v-btn>
                  </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="2" md="2" lg="2" xl="2">
                        <label class="font-weight-bold" for=""
                          >Generar Codigo
                        </label>
                        <div class="d-flex align-end justify-center">
                          <v-btn
                            @click="generateBarCode"
                            color="tertiary white--text"
                            small
                            >Generar</v-btn
                          >
                        </div>
                      </v-col>
                      <v-col cols="12" sm="2" md="2" lg="2" xl="2">
                        <label class="font-weight-bold" for=""
                          >Codigo Barra
                          <span class="error--text">*</span></label
                        >
                        <v-text-field
                          :disabled="inputBarCode"
                          solo
                          required
                          v-model.trim="editedItem.barCode"
                          hide-details
                          label="#*****"
                          type="text"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="8" md="8" lg="8" xl="8">
                        <label class="font-weight-bold" for=""
                          >Descripción <span class="error--text">*</span></label
                        >
                        <v-text-field
                          solo
                          required
                          v-model.trim="editedItem.description"
                          hide-details
                          label="Descripción"
                          type="text"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                        <label class="font-weight-bold" for=""
                          >Referencia Larga</label
                        >
                        <v-text-field
                          solo
                          required
                          v-model.trim="editedItem.referenceLarge"
                          hide-details
                          label="Referencia Larga"
                          type="text"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                        <label class="font-weight-bold" for=""
                          >Referencia Corta</label
                        >
                        <v-text-field
                          solo
                          required
                          v-model.trim="editedItem.referenceSmall"
                          hide-details
                          label="Referencia Corta"
                          type="text"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                        <label class="font-weight-bold" for="">Stock</label>
                        <v-text-field
                          solo
                          required
                          v-model.trim="editedItem.stock"
                          hide-details
                          label="Stock"
                          type="text"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
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
                    <v-btn dark text @click="deleteItemConfirm"> Save </v-btn>
                  </v-toolbar-items>
                </v-toolbar>
                <!-- <v-card-title class="text-h5"
                  >Seguro que desea deshabilitar este registro?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancelar</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions> -->
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.options="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                small
                class="mr-2"
                @click="editItem(item)"
              >
                mdi-chart-areaspline
              </v-icon>
            </template>
            <span>Reportes</span>
          </v-tooltip>
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
          <v-btn color="primary" @click="getProducts"> Actualizar </v-btn>
        </template>
        <template v-slot:no-results> Lo que esta buscando no aparece </template>
        <template v-slot:no-results> Lo que esta buscando no aparece </template>
      </v-data-table>
    </v-card>
    <svg id="barcode"></svg>
  </v-container>
</template>
<script>
import products from "@/data/products.json";
// import JsBarcode from "jsbarcode";
export default {
  name: "Dashboard-Product",
  data: () => ({
    search: null,
    tableLoading: false,
    headers: [
      {
        text: "Codigo Barra",
        align: "start",
        value: "barCode",
      },
      { text: "Descripción", sortable: true, value: "description" },
      { text: "Referencia", value: "referenceLarge" },
      { text: "Ref Corta", value: "referenceSmall" },
      { text: "Compra", value: "buy" },
      { text: "Venta", value: "sale" },
      { text: "Stock", value: "stock" },
      { text: "Existencia", value: "existence" },
      { text: "Opciones", align: "end", value: "options", sortable: false },
    ],
    inputBarCode: false,
    products: null,
    dialog: false,
    dialogDelete: false,
    dialogSaveLoading: false,
    editedIndex: -1,
    editedItem: {
      barCode: null,
      description: null,
      referenceLarge: null,
      referenceSmall: null,
      buy: null,
      sale: null,
      stock: null,
      existence: null,
    },
    defaultItem: {
      barCode: null,
      description: null,
      referenceLarge: null,
      referenceSmall: null,
      buy: null,
      sale: null,
      stock: null,
      existence: null,
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
  mounted() {
    // JsBarcode("#barcode")
    //   .EAN13("123456789012", {
    //     height: 50,
    //     fontSize: 16,
    //   })
    //   .render();
  },
  created() {
    this.getProducts();
  },

  methods: {
    generateBarCode() {
      this.inputBarCode = true;
      this.editedItem.barCode =
        Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    },
    editItem(item) {
      this.editedIndex = this.products.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.products.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.products.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.inputBarCode = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.products[this.editedIndex], this.editedItem);
      } else {
        this.products.push(this.editedItem);
      }
      this.close();
    },
    getProducts() {
      this.products = products;
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Producto" : "Editar Producto";
    },
  },
};
</script>