import React, { useState, useEffect } from 'react'
import { useForm, useFormState } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import axios from 'axios'
import moment from 'moment'
import parse from 'html-react-parser'
import { FaUser, FaCheck, FaCheckCircle, FaFileContract, FaQuestionCircle } from "react-icons/fa"
import { MdClose } from "react-icons/md"
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'

import 'react-datepicker/dist/react-datepicker.css'

import ExamChart from './charts/exam.js'
import InitialChart from './charts/initial.js'
import FinalChart from './charts/final.js'
import { api_4_applicants, api_4_exam_evaluation, api_4_initial_interview, api_4_final_interview, api_4_logs } from '../../api/apis'

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

  // connect to logs_api
  const logs_api = api_4_logs

  // states: confirmation
  const [alert, setAlert] = useState('')

  // states: checker
  const [exchecker, setExchecker] = useState(false)
  const [examConfirmation, setExamConfirmation] = useState(false)
  const [inchecker, setInchecker] = useState(false)
  const [initialConfirmation, setInitialConfirmation] = useState(false)
  const [fichecker, setFichecker] = useState(false)
  const [finalConfirmation, setFinalConfirmation] = useState(false)
  const [viewExamLogs, setViewExamLogs] = useState(false)
  const [viewInitialLogs, setViewInitialLogs] = useState(false)
  const [viewFinalLogs, setViewFinalLogs] = useState(false)

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
  const [approach, setApproach] = useState(0)
  const [attention, setAttention] = useState(0)
  const [comprehension, setComprehension] = useState(0)
  const [recommendation, setRecommendation] = useState('')
  const [responsiveness, setResponsiveness] = useState(0)
  const [exam, setExam] = useState(0)

  // states: for api-related (Inital Interview)
  const [schedule, setSchedule] = useState('')
  const [portfolio, setPortfolio] = useState(0)
  const [communication, setCommunication] = useState(0)
  const [experience, setExperience] = useState(0)
  const [coding, setCoding] = useState(0)
  const [culture, setCulture] = useState(0)
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [decline, setDecline] = useState('Availability')
  const [recommendation2, setRecommendation2] = useState('')
  const [initial, setInitial] = useState(0)
  const [initialReport, setInitialReport] = useState([])

  // states: for api-related (Final Interview)
  const [schedule2, setSchedule2] = useState('')
  const [attitude, setAttitude] = useState(0)
  const [communication2, setCommunication2] = useState(0)
  const [culture2, setCulture2] = useState(0)
  const [knowledge, setKnowledge] = useState(0)
  const [decline2, setDecline2] = useState('Availability')
  const [recommendation3, setRecommendation3] = useState('')
  const [final, setFinal] = useState(0)
  const [finalReport, setFinalReport] = useState([])

  // states: for api-related (Logs)
  const [logs, setLogs] = useState([])
  const [content, setContent] = useState('')

  // react-hook-form
  const { register, handleSubmit, trigger, setValue, formState: { errors }} = useForm()


  // default values: exam Evaluation
  // const examDefaultValues = {
  //   approach,
  //   attention,
  //   comprehension,
  //   responsiveness
  // }

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

              setValue('approach', approach)
              setValue('comprehension', comprehension)
              setValue('responsiveness', responsiveness)
              setValue('attention', attention)
              setValue('recommendation', recommendation)

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
            setSchedule(moment(schedule).toDate())
            setPortfolio(portfolio)
            setCommunication(communication)
            setExperience(experience)
            setCoding(coding)
            setCulture(culture)
            setPros(pros)
            setCons(cons)
            setDecline(decline)
            setRecommendation2(recommendation)

            setValue('portfolio', portfolio)
            setValue('communication', communication)
            setValue('experience', experience)
            setValue('coding', coding)
            setValue('culture', culture)
            setValue('pros', pros)
            setValue('cons', cons)
            setValue('recommendation2', recommendation)

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
            setSchedule2(moment(schedule).toDate())
            setAttitude(attitude)
            setCommunication2(communication)
            setCulture2(culture)
            setKnowledge(knowledge)
            setDecline2(decline)
            setRecommendation3(recommendation)

            setValue('attitude', attitude)
            setValue('communication2', communication)
            setValue('culture2', culture)
            setValue('knowledge', knowledge)
            setValue('recommendation3', recommendation)

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

  const getLogsById = (id) => {
    fetch(logs_api + id)
      .then(res => res.json())
      .then(res => {
        setLogs(res)

        res.map(log => {
          if (log.category === 'exam') {
              setViewExamLogs(true)
          } else if (log.category === 'initial') {
              setViewInitialLogs(true)
          } else if (log.category === 'final') {
              setViewFinalLogs(true)
          }
        })
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

  const createLogs = (category) => {

    let lcontent

    if (category === 'exam') {
      lcontent = `<div>
          <p>Coding Style: <strong>${approach}</strong></p>
          <p>Brief Comprehension: <strong>${comprehension}</strong></p>
          <p>Responsiveness: <strong>${responsiveness}</strong></p>
          <p>Attention To Detail: <strong>${attention}</strong></p>
          <p>Recommendation: <strong>${recommendation}</strong></p>
      </div>`
    } else if (category === 'initial') {
      lcontent = `<div>
          <p>Schedule: <strong>${schedule}</strong></p>
          <p>Portfolio Review: <strong>${portfolio}</strong></p>
          <p>Communication Skills: <strong>${communication}</strong></p>
          <p>Relevant Experience: <strong>${experience}</strong></p>
          <p>Coding Style/Approach: <strong>${coding}</strong></p>
          <p>Culture Fit: <strong>${culture}</strong></p>
          <p>Pros: <strong>${pros}</strong></p>
          <p>Cons: <strong>${cons}</strong></p>
          <p>Decline Reason: <strong>${decline}</strong></p>
          <p>Recommendation: <strong>${recommendation2}</strong></p>
      </div>`
    } else if (category === 'final') {
      lcontent = `<div>
          <p>Schedule: <strong>${schedule2}</strong></p>
          <p>Attitude/Motivation: <strong>${attitude}</strong></p>
          <p>Communication Skills: <strong>${communication2}</strong></p>
          <p>Culture Fit: <strong>${culture2}</strong></p>
          <p>Industry Knowledge: <strong>${knowledge}</strong></p>
          <p>Decline Reason: <strong>${decline2}</strong></p>
          <p>Recommendation: <strong>${recommendation3}</strong></p>
      </div>`
    }

    const examLog = {
      applicantId,
      category,
      content: lcontent
    }

    // console.log(examLog)

    axios.post(logs_api, examLog)
      .then(res => console.log('added log'))
      .then(res => getLogsById(id))
      .catch(error => console.log(error.message))
  }

  const onExamEvaluation = (data) => {

    let { approach, attention, comprehension, recommendation, responsiveness } = data

    const exam = {
      applicantId,
      approach,
      attention,
      comprehension,
      recommendation,
      responsiveness
    }

    // console.log(exam)

    if (exchecker === false) {
      axios.post(exams_api, exam)
        .then(res => {
          setStatus('passed exam')
          updateApplicantStatus('passed exam')
        })
        .then(res => setExchecker(true))
        .then(res => getExamEvaluation(id))
        .then(res => createLogs('exam'))
        .catch(error => console.log(error.message))
    } else {
      axios.patch(exams_api + id, exam)
        .then(res => console.log('exam evaluation updated'))
        .then(res => setExchecker(true))
        .then(res => getExamEvaluation(id))
        .then(res => createLogs('exam'))
        .catch(error => console.log(error.message))
    }
  }

  const onInitialInteview = (data) => {

    let { portfolio, communication, experience, coding, culture, pros, cons, recommendation } = data

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
          setStatus('passed initial')
          updateApplicantStatus('passed initial')
        })
        .then(res => setInchecker(true))
        .then(res => getInitialInterview(id))
        .then(res => createLogs('initial'))
        .catch(error => console.log(error.message))
    } else {
      axios.patch(initials_api + id, initialInterview)
        .then(res => console.log('initial interview updated'))
        .then(res => setInchecker(true))
        .then(res => getInitialInterview(id))
        .then(res => createLogs('initial'))
        .catch(error => console.log(error.message))
    }
  }

  const onFinalInterview = (data) => {

    let { attitude, communication2, culture2, knowledge, recommendation3 } = data

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

    if (fichecker === false) {
      axios.post(finals_api, finalInterview)
        .then(res => {
          setStatus('passed final')
          updateApplicantStatus('passed final')
        })
        .then(res => setFichecker(true))
        .then(res => getFinalInterview(id))
        .then(res => createLogs('final'))
        .catch(error => console.log(error.message))
    } else {
      axios.patch(finals_api + id, finalInterview)
        .then(res => console.log('final interview updated'))
        .then(res => setFichecker(true))
        .then(res => getFinalInterview(id))
        .then(res => createLogs('final'))
        .catch(error => console.log(error.message))
    }
  }

  useEffect(() => {
    getApplicantById(id)
    getExamEvaluation(id)
    getInitialInterview(id)
    getFinalInterview(id)
    getLogsById(id)

    // check the view logs
    // console.log(viewExamLogs)
    // console.log(viewInitialLogs)
    // console.log(viewFinalLogs)
    // console.log(approach)

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
        <div className="content-header">
          <div className="ch-item">
            <h3>exam evaluation
              <Popup
                trigger={open => (
                  <a className="note"><FaQuestionCircle /></a>
                )}
                position="right top"
                on={['hover', 'focus']}
              >
                <span> Rating: You can give a score from 1 - 5 where 1 is the lowest and 5 is the highest </span>
              </Popup>
            </h3>
          </div>
          <div className="ch-item">
            {
              viewExamLogs === true ?
                <Popup
                  trigger={
                    <div className="action"><a className="add"><FaFileContract /> view logs</a></div>
                  }
                  position="right center"
                  modal
                  lockScroll="true"
                >
                {close => (
                    <div className="modal">
                      <div className="action exit"><a className="close" onClick={close}><MdClose /></a></div>
                      <div className="header"><span>logs:</span> exam evaluation</div>
                      <div className="content">
                        {' '}
                        <div className="logs">
                          {
                            logs.filter(log => log.category.toLowerCase() === 'exam').map((log, index) =>
                              <div key={index} className="logs-item">
                                <span className="date">{moment(log.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</span>
                                <div className="logs-message">{parse(log.content)}</div>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    </div>
                  )}
                </Popup>
                : ''
            }
          </div>
        </div>
        <div className="evaluation">
          <div className="evaluate-left">
            <form className="form" onSubmit={handleSubmit(onExamEvaluation)}>
              <div className="form-group">
                <label>Coding Style/Approach
                  {errors.approach && <span className="error-msg">{errors.approach.message}</span>}
                  <input
                    className="form-control"
                    type="text"
                    name="approach"
                    defaultValue={approach}
                    {...register("approach", {
                      min: {
                        value: 1,
                        message: "Minimum Required point is 1",
                      },
                      max: {
                        value: 5,
                        message: "Maximum Allowed point is 5",
                      },
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Only numbers are allowed"
                      }
                    })}
                    onKeyUp={(e) => {
                      setApproach(e.target.value)
                      trigger("approach")
                    }}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>Brief Comprehension
                  {errors.comprehension && <span className="error-msg">{errors.comprehension.message}</span>}
                  <input
                    className="form-control"
                    type="text"
                    name="comprehension"
                    defaultValue={comprehension}
                    {...register("comprehension", {
                      min: {
                        value: 1,
                        message: "Minimum Required point is 1",
                      },
                      max: {
                        value: 5,
                        message: "Maximum Allowed point is 5",
                      },
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Only numbers are allowed"
                      }
                    })}
                    onKeyUp={(e) => {
                      setComprehension(e.target.value)
                      trigger("comprehension")
                    }}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>Responsiveness
                  {errors.responsiveness && <span className="error-msg">{errors.responsiveness.message}</span>}
                  <input
                    className="form-control"
                    type="text"
                    name="responsiveness"
                    defaultValue={responsiveness}
                    {...register("responsiveness", {
                      min: {
                        value: 1,
                        message: "Minimum Required point is 1",
                      },
                      max: {
                        value: 5,
                        message: "Maximum Allowed point is 5",
                      },
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Only numbers are allowed"
                      }
                    })}
                    onKeyUp={(e) => {
                      setResponsiveness(e.target.value)
                      trigger("responsiveness")
                    }}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>Attention To Detail
                  {errors.attention && <span className="error-msg">{errors.attention.message}</span>}
                  <input
                    className="form-control"
                    type="text"
                    name="attention"
                    defaultValue={attention}
                    {...register("attention", {
                      min: {
                        value: 1,
                        message: "Minimum Required point is 1",
                      },
                      max: {
                        value: 5,
                        message: "Maximum Allowed point is 5",
                      },
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Only numbers are allowed"
                      }
                    })}
                    onKeyUp={(e) => {
                      setAttention(e.target.value)
                      trigger("attention")
                    }}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>Recommendation
                  {errors.recommendation && <span className="error-msg">{errors.recommendation.message}</span>}
                  <input
                    className="form-control"
                    type="textarea"
                    name="recommendation"
                    defaultValue={recommendation}
                    {...register("recommendation", {
                      required: "Recommendation is required",
                      maxLength: {
                        value: 50,
                        message: "Maximum of 50 characters allowed"
                      }
                    })}
                    onKeyUp={(e) => {
                      setRecommendation(e.target.value)
                      trigger("recommendation")
                    }}
                  />
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
              {
                exchecker === true ?
                <ExamChart
                  approach={approach}
                  attention={attention}
                  comprehension={comprehension}
                  responsiveness={responsiveness}
                />
                : ''
              }
              <div className="evaluate-score">
                <p className="text">exam rating:</p>
                <div className="score-content">
                  <h1 className="score">{exam}<span>%</span></h1>
                  <div className={examConfirmation === true ? "icon passed" : "icon failed"}>{examConfirmation === true ? <FaCheck /> : <MdClose />}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="content-header">
          <div className="ch-item">
            <h3>initial interview
              <Popup
                trigger={open => (
                  <a className="note"><FaQuestionCircle /></a>
                )}
                position="right top"
                on={['hover', 'focus']}
              >
                <span> Rating: You can give a score from 1 - 5 where 1 is the lowest and 5 is the highest </span>
              </Popup>
            </h3>
          </div>
          <div className="ch-item">
            {
              viewInitialLogs === true ?
                <Popup
                  trigger={
                    <div className="action"><a className="add"><FaFileContract /> view logs</a></div>
                  }
                  position="right center"
                  modal
                  lockScroll="true"
                >
                {close => (
                    <div className="modal">
                      <div className="action exit"><a className="close" onClick={close}><MdClose /></a></div>
                      <div className="header"><span>logs:</span> initial interview</div>
                      <div className="content">
                        {' '}
                        <div className="logs">
                          {
                            logs.filter(log => log.category.toLowerCase() === 'initial').map((log, index) =>
                              <div key={index} className="logs-item">
                                <span className="date">{moment(log.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</span>
                                <div className="logs-message">{parse(log.content)}</div>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    </div>
                  )}
                </Popup>
                : ''
            }
          </div>
        </div>
        <div className="evaluation">
          <div className="evaluate-left">
            <form className="form" onSubmit={handleSubmit(onInitialInteview)}>
              <div className="form-group">
                <label>Schedule
                  <DatePicker className="form-control" name="schedule" selected={schedule} onChange={(date) => setSchedule(date)} />
                </label>
              </div>
              <div className="form-group">
                <label>Portfolio Review
                  {errors.portfolio && <span className="error-msg">{errors.portfolio.message}</span>}
                  <input
                    className="form-control"
                    type="text"
                    name="portfolio"
                    defaultValue={portfolio}
                    {...register("portfolio", {
                      required: "Portfolio is required",
                      min: {
                        value: 1,
                        message: "Minimum Required point is 1",
                      },
                      max: {
                        value: 5,
                        message: "Maximum Allowed point is 5",
                      },
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Only numbers are allowed"
                      }
                    })}
                    onKeyUp={(e) => {
                      setPortfolio(e.target.value)
                      trigger("portfolio")
                    }}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>Communication Skills
                  {errors.communication && <span className="error-msg">{errors.communication.message}</span>}
                  <input
                    className="form-control"
                    type="text"
                    name="communication"
                    defaultValue={communication}
                    {...register("communication", {
                      required: "Communication is required",
                      min: {
                        value: 1,
                        message: "Minimum Required point is 1",
                      },
                      max: {
                        value: 5,
                        message: "Maximum Allowed point is 5",
                      },
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Only numbers are allowed"
                      }
                    })}
                    onKeyUp={(e) => {
                      setCommunication(e.target.value)
                      trigger("communication")
                    }}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>Relevant Experience
                  {errors.experience && <span className="error-msg">{errors.experience.message}</span>}
                  <input
                    className="form-control"
                    type="text"
                    name="experience"
                    defaultValue={experience}
                    {...register("experience", {
                      required: "Experience is required",
                      min: {
                        value: 1,
                        message: "Minimum Required point is 1",
                      },
                      max: {
                        value: 5,
                        message: "Maximum Allowed point is 5",
                      },
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Only numbers are allowed"
                      }
                    })}
                    onKeyUp={(e) => {
                      setExperience(e.target.value)
                      trigger("experience")
                    }}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>Coding Style/Approach
                  {errors.coding && <span className="error-msg">{errors.coding.message}</span>}
                  <input
                    className="form-control"
                    type="text"
                    name="coding"
                    defaultValue={coding}
                    {...register("coding", {
                      required: "Coding Style/Approach is required",
                      min: {
                        value: 1,
                        message: "Minimum Required point is 1",
                      },
                      max: {
                        value: 5,
                        message: "Maximum Allowed point is 5",
                      },
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Only numbers are allowed"
                      }
                    })}
                    onKeyUp={(e) => {
                      setCoding(e.target.value)
                      trigger("coding")
                    }}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>Culture Fit
                  {errors.culture && <span className="error-msg">{errors.culture.message}</span>}
                  <input
                    className="form-control"
                    type="text"
                    name="culture"
                    defaultValue={culture}
                    {...register("culture", {
                      required: "Culture Fit is required",
                      min: {
                        value: 1,
                        message: "Minimum Required point is 1",
                      },
                      max: {
                        value: 5,
                        message: "Maximum Allowed point is 5",
                      },
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Only numbers are allowed"
                      }
                    })}
                    onKeyUp={(e) => {
                      setCulture(e.target.value)
                      trigger("culture")
                    }}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>Pros
                  {errors.pros && <span className="error-msg">{errors.pros.message}</span>}
                  <input
                    className="form-control"
                    type="text"
                    name="pros"
                    defaultValue={pros}
                    {...register("pros", {
                      required: "Pros is required",
                      maxLength: {
                        value: 20,
                        message: "Maximum of 20 characters allowed"
                      }
                    })}
                    onKeyUp={(e) => {
                      setPros(e.target.value)
                      trigger("pros")
                    }}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>Cons
                  {errors.cons && <span className="error-msg">{errors.cons.message}</span>}
                  <input
                    className="form-control"
                    type="text"
                    name="cons"
                    defaultValue={cons}
                    {...register("cons", {
                      required: "Cons is required",
                      maxLength: {
                        value: 20,
                        message: "Maximum of 20 characters allowed"
                      }
                    })}
                    onKeyUp={(e) => {
                      setCons(e.target.value)
                      trigger("cons")
                    }}
                  />
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
                  {errors.recommendation2 && <span className="error-msg">{errors.recommendation2.message}</span>}
                  <input
                    className="form-control"
                    type="text"
                    name="recommendation2"
                    defaultValue={recommendation2}
                    {...register("recommendation2", {
                      required: "Recommendation is required",
                      maxLength: {
                        value: 50,
                        message: "Maximum of 50 characters allowed"
                      }
                    })}
                    onKeyUp={(e) => {
                      setRecommendation2(e.target.value)
                      trigger("recommendation2")
                    }}
                  />
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
              {
                inchecker === true ?
                <InitialChart
                  portfolio={portfolio}
                  communication={communication}
                  experience={experience}
                  coding={coding}
                  culture={culture}
                />
                : ''
              }
              <div className="evaluate-score">
                <p className="text">initial interview rating:</p>
                <div className="score-content">
                  <h1 className="score">{initial}<span>%</span></h1>
                  <div className={initialConfirmation === true ? "icon passed" : "icon failed"}>{initialConfirmation === true ? <FaCheck /> : <MdClose />}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="content-header">
          <div className="ch-item">
            <h3>final interview
              <Popup
                trigger={open => (
                  <a className="note"><FaQuestionCircle /></a>
                )}
                position="right top"
                on={['hover', 'focus']}
              >
                <span> Rating: You can give a score from 1 - 5 where 1 is the lowest and 5 is the highest </span>
              </Popup>
            </h3>
          </div>
          <div className="ch-item">
            {
              viewFinalLogs === true ?
                <Popup
                  trigger={
                    <div className="action"><a className="add"><FaFileContract /> view logs</a></div>
                  }
                  position="right center"
                  modal
                  lockScroll="true"
                >
                {close => (
                    <div className="modal">
                      <div className="action exit"><a className="close" onClick={close}><MdClose /></a></div>
                      <div className="header"><span>logs:</span> final interview</div>
                      <div className="content">
                        {' '}
                        <div className="logs">
                          {
                            logs.filter(log => log.category.toLowerCase() === 'final').map((log, index) =>
                              <div key={index} className="logs-item">
                                <span className="date">{moment(log.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</span>
                                <div className="logs-message">{parse(log.content)}</div>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    </div>
                  )}
                </Popup>
                : ''
            }
          </div>
        </div>
        <div className="evaluation">
          <div className="evaluate-left">
            <form className="form" onSubmit={handleSubmit(onFinalInterview)}>
              <div className="form-group">
                <label>Schedule
                  <DatePicker className="form-control" name="schedule2" selected={schedule2} onChange={(date) => setSchedule2(date)} />
                </label>
              </div>
              <div className="form-group">
                <label>Attitude/Motivation
                  {errors.attitude && <span className="error-msg">{errors.attitude.message}</span>}
                  <input
                    className="form-control"
                    type="text"
                    name="attitude"
                    defaultValue={attitude}
                    {...register("attitude", {
                      required: "Attitude/Motivation is required",
                      min: {
                        value: 1,
                        message: "Minimum Required point is 1",
                      },
                      max: {
                        value: 5,
                        message: "Maximum Allowed point is 5",
                      },
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Only numbers are allowed"
                      }
                    })}
                    onKeyUp={(e) => {
                      setAttitude(e.target.value)
                      trigger("attitude")
                    }}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>Communication Skills
                  {errors.communication2 && <span className="error-msg">{errors.communication2.message}</span>}
                  <input
                    className="form-control"
                    type="text"
                    name="communication2"
                    defaultValue={communication2}
                    {...register("communication2", {
                      required: "Communication is required",
                      min: {
                        value: 1,
                        message: "Minimum Required point is 1",
                      },
                      max: {
                        value: 5,
                        message: "Maximum Allowed point is 5",
                      },
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Only numbers are allowed"
                      }
                    })}
                    onKeyUp={(e) => {
                      setCommunication2(e.target.value)
                      trigger("communication2")
                    }}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>Culture Fit
                  {errors.culture2 && <span className="error-msg">{errors.culture2.message}</span>}
                  <input
                    className="form-control"
                    type="text"
                    name="culture2"
                    defaultValue={culture2}
                    {...register("culture2", {
                      required: "Culture Fit is required",
                      min: {
                        value: 1,
                        message: "Minimum Required point is 1",
                      },
                      max: {
                        value: 5,
                        message: "Maximum Allowed point is 5",
                      },
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Only numbers are allowed"
                      }
                    })}
                    onKeyUp={(e) => {
                      setCulture2(e.target.value)
                      trigger("culture2")
                    }}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>Industry Knowledge
                  {errors.knowledge && <span className="error-msg">{errors.knowledge.message}</span>}
                  <input
                    className="form-control"
                    type="text"
                    name="knowledge"
                    defaultValue={knowledge}
                    {...register("knowledge", {
                      required: "Industry Knowledge is required",
                      min: {
                        value: 1,
                        message: "Minimum Required point is 1",
                      },
                      max: {
                        value: 5,
                        message: "Maximum Allowed point is 5",
                      },
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Only numbers are allowed"
                      }
                    })}
                    onKeyUp={(e) => {
                      setKnowledge(e.target.value)
                      trigger("knowledge")
                    }}
                  />
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
                  {errors.recommendation3 && <span className="error-msg">{errors.recommendation3.message}</span>}
                  <input
                    className="form-control"
                    type="text"
                    name="recommendation3"
                    defaultValue={recommendation3}
                    {...register("recommendation3", {
                      required: "Recommendation is required",
                      maxLength: {
                        value: 50,
                        message: "Maximum of 50 characters allowed"
                      }
                    })}
                    onKeyUp={(e) => {
                      setRecommendation3(e.target.value)
                      trigger("recommendation3")
                    }}
                  />
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
              {
                fichecker === true ?
                <FinalChart
                  attitude={attitude}
                  communication2={communication2}
                  culture2={culture2}
                  knowledge={knowledge}
                />
                : ''
              }
              <div className="evaluate-score">
                <p className="text">final interview rating:</p>
                <div className="score-content">
                  <h1 className="score">{final}<span>%</span></h1>
                  <div className={finalConfirmation === true ? "icon passed" : "icon failed"}>{finalConfirmation === true ? <FaCheck /> : <MdClose />}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicantInfo
