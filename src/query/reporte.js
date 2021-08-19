const QUERIES = {
    DATA_REPORTES: `query {
        dataFormReport {
            consultas
        }
    }`,
    NEW_REPORT: `query reporte($input: DataSoporte) {
        reporte(input: $input) {
            elemento
            sumatoria
        }
    }`
}

export default QUERIES;