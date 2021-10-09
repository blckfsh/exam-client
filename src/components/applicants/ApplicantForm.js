import React, { useState } from 'react'
import axios from 'axios'

import { api_4_applicants } from '../../../api/apis'

function ApplicantForm() {

  // connect to applicants_api
  const applicants_api = api_4_applicants

  // states: for api-related
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState('')
  const [role, setRole] = useState('cms developer')
  const [level, setLevel] = useState('junior')
  const [department, setDepartment] = useState('Creatives - UK')
  const [status, setStatus] = useState('exam sent')

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

  const handleSubmit = (event) => {
    event.preventDefault()

    const applicant = {
      name,
      email,
      contact,
      role,
      level,
      department,
      status
    }

    axios.post(applicants_api, applicant)
      .then(res => {
        if (res) {
          setName('')
          setEmail('')
          setContact('')
          setRole('cms developer')
          setLevel('junior')
          setDepartment('Creatives - UK')
          setStatus('exam sent')
          setAlert('success')
        }
      })
      .catch(error =>
        {
          console.error(error.message)
          setAlert('fail')
        })

  }

  return (
    <div>
      { alert === 'success' ? <div className="alert success"><p>applicant added successfully</p></div> : alert === 'fail' ? <div className="alert fail"><p>failed to add the applicant</p></div> : '' }
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <div className="form-group">
          <label>
            Name:
            <input className="form-control" type='text' name='name' value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        </div>
        <div className="form-group">
          <label>
            Email:
            <input className="form-control" type='text' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
        </div>
        <div className="form-group">
          <label>
            Contact:
            <input className="form-control" type='text' name='contact' value={contact} onChange={(e) => setContact(e.target.value)} />
          </label>
        </div>
        <div className="form-group">
          <label>
            Role:
            <select className="form-control" name='role' value={role} onChange={(e) => setRole(e.target.value)}>
              {rolesArray.map(role =>
                <option key={role}>{role}</option>
              )}
            </select>
          </label>
        </div>
        <div className="form-group">
          <label>
            Level:
            <select className="form-control" name='level' value={level} onChange={(e) => setLevel(e.target.value)}>
              {levelsArray.map(level =>
                <option key={level}>{level}</option>
              )}
            </select>
          </label>
        </div>
        <div className="form-group">
          <label>
            Department:
            <select className="form-control" name='department' value={department} onChange={(e) => setDepartment(e.target.value)}>
              {departmentsArray.map(department =>
                <option key={department}>{department}</option>
              )}
            </select>
          </label>
        </div>
        <div className="form-group">
          <button className="button add" type='submit'>submit</button>
        </div>
      </form>
    </div>
  );
}

export default ApplicantForm;
