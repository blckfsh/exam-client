import React, { useState, useEffect } from 'react'
import { PolarArea } from 'react-chartjs-2';

function InitialChart(props) {

  const { portfolio, communication, experience, coding, culture } = props

  const data = {
  labels: ['Portfolio Review', 'Communication Skills', 'Relevant Experience', 'Coding Style/Approach', 'Culture Fit'],
  datasets: [
    {
      label: 'Initial Interview Evaluation',
      data: [portfolio, communication, experience, coding, culture],
      backgroundColor: [
        'rgba(241, 196, 15, 0.5)',
        'rgba(39, 174, 96, 0.5)',
        'rgba(52, 152, 219, 0.5)',
        'rgba(142, 68, 173, 0.5)',
        'rgba(230, 126, 34, 0.5)'
      ],
      weight: 0,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
    },
  ],
};

  const options = {
    plugins: {
      legend: {
        display: false,
      }
    }
  }

  useEffect(() => {

  }, [])

  return (
    <div>
      <PolarArea data={data} options={options} />
    </div>
  )
}

export default InitialChart
