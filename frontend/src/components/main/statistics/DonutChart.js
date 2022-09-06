import React, { Component } from 'react';
import Chart from 'react-apexcharts'
import UserService from "../../../services/user.service";
import ClipLoader from "react-spinners/ClipLoader";

class DonutChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      series: [],
      chartOptions: {
        labels: []
      }
    }

  }

  async componentDidMount() {
    const results = await UserService.getFavouriteScores()
    this.setState({
      series: results.map(x => x['Count']),
      chartOptions: {
        labels: results.map(x => x['Score'])
      }
    })
    this.setState({results: results})
  }
  render() {
    if (this.state.results) {
      return (
        <div className="donut">
          <Chart options={this.state.chartOptions} series={this.state.series} type="donut" width="400" />
        </div>
      );
    }
    else 
      return <div> <ClipLoader size={150} /></div>
  }
}

export default DonutChart;