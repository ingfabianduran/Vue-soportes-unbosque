import xlsx from "xlsx";

const EXCEL = {
    newExcel: (data) => {
        const TO_JSON = xlsx.utils.json_to_sheet(data);
        const WORKBOOK = xlsx.utils.book_new();
        const FILENAME = "Reporte";
        xlsx.utils.book_append_sheet(WORKBOOK, TO_JSON, FILENAME);
        xlsx.writeFile(WORKBOOK, `${FILENAME}.xlsx`);
    }
};

export default EXCEL;