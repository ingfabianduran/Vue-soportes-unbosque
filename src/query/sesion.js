const QUERIES = {
    SESSION: `query login($input: DataLogin) {
        login(input: $input) {
            status
            message
            resLogin
            token
        }
    }`
}

export default QUERIES;