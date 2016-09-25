//====
// D3
//====

function buildD3Scatterplot() {
  fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
      // console.log(data);

      var width = 1024,
        height =  768,
        radius = 5,
        padding = 120;

      // Create a hidden tooltip element
      var div = d3.select("#app").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      // Create the SVG
      var svg = d3.select(".chart")
        .attr("width", width)
        .attr("height", height);

      var minSeconds = d3.min(data, function(d) {
        return d.Seconds;
      });

      var maxSeconds = d3.max(data, function(d) {
        return d.Seconds;
      });

      var secondsScale = d3.scaleLinear()
        .domain([maxSeconds + 10, minSeconds])
        .range([0, width - 360]);

      var secondsScaleAxis = d3.scaleLinear()
        .domain([new Date(Math.abs(minSeconds - maxSeconds + 10) * 1000), new Date(0)])
        .range([0, width - 360]);

      var placeScale = d3.scaleLinear()
        .domain([1, data.length + 1])
        .range([padding, height - padding]);

      // Add dots
      var dots = svg.selectAll("circle")
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', function(d) { return secondsScale(d.Seconds) })
        .attr('cy', function(d) { return placeScale(d.Place) })
        .attr('r', radius)
        .attr('fill', function(d) { return (d.Doping ? '#994242' : '#78AA78') })
        .attr('transform', 'translate(' + padding + ', 0)');

      // Cyclist Names
      var names = svg.selectAll('.name')
        .data(data)
        .enter()
        .append('text')
        .attr('x', function(d) { return secondsScale(d.Seconds) })
        .attr('y', function(d) { return placeScale(d.Place) })
        .text(function(d) { return d.Name })
        .attr('class', 'name')
        .attr('transform', 'translate(' + (padding + 15)+ ', 5)')
        .on('mouseover', function(d) {
          div.transition()
            .duration(200)
            .style('opacity', .9);
          div.html('<div>' + d.Name + '</div>' +
            '<div><strong>' + d.Nationality + '</strong></div>' +
            '<label>Time</label><div>' + d.Time + '</div>' +
            '<label>Year Accomplished</label><div>' + d.Year + '</div>' +
            '<label>' + (d.Doping && 'Doping:') + '</label><p>' + d.Doping + '</p>'
          )
            .style('left', '50%')
            .style('top', '45%');
        })
        .on('mouseout', function(d) {
          div.transition()
            .duration(500)
            .style('opacity', 0);
        });

      // Y-Axis
      var yAxis = svg.append('g').call(d3.axisLeft(placeScale).ticks(8))
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding + ', 0)');

      // X-Axis
      var xAxis = svg.append('g').call(d3.axisBottom(secondsScaleAxis).ticks(10).tickFormat(d3.timeFormat('%M:%S')))
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding + ', ' + (height - padding) + ')');

      xAxis.selectAll('text')
        .attr('x', 25)
        .attr('dy', 15);

      // Labels
      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + padding/2 + ', ' + padding + ')rotate(-90)')
        .text('Ranking');

      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + (width/2 + padding) + ', ' + (height - padding/2) + ')')
        .text('Minutes Behind Fastest Time');

      svg.append('text')
        .attr('transform', 'translate(' + (width / 2) + ', ' + 40 + ')')
        .text('Doping in Professional Bicycle Racing')
        .attr('font', '30px sans-serif');

    });
}

//=======
// React
//=======

const { Component, PropTypes } = React;

class Chart extends Component {
  componentDidMount() {
    let style = {

    };
    buildD3Scatterplot();
  }

  render() {
    return (
      <div className="scatterplot-chart">
        <h1 className="scatterplot-title"></h1>
        <p className="scatterplot-info"></p>
        <svg className="chart"></svg>
      </div>
    );
  }
}

Chart.propTypes = {

};

//============================================================================
// App Component
//----------------------------------------------------------------------------
//
//============================================================================
class App extends Component {
  constructor(props, context) {
    super(props, context);

  }

  render() {
    return (
      <div className="App">
        <Chart />
      </div>
    );
  }
}

App.propTypes = {

};

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
