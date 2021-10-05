var React = require('react');
var Component = React.Component;
var CanvasJSReact = require('canvasjs-react-charts');
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Pie extends Component {

    getPercent(array) {
        let tmp = 0, total = 0;
        let percents = [];
        for (let i = 0; i < array.length; i++) {
            const element = array[i].counter;
            total += element;
        }
        for (let i = 0; i < array.length; i++) {
            const element = array[i].counter;
            tmp = (element / total) * 100
            percents.push(tmp.toFixed(2));
        }
        return percents;
    }

    getPoints(array, percents) {
        let points = [];
        for (let i = 0; i < array.length; i++) {
            points.push({
                y: percents[i],
                label: array[i].tag,
                indexLabelFontColor: "black"
            });
        }
        return points;
    }

    render() {
        let percents = this.getPercent(this.props.top_five);
        let points = this.getPoints(this.props.top_five, percents);
        const options = {
            theme: "dark1",
            backgroundColor: "#15181c",
            height: 325,
            animationEnabled: true,
            exportFileName: "Top 5 Hashtags",
            exportEnabled: true,
            title: {
                text: ""
            },
            legend: {
                fontColor: "white",
                padding: 8
            },
            data: [{
                type: "pie",
                showInLegend: true,
                legendText: "{label}",
                toolTipContent: "{label}: <strong>{y}%</strong>",
                indexLabel: "{y}%",
                indexLabelPlacement: "inside",
                dataPoints: points
            }]
        }
        return (
            <CanvasJSChart options={options} />
        );
    }
}

export default Pie;