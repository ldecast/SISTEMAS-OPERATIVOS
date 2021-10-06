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

    checkTop(tmp, obj) {
        for (let i = 0; i < tmp.length; i++) {
            const element = tmp[i];
            if (element.tag === obj.tag) {
                return i;
            }
        }
        return -1;
    }

    getTop(array) {
        let tmp = [];
        for (let i = 0; i < array.length; i++) {
            const obj = array[i];
            let index = this.checkTop(tmp, obj);
            if (index === -1)
                tmp.push(obj)
            else
                tmp[index].counter += obj.counter;
        }
        tmp.sort((a, b) => (a.counter < b.counter) ? 1 : -1)
        // console.log(tmp)
        return tmp.slice(0, 5);
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
        let top = this.getTop(this.props.top_five);
        let percents = this.getPercent(top);
        let points = this.getPoints(top, percents);
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