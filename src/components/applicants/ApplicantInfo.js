import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import { FaUser, FaCheck, FaCheckCircle,  } from "react-icons/fa"
import { MdClose } from "react-icons/md"

import { api_4_applicants, api_4_exam_evaluation, api_4_initial_interview, api_4_final_interview } from '../../api/apis'

function ApplicantInfo(props) {

  // props
  const id = props.applicantId

  // connect to applicants_api
  const applicants_api = api_4_applicants

  // connect to exams_api
  const exams_api = api_4_exam_evaluation

  // connect to initials_api
  const initials_api = api_4_initial_interview

  // connect to finals_api
  const finals_api = api_4_final_interview

  // states: confirmation
  const [alert, setAlert] = useState('')

  // states: checker
  const [exchecker, setExchecker] = useState(false)
  const [examConfirmation, setExamConfirmation] = useState(false)
  const [inchecker, setInchecker] = useState(false)
  const [initialConfirmation, setInitialConfirmation] = useState(false)
  const [fichecker, setFichecker] = useState(false)
  const [finalConfirmation, setFinalConfirmation] = useState(false)

  // states: for api-related (Applicants)
  const [applicantId, setApplicantId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState('')
  const [role, setRole] = useState('')
  const [level, setLevel] = useState('')
  const [department, setDepartment] = useState('')
  const [dateApplied, setDateApplied] = useState('')
  const [status, setStatus] = useState('')

  // states: for api-related (Exam Evaluation)
  const [approach, setApproach] = useState('')
  const [attention, setAttention] = useState('')
  const [comprehension, setComprehension] = useState('')
  const [recommendation, setRecommendation] = useState('')
  const [responsiveness, setResponsiveness] = useState('')
  const [exam, setExam] = useState(0)

  // states: for api-related (Inital Interview)
  const [schedule, setSchedule] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [communication, setCommunication] = useState('')
  const [experience, setExperience] = useState('')
  const [coding, setCoding] = useState('')
  const [culture, setCulture] = useState('')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [decline, setDecline] = useState('Availability')
  const [recommendation2, setRecommendation2] = useState('')
  const [initial, setInitial] = useState(0)

  // states: for api-related (Final Interview)
  const [schedule2, setSchedule2] = useState('')
  const [attitude, setAttitude] = useState('')
  const [communication2, setCommunication2] = useState('')
  const [culture2, setCulture2] = useState('')
  const [knowledge, setKnowledge] = useState('')
  const [decline2, setDecline2] = useState('Availability')
  const [recommendation3, setRecommendation3] = useState('')
  const [final, setFinal] = useState(0)


  // list of decline reasons (Initial Interview)
  const declineReasonArray = [
    'Availability',
    'Culture Fit',
    'Job Fit',
    'Experience',
    'Technical',
    'Soft Skills',
    'Salary',
    'Others',
    'N/A',
    'No Show'
  ]

  const emailExam = (event) => {
    event.preventDefault()

    const sendExam = {
      email,
      role,
      level,
      department
    }

    axios.post(applicants_api + "mail", sendExam)
         .then(res => {
           console.log('sending exam')
           setAlert('success')
           setTimeout(() => {
             setAlert('')
           }, 5000)
         })
         .catch(error => console.log(error.message))
  }

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
      .catch(error => console.log(error.message))
  }

  const getInitialInterview = (id) => {
    fetch(initials_api + id)
      .then(res => res.json())
      .then(res => {
        if (res.length > 0) {
          setInchecker(true)
          res.map(initial => {
            let { schedule, portfolio, communication, experience, coding, culture, pros, cons, decline, recommendation } = initial
            setSchedule(schedule)
            setPortfolio(portfolio)
            setCommunication(communication)
            setExperience(experience)
            setCoding(coding)
            setCulture(culture)
            setPros(pros)
            setCons(cons)
            setDecline(decline)
            setRecommendation2(recommendation)

            // computation of initial interview rating
            let scale = 5 // rating scale
            let rates = [20, 25, 25, 25, 5] // rating by percentage
            let passingRate = 60 // passing rate

            let totalPortfolio = portfolio / scale * rates[0]
            let totalCommunication = communication / scale * rates[1]
            let totalExperience = experience / scale * rates[2]
            let totalCoding = coding / scale * rates[3]
            let totalCulture = coding / scale * rates[4]

            let initialRating = totalPortfolio + totalCommunication + totalExperience + totalCoding + totalCulture
            setInitial(initialRating)

            if (initialRating >= passingRate) {
              setInitialConfirmation(true)
            } else {
              setInitialConfirmation(false)
            }
          })
        } else {
          setInchecker(false)
        }
      })
      .catch(error => console.log(error.message))
  }

  const getFinalInterview = (id) => {
    fetch(finals_api + id)
      .then(res => res.json())
      .then(res => {
        if (res.length > 0) {
          setFichecker(true)
          res.map(final => {
            let { schedule, attitude, communication, culture, knowledge, decline, recommendation } = final
            setSchedule2(schedule)
            setAttitude(attitude)
            setCommunication2(communication)
            setCulture2(culture)
            setKnowledge(knowledge)
            setDecline2(decline)
            setRecommendation3(recommendation)

            // computation of initial interview rating
            let scale = 5 // rating scale
            let rates = [30, 15, 35, 20] // rating by percentage
            let passingRate = 60 // passing rate

            let totalAttitude = attitude / scale * rates[0]
            let totalCommunication = communication / scale * rates[1]
            let totalCulture = culture / scale * rates[2]
            let totalKnowledge = knowledge / scale * rates[3]

            let finalRating = totalAttitude + totalCommunication + totalCulture + totalKnowledge
            setFinal(finalRating)

            if (finalRating >= passingRate) {
              setFinalConfirmation(true)
            } else {
              setFinalConfirmation(false)
            }
          })
        } else {
          setFichecker(false)
        }
      })
      .catch(error => console.log(error.message))
  }

  const updateApplicantStatus = (value) => {
    const applicant = {
      status: value
    }
    
    axios.patch(applicants_api + id, applicant)
      .then(res => console.log('status updated'))
      .catch(error => console.error(error.message))
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
        .then(res => {
          setStatus('initial interview')
          updateApplicantStatus('initial interview')
        })
        .then(res => setExchecker(true))
        .then(res => getExamEvaluation(id))
        .catch(error => console.log(error.message))
    } else {
      axios.patch(exams_api + id, exam)
        .then(res => console.log('exam evaluation updated'))
        .then(res => setExchecker(true))
        .then(res => getExamEvaluation(id))
        .catch(error => console.log(error.message))
    }


  }

  const handleInitialInteview = (event) => {
    event.preventDefault()

    const initialInterview = {
      applicantId,
      schedule: moment(schedule).format(),
      portfolio,
      communication,
      experience,
      coding,
      culture,
      pros,
      cons,
      decline,
      recommendation: recommendation2
    }

    if (inchecker === false) {
      axios.post(initials_api, initialInterview)
        .then(res => {
          setStatus('final interview')
          updateApplicantStatus('final interview')
        })
        .then(res => setInchecker(true))
        .then(res => getInitialInterview(id))
        .catch(error => console.log(error.message))
    } else {
      axios.patch(initials_api + id, initialInterview)
        .then(res => console.log('initial interview updated'))
        .then(res => setInchecker(true))
        .then(res => getInitialInterview(id))
        .catch(error => console.log(error.message))
    }
  }

  const handleFinalInterview = (event) => {
    event.preventDefault()

    const finalInterview = {
      applicantId,
      schedule: moment(schedule2).format(),
      attitude,
      communication: communication2,
      culture: culture2,
      knowledge,
      decline: decline2,
      recommendation: recommendation3
    }

    console.log(finalInterview)

    if (fichecker === false) {
      axios.post(finals_api, finalInterview)
        .then(res => {
          setStatus('completed')
          updateApplicantStatus('completed')
        })
        .then(res => setFichecker(true))
        .then(res => getFinalInterview(id))
        .catch(error => console.log(error.message))
    } else {
      axios.patch(finals_api + id, finalInterview)
        .then(res => console.log('final interview updated'))
        .then(res => setFichecker(true))
        .then(res => getFinalInterview(id))
        .catch(error => console.log(error.message))
    }
  }

  useEffect(() => {
    getApplicantById(id)
    getExamEvaluation(id)
    getInitialInterview(id)
    getFinalInterview(id)

    // set state applicantId = props.id
    setApplicantId(id)
  }, [])

  return (
    <div>
      <div className="personal-details">
        <div className="profile"><FaUser /></div>
        <div className="information">
          <div>
            <h2>{name}
              <span className="hired">
                { examConfirmation === true && initialConfirmation === true && finalConfirmation === true ? <FaCheckCircle /> : '' }
              </span>
            </h2>
            <p>{email}</p>
            <div className="exam-content">
              <button type="button" className="button resend" onClick={(e) => emailExam(e)}>resend exam</button>
              {
                alert === 'success' ? <div className="alert success"><p>exam has been emailed successfully!</p></div> : ''
              }
            </div>

          </div>
        </div>
        <div className={ exam !== 0 && initial !== 0 && final !== 0 ? "overall active" : "overall" }>
          <div>
            {
              exam !== 0 && initial !== 0 && final !== 0 ? Math.round((exam + initial + final) / 3) : ''
            }
          </div>
          <span>overall</span>
        </div>
      </div>
      <div className="content">
        <h3>applicant information</h3>
        <ul>
          <li>Contact Number: {contact}</li>
          <li>Role: {role} - {level}</li>
          <li>Department: {department}</li>
          <li>Date Applied: {moment(dateApplied).format("MMMM Do YYYY")}</li>
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
                  <input className="form-control" type="text" name="approach" value={approach} onChange={(e) => setApproach(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Brief Comprehension
                  <input className="form-control" type="text" name="comprehension" value={comprehension} onChange={(e) => setComprehension(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Responsiveness
                  <input className="form-control" type="text" name="responsiveness" value={responsiveness} onChange={(e) => setResponsiveness(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Attention To Detail
                  <input className="form-control" type="text" name="attention" value={attention} onChange={(e) => setAttention(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Recommendation
                  <input className="form-control" type="textarea" name="recommendation" value={recommendation} onChange={(e) => setRecommendation(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                {
                  exchecker === true ? <button className="button save" type="submit">update</button> : <button className="button add" type="submit">update</button>
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
      <div className="content">
        <h3>initial interview</h3>
        <div className="evaluation">
          <div className="evaluate-left">
            <form className="form" onSubmit={(e) => handleInitialInteview(e)}>
              <div className="form-group">
                <label>Schedule
                  <input className="form-control" type="datetime-local" name="schedule" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Portfolio Review
                  <input className="form-control" type="text" name="portfolio" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Communication Skills
                  <input className="form-control" type="text" name="communication" value={communication} onChange={(e) => setCommunication(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Relevant Experience
                  <input className="form-control" type="text" name="experience" value={experience} onChange={(e) => setExperience(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Coding Style/Approach
                  <input className="form-control" type="text" name="coding" value={coding} onChange={(e) => setCoding(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Culture Fit
                  <input className="form-control" type="text" name="culture" value={culture} onChange={(e) => setCulture(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Pros
                  <input className="form-control" type="text" name="pros" value={pros} onChange={(e) => setPros(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Cons
                  <input className="form-control" type="text" name="cons" value={cons} onChange={(e) => setCons(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Decline Reason
                  <select className="form-control" name='decline' value={decline} onChange={(e) => setDecline(e.target.value)}>
                    {declineReasonArray.map(reason =>
                      <option key={reason}>{reason}</option>
                    )}
                  </select>
                </label>
              </div>
              <div className="form-group">
                <label>Recommendation
                  <input className="form-control" type="text" name="recommendation2" value={recommendation2} onChange={(e) => setRecommendation2(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                {
                  inchecker === true ? <button className="button save" type="submit">update</button> : <button className="button add" type="submit">update</button>
                }
              </div>
            </form>
          </div>
          <div className="evaluate-right">
            <div className="evaluate-result">
              <div className={initialConfirmation === true ? "icon passed" : "icon failed"}>{initialConfirmation === true ? <FaCheck /> : <MdClose />}</div>
              <p className="text">initial interview rating:</p>
              <h1 className="score">{initial}<span>%</span></h1>
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <h3>final interview</h3>
        <div className="evaluation">
          <div className="evaluate-left">
            <form className="form" onSubmit={(e) => handleFinalInterview(e)}>
              <div className="form-group">
                <label>Schedule
                  <input className="form-control" type="datetime-local" name="schedule2" value={schedule2} onChange={(e) => setSchedule2(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Attitude/Motivation
                  <input className="form-control" type="text" name="attitude" value={attitude} onChange={(e) => setAttitude(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Communication Skills
                  <input className="form-control" type="text" name="communication2" value={communication2} onChange={(e) => setCommunication2(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Culture Fit
                  <input className="form-control" type="text" name="culture2" value={culture2} onChange={(e) => setCulture2(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Industry Knowledge
                  <input className="form-control" type="text" name="knowledge" value={knowledge} onChange={(e) => setKnowledge(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                <label>Decline Reason
                  <select className="form-control" name="decline2" value={decline2} onChange={(e) => setDecline2(e.target.value)}>
                    {declineReasonArray.map(reason =>
                      <option key={reason}>{reason}</option>
                    )}
                  </select>
                </label>
              </div>
              <div className="form-group">
                <label>Recommendation
                  <input className="form-control" type="text" name="recommendation3" value={recommendation3} onChange={(e) => setRecommendation3(e.target.value)} />
                </label>
              </div>
              <div className="form-group">
                {
                  fichecker === true ? <button className="button save" type="submit">update</button> : <button className="button add" type="submit">update</button>
                }
              </div>
            </form>
          </div>
          <div className="evaluate-right">
            <div className="evaluate-result">
              <div className={finalConfirmation === true ? "icon passed" : "icon failed"}>{finalConfirmation === true ? <FaCheck /> : <MdClose />}</div>
              <p className="text">final interview rating:</p>
              <h1 className="score">{final}<span>%</span></h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicantInfo
