<template>
  <div>
    <svg id="barcode"></svg>
  </div>
</template>
<script>
import JsBarcode from "jsbarcode";
JsBarcode("#barcode", "1234", {
  format: "pharmacode",
  lineColor: "#0aa",
  width: 4,
  height: 40,
  displayValue: false,
});
export default {};
</script>