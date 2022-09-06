import React, { Component } from 'react';
import Chart from 'react-apexcharts'
import UserService from "../../../services/user.service";
import ClipLoader from "react-spinners/ClipLoader";

class LineChart extends Component {
    
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      options: {},
      series: [{
        data: [],
    }],
    xaxis: {
      type: 'category'
    }
    }
  }

  async componentDidMount() {
    const results = await UserService.getPredictiosByMatches()
    this.setState({results: results})
    this.setState({options: {
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          categories: results.map(x => x['Name'])
        }
      },
      series: [
        {
          name: "number of predictons",
          data: results.map(x => x['Count'])
        }
      ]
    })
    
}

  render() {
    if (this.state.results) {
      return (
        <div className="donut">
          <Chart
              options={this.state.options}
              series={this.state.series}
              type="line"
              width="500"
          />
        </div>
      );
    } else {
      return <div> <ClipLoader size={150} /></div>
    }
  }
}

export default LineChart;