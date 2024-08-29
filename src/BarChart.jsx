import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import AccessibilityModule from 'highcharts/modules/accessibility';
import React, { useContext } from "react";
import { DataContext } from "./App";
AccessibilityModule(Highcharts);
function BarChart() {
    const { selectedFieldData } = useContext(DataContext);
    const getYears = () => {
        const years = selectedFieldData.values.map(val => val.year);
        return [...new Set(years)].sort((a, b) => b - a).slice(0, 4);};
        
        const getValuesForYears = () => {
            const years = getYears();
            return years.map(year => {
                const entry = selectedFieldData.values.find(val => val.year === year);
                return entry && parseFloat(entry.value) ;
            });
        };
    
        const years = getYears();
        const values = getValuesForYears();
        const minValue = Math.min(...values);

    const chartOptions = {
        chart: {
            type: 'column',
        },
        title: {
            text: selectedFieldData.nameEn || "Financial Ratio",
        },
        xAxis: {
            categories: years,
            crosshair: true,
            labels: {
                rotation: 0,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                },
            },
            tickInterval: 1,
        },
        yAxis: {
            min: minValue < 0 ? minValue : 0,
             title: {
                text: 'Value',
            },
            labels: {
                format: '{value}',
            },
        },
        series: [{
            name: selectedFieldData.nameEn,
            data: values,
            dataLabels: {
                enabled: true,
                color: '#000000',
                align: 'center',
                format: '{point.y:.1f}',
                y: 0,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                },
            },
            color: '#2b3e50',
        }],
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
            },
            series: {
                pointWidth: 30,
            },
        },
        credits: {
            enabled: false,
        },
    };

    return (
        <div>
            {selectedFieldData ? (
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
}

export default React.memo(BarChart);
