import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import { FaUser, FaCheck, FaCheckCircle,  } from "react-icons/fa"
import { MdClose } from "react-icons/md"

import { api_4_applicants, api_4_exam_evaluation } from '../../api/apis'

function ApplicantInfo(props) {

  // props
  const id = props.applicantId

  // connect to applicants_api
  const applicants_api = api_4_applicants

  // connect to exams_api
  const exams_api = api_4_exam_evaluation

  // states: checker
  const [exchecker, setExchecker] = useState(false)
  const [examConfirmation, setExamConfirmation] = useState(false)

  // states: for api-related (Applicants)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState('')
  const [role, setRole] = useState('')
  const [level, setLevel] = useState('')
  const [department, setDepartment] = useState('')
  const [dateApplied, setDateApplied] = useState('')
  const [status, setStatus] = useState('')

  // states: for api-related (Exam Evaluation)
  const [applicantId, setApplicantId] = useState('')
  const [approach, setApproach] = useState('')
  const [attention, setAttention] = useState('')
  const [comprehension, setComprehension] = useState('')
  const [recommendation, setRecommendation] = useState('')
  const [responsiveness, setResponsiveness] = useState('')
  const [exam, setExam] = useState(0)

  const getApplicantById = (id) => {
    fetch(applicants_api + id)
      .then(res => res.json())
      .then(res => {
        let { name, email, contact, role, level, department, date_applied, status } = res
        setName(name)
        setEmail(email)
        setContact(contact)
        setRole(role)
        setLevel(level)
        setDepartment(department)
        setDateApplied(date_applied)
        setStatus(status)
      })
  }

  const getExamEvaluation = (id) => {
    fetch(exams_api + id)
      .then(res => res.json())
      .then(res => {
        console.log(res)
        if (res.length > 0) {
            setExchecker(true)
            res.map(exam => {
              let { approach, comprehension, responsiveness, attention, recommendation } = exam
              setApproach(approach)
              setComprehension(comprehension)
              setResponsiveness(responsiveness)
              setAttention(attention)
              setRecommendation(recommendation)

              // computation of exam rating
              let scale = 5 // rating scale
              let rates = [30, 20, 25, 25] // rating by percentage
              let passingRate = 60 // passing rate

              let totalApproach = approach / scale * rates[0]
              let totalComprehension = comprehension / scale * rates[1]
              let totalResponsiveness = responsiveness / scale * rates[2]
              let totalAttention = responsiveness / scale * rates[3]

              let examRating = totalApproach + totalComprehension + totalResponsiveness + totalAttention
              setExam(examRating)

              if (examRating >= passingRate) {
                setExamConfirmation(true)
              } else {
                setExamConfirmation(false)
              }
            })
        } else {
          setExchecker(false)
        }
      })
  }

  const handleExamEvaluation = (event) => {
    event.preventDefault()

    const exam = {
      applicantId,
      approach,
      attention,
      comprehension,
      recommendation,
      responsiveness
    }

    if (exchecker === false) {
      axios.post(exams_api, exam)
        .then(res => console.log('exam evaluation added'))
        .then(res => setExchecker(true))
        .then(res => getExamEvaluation(id))
        .catch(error => console.log(error.message))
    } else {
      // console.log(exam)
      // console.log(exams_api + id)
      axios.patch(exams_api + id, exam)
        .then(res => console.log('exam evaluation updated'))
        .then(res => setExchecker(true))
        .then(res => getExamEvaluation(id))
        .catch(error => console.log(error.message))
    }


  }

  useEffect(() => {
    getApplicantById(id)
    getExamEvaluation(id)

    // set state applicantId = props.id
    setApplicantId(id)
    console.log(exchecker)
  }, [])

  return (
    <div>
      <div className="personal-details">
        <div className="profile"><FaUser /></div>
        <div className="information">
          <h2>{name}</h2>
          <p>{email}</p>
          <button className="button resend">resend exam</button>
        </div>
      </div>
      <div className="content">
        <h3>applicant information</h3>
        <ul>
          <li>Contact Number: {contact}</li>
          <li>Role: {role} - {level}</li>
          <li>Department:<span className={department === 'Creatives - UK' ? "badge badge-uk" : "badge badge-us"}>{department}</span></li>
          <li>Date Applied: {moment(dateApplied).format('MMMM Do YYYY')}</li>
          <li>Status of Application: {status}</li>
        </ul>
      </div>
      <div className="content">
        <h3>exam evaluation</h3>
        <div className="evaluation">
          <div className="evaluate-left">
            <form className="form" onSubmit={(e) => handleExamEvaluation(e)}>
              <div className="form-group">
                <label>Coding Style/Approach
                  <input className="form-control" type="text" name='approach' value={approach} onChange={(e) => setApproach(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Brief Comprehension
                  <input className="form-control" type="text" name='comprehension' value={comprehension} onChange={(e) => setComprehension(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Responsiveness
                  <input className="form-control" type="text" name='responsiveness' value={responsiveness} onChange={(e) => setResponsiveness(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Attention To Detail
                  <input className="form-control" type="text" name='attention' value={attention} onChange={(e) => setAttention(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Recommendation
                  <input className="form-control" type="textarea" name='recommendation' value={recommendation} onChange={(e) => setRecommendation(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                {
                  exchecker === true ? <button className="button save" type='submit'>update</button> : <button className="button add" type='submit'>update</button>
                }

              </div>
            </form>
          </div>
          <div className="evaluate-right">
            <div className="evaluate-result">
              <div className={examConfirmation === true ? "icon passed" : "icon failed"}>{examConfirmation === true ? <FaCheck /> : <MdClose />}</div>
              <p className="text">exam rating:</p>
              <h1 className="score">{exam}<span>%</span></h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicantInfo
