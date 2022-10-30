(async function() {
    const data = await d3.json("my_weather_data.json");
    const dateParser = d3.timeParse("%Y-%m-%d");
    const xAccesor = d => dateParser(d.date)

    const dimension = {
        width: window.innerWidth * 0.9,
        height: 400,
        margin: {
            top: 15,
            left: 15,
            bottom: 15,
            right: 15
        },
        boundedWidth: 0,
        boundedHeight: 0
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    function buildChartBySelector(selector, xCb = () => {}, yCb = () => {}) {
        const wrapper = d3.select(selector);
        const svg = wrapper.append("svg")
        svg.attr("height", dimension.height);
        svg.attr("width", dimension.width);
        const bounded = svg.append("g");
        bounded.style("transform", `translate(${dimension.margin.left}px, ${dimension.margin.top})`);

        const yScaler = d3.scaleLinear()
            .domain(d3.extent(data, yCb))
            .range([dimension.boundedHeight, 0]);

        const xScaler = d3.scaleTime()
            .domain(d3.extent(data, xCb))
            .range([0, dimension.boundedWidth]);

        const lineGenerator = d3.line()
            .x(d => xScaler(xCb(d)))
            .y(d => yScaler(yCb(d)));

        bounded.append("path")
            .attr("d", lineGenerator(data))
            .attr("stroke", "lightgrey")
    }

    buildChartBySelector('#min', xAccesor, (d) => d.temperatureMin)
    buildChartBySelector('#high', xAccesor, (d) => d.temperatureHigh)
})()