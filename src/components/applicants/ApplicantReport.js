import React, { useState, useEffect } from 'react'
import { Line, Doughnut } from 'react-chartjs-2';
import moment from 'moment'

import { FaDownload } from "react-icons/fa"

function ApplicantReport(props) {

  // states: config
  const [option, setOption] = useState(0)

  // states: api-related
  const [applicants, setApplicants] = useState(props.applicants)

  // states: Months
  const [jan, setJan] = useState(0)
  const [feb, setFeb] = useState(0)
  const [mar, setMar] = useState(0)
  const [apr, setApr] = useState(0)
  const [may, setMay] = useState(0)
  const [jun, setJun] = useState(0)
  const [jul, setJul] = useState(0)
  const [aug, setAug] = useState(0)
  const [sep, setSep] = useState(0)
  const [oct, setOct] = useState(0)
  const [nov, setNov] = useState(0)
  const [dec, setDec] = useState(0)

  // states: Status
  const [inprogress, setInprogress] = useState(0)
  const [donescreening, setDonescreening] = useState(0)
  const [sendexam, setSendexam] = useState(0)
  const [passedexam, setPassedexam] = useState(0)
  const [passedinitial, setPassedinitial] = useState(0)
  const [passedfinal, setPassedfinal] = useState(0)
  const [completed, setCompleted] = useState(0)
  const [failed, setFailed] = useState(0)

  const arrayCountApplicantByMonths = [
    jan,
    feb,
    mar,
    apr,
    may,
    jun,
    jul,
    aug,
    sep,
    oct,
    nov,
    dec
  ]
  const arrayCountApplicantStatus = [
    inprogress,
    donescreening,
    sendexam,
    passedexam,
    passedinitial,
    passedfinal,
    completed,
    failed
  ]
  const optionsArray = [
    'Numbers of Applicants',
    'Status of Applications'
  ]

  const configData4Months = () => {

    let calculate_jan = 0
    let calculate_feb = 0
    let calculate_mar = 0
    let calculate_apr = 0
    let calculate_may = 0
    let calculate_jun = 0
    let calculate_jul = 0
    let calculate_aug = 0
    let calculate_sep = 0
    let calculate_oct = 0
    let calculate_nov = 0
    let calculate_dec = 0

    applicants.map(applicant => {
      let { date_applied } = applicant
      let dateApplied = moment(date_applied).format('LL')

      if (dateApplied.includes('January')) {
          calculate_jan = calculate_jan + 1
      } else if (dateApplied.includes('February')) {
          calculate_feb = calculate_feb + 1
      } else if (dateApplied.includes('March')) {
          calculate_mar = calculate_mar + 1
      } else if (dateApplied.includes('April')) {
          calculate_apr = calculate_apr + 1
      } else if (dateApplied.includes('May')) {
          calculate_may = calculate_may + 1
      } else if (dateApplied.includes('June')) {
          calculate_jun = calculate_jun + 1
      } else if (dateApplied.includes('July')) {
          calculate_jul = calculate_jul + 1
      } else if (dateApplied.includes('August')) {
          calculate_aug = calculate_aug + 1
      } else if (dateApplied.includes('September')) {
          calculate_sep = calculate_sep + 1
      } else if (dateApplied.includes('October')) {
          calculate_oct = calculate_oct + 1
      } else if (dateApplied.includes('November')) {
          calculate_nov = calculate_nov + 1
      } else if (dateApplied.includes('December')) {
          calculate_dec = calculate_dec + 1
      }

      setJan(calculate_jan)
      setFeb(calculate_feb)
      setMar(calculate_mar)
      setApr(calculate_apr)
      setMay(calculate_may)
      setJun(calculate_jun)
      setJul(calculate_jul)
      setAug(calculate_aug)
      setSep(calculate_sep)
      setOct(calculate_oct)
      setNov(calculate_nov)
      setDec(calculate_dec)
    })
  }

  const configData4Status = () => {

    let calculate_inprogress = 0
    let calculate_done_screening = 0
    let calculate_send_exam = 0
    let calculate_passed_exam = 0
    let calculate_passed_initial = 0
    let calculate_passed_final = 0
    let calculate_completed = 0
    let calculate_failed = 0

    applicants.map(applicant => {
      let { status } = applicant

      if (status === 'in progress') {
        calculate_inprogress++
      } else if (status === 'done screening') {
        calculate_done_screening++
      } else if (status === 'send exam') {
        calculate_send_exam++
      } else if (status === 'passed exam') {
        calculate_passed_exam++
      } else if (status === 'passed initial') {
        calculate_passed_initial++
      } else if (status === 'passed final') {
        calculate_passed_final++
      } else if (status === 'completed') {
        calculate_completed++
      } else if (status === 'failed') {
        calculate_failed++
      }

      setInprogress(calculate_inprogress)
      setDonescreening(calculate_done_screening)
      setSendexam(calculate_send_exam)
      setPassedexam(calculate_passed_exam)
      setPassedinitial(calculate_passed_initial)
      setPassedfinal(calculate_passed_final)
      setCompleted(calculate_completed)
      setFailed(calculate_failed)
    })
  }

  const handleOption = (event) => {
    if (event === 'Numbers of Applicants') {
      setOption(0)
    } else if (event === 'Status of Applications') {
      setOption(1)
    }

    console.log(event)
  }

  // Chart Configuration: Line
  const data_line = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Applicants Per Month',
        data: arrayCountApplicantByMonths,
        fill: false,
        backgroundColor: '#f1c40f',
        borderColor: '#7158e2',
        pointBorderColor: '#7d5fff',
        pointBorderWidth: 5,
        pointRadius: 8
      },
    ],
  }

  const options_line = {
    plugins: {
      legend: {
        display: false,
      }
    },
    scales: {
      y: {
        ticks: {
          color: '#fff',
          font: {
            size: 18
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.40)'
        }
      },
      x: {
        ticks: {
          color: '#fff',
          font: {
            size: 18
          }
        },
        grid: {
          color: '#3d3d3d'
        }
      }
    }
  }

  const data_doughnut = {
  labels: ['In Progress', 'Done Screening', 'Send Exam', 'Passed Exam', 'Passed Initial', 'Passed Final', 'Completed', 'Failed'],
  datasets: [
    {
      label: 'Status of Applications',
      data: arrayCountApplicantStatus,
      backgroundColor: [
        '#7158e2',
        '#f1c40f',
        '#1abc9c',
        '#3498db',
        '#e67e22',
        '#27ae60',
        '#574b90',
        '#e74c3c'
      ],
      borderColor: [
        '#7158e2',
        '#f1c40f',
        '#1abc9c',
        '#3498db',
        '#e67e22',
        '#27ae60',
        '#574b90',
        '#e74c3c'
      ],
      borderWidth: 1
    },
  ],
}

const options_doughnut = {
  plugins: {
    legend: {
      display: true,
      position: 'right',
      labels: {
        color: '#fff',
        padding: 20,
        boxWidth: 20
      }
    }
  }
}


  useEffect(() => {
    configData4Months()
    configData4Status()
  }, [])

  return (
    <div className="chart">
        <div className="chart-header">
          <div className="menu">
            <div className="menu-left">
              <label>Select by:</label>
              <select className="search" name='option' onChange={(e) => handleOption(e.target.value)}>
                {optionsArray.map((option, index) =>
                  <option key={index}>{option}</option>
                )}
              </select>
            </div>
          </div>
          <div className="action"><a className="add" onClick={() => console.log('export')}><FaDownload /> download to pdf</a></div>
        </div>
        <div className="chart-body">
          {
            option === 0 ? <Line data={data_line} options={options_line} /> :
            <div className="doughnut"><Doughnut data={data_doughnut} options={options_doughnut} /></div>
          }

        </div>
    </div>
  )
}

export default ApplicantReport
