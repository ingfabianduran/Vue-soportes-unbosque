import Chart from "chart.js";

const DRAW_CHART = {
    // Draw chart: 
    newChart: (data, colors) => {
        const LABEL = data.data.reporte.map((e) => {
            return e.elemento;
        });

        const DATA = data.data.reporte.map((e) => {
            return e.sumatoria;
        });

        const CONTENEDOR_CHAR = document.getElementById("divChart");
        CONTENEDOR_CHAR.innerHTML = "&nbsp;";
        CONTENEDOR_CHAR.innerHTML = '<canvas id="chart" width="800" height="400"></canvas>';
        
        new Chart(document.getElementById("chart"), {
            type: 'doughnut',
            data: {
                labels: LABEL,
                datasets: [
                    {
                        label: '# de Soportes',
                        data: DATA,
                        backgroundColor: colors, 
                        borderWidth: 3
                    }
                ]
            }, 
            options: {
                legend: {
                    display: true,
                    position: "left",
                    labels: {
                        fontColor: "rgb(33,33,33)",
                        fontSize: 14,
                        fontFamily: "Helvetica"
                    },
                }, 
                title: {
                    display: true,
                    text: "CANTIDAD DE SOPORTES",
                    fontSize: 22,
                    fontColor: "rgb(33,33,33)",
                    padding: 20
                }
            }
        });
    }, 
    // Get colors into array: 
    colorChart: (length) => {
        var colorArray = []; 

        for (let index = 0; index < length; index ++) {
            const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.7)`;
            colorArray.push(color); 
        }

        return colorArray;
    }
};

export default DRAW_CHART;