import React, { useState, useEffect } from 'react'
import { Radar } from 'react-chartjs-2';

function ExamChart(props) {

  const { approach, attention, comprehension, responsiveness } = props

  const data = {
    labels: ['Coding Style/Approach', 'Atttention To Detail', 'Brief Comprehension', 'Responsiveness'],
    datasets: [
      {
        label: '# of Votes',
        data: [approach, attention, comprehension, responsiveness],
        backgroundColor: 'rgba(142, 68, 173, .5)',
        borderColor: 'rgba(155, 89, 182,1.0)',
        borderWidth: 1,
        borderDash: 5,
        label: {
          color: '#fff'
        }
      },
    ],
  }

  const options = {
    plugins: {
      labels: {
        color: '#fff'
      },
      legend: {
        display: false
      }
    },
    scale: {
      ticks: {
        beginAtZero: true,
        color: '#fff'
      }
    },
  }

  useEffect(() => {

  }, [])

  return (
    <div>
      <Radar data={data} options={options} />
    </div>
  )
}

export default ExamChart
