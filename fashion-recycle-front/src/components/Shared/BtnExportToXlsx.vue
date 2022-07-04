<template>
    <vue-excel-xlsx :data="dataExport" :columns="columnsExport" :filename="fileName" :sheetname="sheetName">
        <v-btn class="ma-2 white--text" :loading="loadingToExport" outlined color="info"
            >Exportar</v-btn
        ></vue-excel-xlsx
    >
</template>

<script>
export default {
    props: {
        dataExport: { type: Array, required: true },
        columnsExport: { type: Array, required: true },
        fileName: { type: String, required: true },
        loadingToExport: { type: Boolean, required: true },
        sheetName: { type: String, required: true }
    }
}
</script>
