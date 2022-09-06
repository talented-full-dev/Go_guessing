import React, { Component } from 'react';
import Chart from 'react-apexcharts'
import UserService from "../../../services/user.service";

class BarChart extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          options: {
            chart: {
              id: "basic-bar"
            },
            xaxis: {
              categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
            }
          },
          series: [
            {
              name: "series-1",
              data: [30, 40, 45, 50, 49, 60, 70, 91]
            }
          ]
        };
      }

    async componentDidMount() {
        const results = await UserService.getTopPlayers()
        this.setState({options: {
            chart: {
              id: "basic-bar"
            },
            xaxis: {
              categories: results.map(x => x['username'])
            }
          },
          series: [
            {
              name: "score",
              data: results.map(x => x['score'])
            }
          ]
        })
        
    }

  render() {
    return (
        <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="bar"
              width="500"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default BarChart;