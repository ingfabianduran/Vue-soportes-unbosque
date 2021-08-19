const QUERIES = {
    DATA_FORM: `query {
        dataForm {
            servicios,
            tecnicos,
            perfiles,
            bloques,
            soluciones
        }
    }`,
    LABORES: `query labores($typeSuport: String!) {
        labores(typeSuport: $typeSuport) {
            labores
        }
    }`,
    NEW_SUPPORT: `mutation createSoporte($input: SoporteInput) {
        createSoporte(input: $input) {
            state
            message
        }
    }`,
    SEND_EMAIL_OPC: `mutation sendEmailAdd($input: Incidente) {
        sendEmailAdd(input: $input) {
            state
            message
        }
    }` 
}

export default QUERIES;