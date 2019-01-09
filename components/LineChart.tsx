import * as d3 from 'd3';
import React, { Component } from 'react';

interface ILineChartProps {
  data: any;
}

class LineChart extends Component<ILineChartProps> {
  private node: any;
  constructor(props) {
    super(props);
    this.createLineChart = this.createLineChart.bind(this);
  }

  // tslint:disable-next-line member-access
  componentDidMount() {
    this.createLineChart();
  }

  // tslint:disable-next-line member-access
  componentDidUpdate() {
    this.createLineChart();
  }

  // tslint:disable-next-line member-access
  createLineChart() {
    const _self = this;
    const node = this.node;
    const width = 500;
    const height = 500;
    const margin = 50;
    const x = d3
      .scaleLinear()
      .domain([0, 10])
      .range([margin, width - margin]);
    const y = d3
      .scaleLinear()
      .domain([0, 10])
      .range([height - margin, margin]);

    d3.range(10).map((i) => {
      return { x: i, y: Math.sin(i) + 5 };
    });

    const line = d3
      .line()
      .x((d: any) => {
        return x(d.x);
      })
      .y((d: any) => {
        return y(d.y);
      });

    const svg = d3.select(node);

    svg.attr('height', height).attr('width', width);

    svg
      .selectAll('path')
      .data(_self.props.data)
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('d', (d: any) => {
        return line(d);
      });

    renderAxes(svg);

    // tslint:disable-next-line
    function renderAxes(svg) {
      // @ts-ignore
      const xAxis = d3
        .axisBottom()
        .scale(x.range([0, quadrantWidth()]))
        .scale(x);

      // @ts-ignore
      const yAxis = d3
        .axisLeft()
        .scale(y.range([quadrantHeight(), 0]))
        .scale(y);

      svg
        .append('g')
        .attr('class', 'axis')
        .attr('transform', () => {
          return 'translate(' + xStart() + ',' + yStart() + ')';
        })
        .call(xAxis);

      svg
        .append('g')
        .attr('class', 'axis')
        .attr('transform', () => {
          return 'translate(' + xStart() + ',' + yEnd() + ')';
        })
        .call(yAxis);
    }

    function xStart() {
      return margin;
    }
    function yStart() {
      return height - margin;
    }
    // function xEnd() {
    //   return width - margin;
    // }
    function yEnd() {
      return margin;
    }
    function quadrantWidth() {
      return width - 2 * margin;
    }
    function quadrantHeight() {
      return height - 2 * margin;
    }
  }

  // tslint:disable-next-line member-access
  render() {
    return <svg ref={node => (this.node = node)} />;
  }
}

export default LineChart;
