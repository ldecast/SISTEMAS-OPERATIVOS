var React = require('react');
var Component = React.Component;
var CanvasJSReact = require('canvasjs-react-charts');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Bars extends Component {

    render() {
        const options = {
            animationEnabled: true,
            theme: "dark1",
            backgroundColor: "transparent",
            height: 365,
            title: {
                text: ""
            },
            axisX: {
                title: "",
                reversed: true
            },
            axisY: {
                title: "VOTES",
                includeZero: true,
                labelFormatter: this.addSymbols
            },
            data: [{
                type: "bar",
                dataPoints: [
                    { y: this.props.upvotes, label: "UPVOTES" },
                    { y: this.props.downvotes, label: "DOWNVOTES" }
                ]
            }]
        }
        return (
            <CanvasJSChart options={options} />
        );
    }
    addSymbols(e) {
        var suffixes = ["", "K", "M", "B"];
        var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
        if (order > suffixes.length - 1)
            order = suffixes.length - 1;
        var suffix = suffixes[order];
        return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
    }
}

export default Bars;