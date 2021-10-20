import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaFileCode, FaStar } from "react-icons/fa"
import { MdScreenSearchDesktop, MdPersonSearch } from "react-icons/md"

import { api_4_applicants } from '../../api/apis'

function ApplicantStats() {

  // connect to applicants_api
  const applicants_api = api_4_applicants

  // states: for api-related
  const [applicants, setApplicants] = useState([])

  // states: for Statistics
  const [screening, setScreening] = useState(0)
  const [exam, setExam] = useState(0)
  const [initial, setInitial] = useState(0)
  const [final, setFinal] = useState(0)

  const getStatistics = () => {

    fetch(applicants_api)
      .then(res => res.json())
      .then(res => {
        let totalScreening = 0
        let totalExam = 0
        let totalInitial = 0
        let totalFinal = 0

        res.map(applicant => {

            let status = applicant.status


            if (status === 'done screening') {
              totalScreening = totalScreening + 1
            } else if (status === 'passed exam') {
              totalScreening = totalScreening + 1
              totalExam = totalExam + 1
            } else if (status === 'initial interview') {
              totalScreening = totalScreening + 1
              totalExam = totalExam + 1
              totalInitial = totalInitial + 1
            } else if (status === 'final interview') {
              totalScreening = totalScreening + 1
              totalExam = totalExam + 1
              totalInitial = totalInitial + 1
              totalFinal = totalFinal + 1
            }

            setScreening(totalScreening)
            setExam(totalExam)
            setInitial(totalInitial)
            setFinal(totalFinal)
        })
      })
  }

  useEffect(() => {
    getStatistics()
  }, [])

  return (
    <div className="statistics">
      <div className="row">
        <div className="stat-content screening">
          <div className="img-container">
            <MdScreenSearchDesktop />
          </div>
          <div className="body">
            <p className="stat-description">passed screening</p>
            <h2 className="stat-value">{screening}</h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="stat-content passed-exam">
          <div className="img-container">
            <FaFileCode />
          </div>
          <div className="body">
            <p className="stat-description">passed exam</p>
            <h2 className="stat-value">{exam}</h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="stat-content passed-initial">
          <div className="img-container">
            <MdPersonSearch />
          </div>
          <div className="body">
            <p className="stat-description">passed initial</p>
            <h2 className="stat-value">{initial}</h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="stat-content passed-final">
          <div className="img-container">
            <FaStar />
          </div>
          <div className="body">
            <p className="stat-description">passed final</p>
            <h2 className="stat-value">{final}</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicantStats
