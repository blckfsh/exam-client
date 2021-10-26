import React, { useState, useEffect } from 'react'
import { PolarArea } from 'react-chartjs-2';

function FinalChart(props) {

  const { attitude, communication2, culture2, knowledge } = props

  const data = {
  labels: ['Attitude/Motivation', 'Communication Skills', 'Culture Fit', 'Industry Knowledge'],
  datasets: [
    {
      label: 'Final Interview Evaluation',
      data: [attitude, communication2, culture2, knowledge],
      backgroundColor: [
        'rgba(241, 196, 15, 0.5)',
        'rgba(39, 174, 96, 0.5)',
        'rgba(52, 152, 219, 0.5)',
        'rgba(142, 68, 173, 0.5)'
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

export default FinalChart
