import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker';
import moment from 'moment'
import axios from 'axios'

import 'react-datepicker/dist/react-datepicker.css';

import { api_4_applicants } from '../../api/apis'

function UpdateApplicant(props) {

  // props
  const id = props.applicantId

  // connect to applicants_api
  const applicants_api = api_4_applicants

  // states: fro DatePicker
  // const [dpDateApplied = setDpDateApplied] = useState(new Date())

  // states: for api-related
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState('')
  const [role, setRole] = useState('')
  const [level, setLevel] = useState('')
  const [department, setDepartment] = useState('')
  const [dateApplied, setDateApplied] = useState(new Date())
  const [status, setStatus] = useState('')

  // states: confirmation
  const [alert, setAlert] = useState('')

  // list of roles
  const rolesArray = [
    'cms developer',
    'web developer',
    'graphic designer',
    'motion graphic'
  ]

  // list of levels
  const levelsArray = [
    'junior',
    'senior',
    'team lead'
  ]

  // list of departments
  const departmentsArray = [
    'Creatives - UK',
    'Creatives - US'
  ]

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
        setDateApplied(moment(date_applied).toDate())
        setStatus(status)
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const applicant = {
      name,
      email,
      contact,
      role,
      level,
      department,
      date_applied: moment(dateApplied).format(),
      status
    }

    const sendExam = {
      email,
      role,
      level,
      department
    }

    // console.log(applicant)

    axios.patch(applicants_api + id, applicant)
      .then(res => {
        if (res) {
          setAlert('success')
          setTimeout(() => {
            setAlert(false)
          }, 5000)

          if (status === 'send exam') {
            axios.post(applicants_api + "mail", sendExam)
                 .then(res => {
                   console.log('Auto Emailing Initialized')
                 })
                 .catch(error => console.log(error.message))
          }
        }
      })
      .catch(error => {
          console.error(error.message)
          setAlert('fail')
      })
  }

  useEffect(() => {
    getApplicantById(id)
  }, [id])

  return (
    <div>
      {
        alert === 'success' ? <div className="alert success"><p>applicant updated successfully</p></div> :
        alert === 'fail' ? <div className="alert fail"><p>failed to update the applicant</p></div> : ''
      }
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <div className="form-group">
          <label>
            Name:
            <input className="form-control" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        </div>
        <div className="form-group">
          <label>
            Email:
            <input className="form-control" type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
        </div>
        <div className="form-group">
          <label>
            Contact:
            <input className="form-control" type="text" name="contact" value={contact} onChange={(e) => setContact(e.target.value)} />
          </label>
        </div>
        <div className="form-group">
          <label>
            Role:
            <select className="form-control" name="role" value={role} onChange={(e) => setRole(e.target.value)}>
              {rolesArray.map(role =>
                <option key={role}>{role}</option>
              )}
            </select>
          </label>
        </div>
        <div className="form-group">
          <label>
            Level:
            <select className="form-control" name="level" value={level} onChange={(e) => setLevel(e.target.value)}>
              {levelsArray.map(level =>
                <option key={level}>{level}</option>
              )}
            </select>
          </label>
        </div>
        <div className="form-group">
          <label>
            Department:
            <select className="form-control" name="department" value={department} onChange={(e) => setDepartment(e.target.value)}>
              {departmentsArray.map(department =>
                <option key={department}>{department}</option>
              )}
            </select>
          </label>
        </div>
        <div className="form-group">
          <label>Schedule
            <DatePicker className="form-control" name="dateApplied" selected={dateApplied} onChange={(date) => setDateApplied(date)} />
          </label>
        </div>
        <div className="form-group">
          <label>
            Status:
            <select className="form-control" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option key="in progress">in progress</option>
              <option key="done screening">done screening</option>
              <option key="send exam">send exam</option>
              <option key="passed exam">passed exam</option>
              <option key="passed initial">passed initial</option>
              <option key="passed final">passed final</option>
              <option key="completed">completed</option>
              <option key="failed">failed</option>
            </select>
          </label>
        </div>
        <div className="form-group">
          <button className="button save" type="submit">update</button>
        </div>
      </form>
    </div>
  )
}

export default UpdateApplicant;
