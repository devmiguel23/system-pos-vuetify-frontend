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
                    <v-btn
                      :disabled="$v.$invalid"
                      :loading="btnLoading"
                      dark
                      text
                      @click="save"
                    >
                      Guardar
                    </v-btn>
                  </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="2"
                        md="2"
                        lg="2"
                        xl="2"
                        v-if="editedIndex < 1"
                      >
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
                      <v-col
                        cols="12"
                        sm="2"
                        md="2"
                        lg="2"
                        xl="2"
                        v-if="editedIndex < 1"
                      >
                        <label class="font-weight-bold" for=""
                          >Codigo Barra
                          <span class="error--text">*</span></label
                        >
                        <v-text-field
                          :disabled="inputBarCode"
                          solo
                          required
                          v-model="editedItem.barcode"
                          :hide-details="hideDetails(barcodeErrors.length)"
                          :error-messages="barcodeErrors"
                          @input="$v.editedItem.barcode.$touch()"
                          @blur="$v.editedItem.barcode.$touch()"
                          label="#*****"
                          type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="8" md="8" lg="8" xl="8">
                        <label class="font-weight-bold" for=""
                          >Descripción <span class="error--text">*</span></label
                        >
                        <v-text-field
                          solo
                          required
                          v-model="editedItem.description"
                          :hide-details="hideDetails(descriptionErrors.length)"
                          :error-messages="descriptionErrors"
                          @input="$v.editedItem.description.$touch()"
                          @blur="$v.editedItem.description.$touch()"
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
                          v-model="editedItem.referencelarge"
                          :hide-details="
                            hideDetails(referencelargeErrors.length)
                          "
                          :error-messages="referencelargeErrors"
                          @input="$v.editedItem.referencelarge.$touch()"
                          @blur="$v.editedItem.referencelarge.$touch()"
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
                          v-model="editedItem.referencesmall"
                          :hide-details="
                            hideDetails(referencesmallErrors.length)
                          "
                          :error-messages="referencesmallErrors"
                          @input="$v.editedItem.referencesmall.$touch()"
                          @blur="$v.editedItem.referencesmall.$touch()"
                          label="Referencia Corta"
                          type="text"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                        <label class="font-weight-bold" for="">Stock</label>
                        <v-text-field
                          solo
                          required
                          v-model="editedItem.stock"
                          :hide-details="hideDetails(stockErrors.length)"
                          :error-messages="stockErrors"
                          @input="$v.editedItem.stock.$touch()"
                          @blur="$v.editedItem.stock.$touch()"
                          label="Stock"
                          type="number"
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
              <v-icon v-bind="attrs" v-on="on" small class="mr-2">
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
      </v-data-table>
    </v-card>
    <svg id="barcode"></svg>
  </v-container>
</template>
<script>
import moment from "moment";
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  decimal,
  helpers,
} from "vuelidate/lib/validators";
const alpha = helpers.regex("alpha", /^[a-zA-Z-0-9- ]*$/);

export default {
  mixins: [validationMixin],
  validations: {
    editedItem: {
      barcode: {
        required,
        decimal,
      },
      description: {
        required,
        alpha,
        maxLength: maxLength(100),
        minLength: minLength(1),
      },
      referencelarge: {
        alpha,
        maxLength: maxLength(50),
        minLength: minLength(1),
      },
      referencesmall: {
        alpha,
        maxLength: maxLength(25),
        minLength: minLength(1),
      },
      stock: {
        decimal,
      },
    },
  },
  name: "Dashboard-Product",
  data: () => ({
    search: null,
    tableLoading: false,
    btnLoading: false,
    btnDLoading: false,
    headers: [
      {
        text: "Codigo Barra",
        align: "start",
        value: "barcode",
      },
      { text: "Descripción", sortable: true, value: "description" },
      { text: "Referencia", value: "referencelarge" },
      { text: "Ref Corta", value: "referencesmall" },
      { text: "Compra", value: "buy" },
      { text: "Venta", value: "sale" },
      { text: "Stock", value: "stock" },
      { text: "Existencia", value: "existence" },
      { text: "Fecha", value: "createdDate" },
      { text: "Opciones", align: "end", value: "options", sortable: false },
    ],
    inputBarCode: false,
    products: [],
    dialog: false,
    dialogDelete: false,
    dialogSaveLoading: false,
    editedIndex: -1,
    editedItem: {
      barcode: null,
      description: null,
      referencelarge: null,
      referencesmall: null,
      stock: 0,
    },
    defaultItem: {
      barcode: null,
      description: null,
      referencelarge: null,
      referencesmall: null,
      stock: 0,
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
    this.getProducts();
  },

  methods: {
    generateBarCode() {
      this.inputBarCode = true;
      this.editedItem.barcode =
        Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    },
    editItem(item) {
      this.inputBarCode = true;
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
      this.deleteProduct(this.editedItem);
    },

    close() {
      this.$v.$reset();
      this.btnLoading = false;
      this.tableLoading = false;
      this.dialog = false;
      this.inputBarCode = false;
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
      if (this.editedIndex > -1) this.updateProduct(this.editedItem);
      else this.createProduct(this.editedItem);
    },
    async getProducts() {
      this.products = [];
      this.tableLoading = true;
      await this.axios
        .get("/product")
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
              this.products.push(e);
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
    async createProduct(data) {
      this.tableLoading = true;
      this.btnLoading = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        await this.axios
          .post("/product", data)
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
                this.products.push(e);
              });
            }
            this.close();
          })
          .catch((err) => {
            this.$swal({
              icon: "error",
              title: "Oops...",
              text: err.response.data.msg,
            });
          });
      }
    },
    async updateProduct(data) {
      this.tableLoading = true;
      this.btnLoading = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        await this.axios
          .put(`/product/${data._id}`, data)
          .then((res) => {
            if (!res.data.permission) {
              this.$swal({
                icon: "error",
                title: "Oops...",
                text: res.data.msg,
              });
            } else {
              Object.assign(this.products[this.editedIndex], res.data.item);
            }
            this.close();
          })
          .catch((err) => {
            this.$swal({
              icon: "error",
              title: "Oops...",
              text: err.response.data.msg,
            });
          });
      }
    },
    async deleteProduct(data) {
      this.tableLoading = true;
      this.btnDLoading = true;
      await this.axios
        .delete(`/product/${data._id}`)
        .then((res) => {
          if (!res.data.permission) {
            this.$swal({
              icon: "error",
              title: "Oops...",
              text: res.data.msg,
            });
          } else {
            this.products.splice(this.editedIndex, 1);
          }
          this.closeDelete();
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
    stockErrors() {
      const errors = [];
      if (!this.$v.editedItem.stock.$dirty) return errors;
      !this.$v.editedItem.stock.decimal &&
        errors.push("El codigo de barra solo permite numeros.");
      return errors;
    },
    referencesmallErrors() {
      const errors = [];
      if (!this.$v.editedItem.referencesmall.$dirty) return errors;
      !this.$v.editedItem.referencesmall.maxLength &&
        errors.push("La descripcion debe tener 100 caracteres como máximo.");
      !this.$v.editedItem.referencesmall.minLength &&
        errors.push("La descripcion debe tener 1 caracteres como minimo.");
      !this.$v.editedItem.referencesmall.alpha &&
        errors.push("Solo es permitido a-z-A-Z-0-9.");
      return errors;
    },
    referencelargeErrors() {
      const errors = [];
      if (!this.$v.editedItem.referencelarge.$dirty) return errors;
      !this.$v.editedItem.referencelarge.maxLength &&
        errors.push("La descripcion debe tener 100 caracteres como máximo.");
      !this.$v.editedItem.referencelarge.minLength &&
        errors.push("La descripcion debe tener 1 caracteres como minimo.");
      !this.$v.editedItem.referencelarge.alpha &&
        errors.push("Solo es permitido a-z-A-Z-0-9.");
      return errors;
    },
    descriptionErrors() {
      const errors = [];
      if (!this.$v.editedItem.description.$dirty) return errors;
      !this.$v.editedItem.description.required &&
        errors.push("La descripcion es requerido.");
      !this.$v.editedItem.description.maxLength &&
        errors.push("La descripcion debe tener 100 caracteres como máximo.");
      !this.$v.editedItem.description.minLength &&
        errors.push("La descripcion debe tener 1 caracteres como minimo.");
      !this.$v.editedItem.description.alpha &&
        errors.push("Solo es permitido a-z-A-Z-0-9.");
      return errors;
    },
    barcodeErrors() {
      const errors = [];
      if (!this.$v.editedItem.barcode.$dirty) return errors;
      !this.$v.editedItem.barcode.required &&
        errors.push("El codigo de barra es requerido.");
      !this.$v.editedItem.barcode.decimal &&
        errors.push("El codigo de barra solo permite numeros.");
      return errors;
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Producto" : "Editar Producto";
    },
  },
};
</script>