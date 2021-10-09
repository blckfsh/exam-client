import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa"
import { MdClose } from "react-icons/md"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

import { api_4_applicants } from '../../api/apis'
import ApplicantForm from './ApplicantForm'
import UpdateApplicant from './UpdateApplicant'

function ApplicantList() {

  // connect to applicants_api
  const applicants_api = api_4_applicants

  // states: for pages
  const [view, setView] = useState('list')
  const [load, setLoad] = useState(true)

  // states: for api-related
  const [applicantId, setApplicantId] = useState('')
  const [applicants, setApplicants] = useState([])
  const [info, setInfo] = useState([])

  const getApplicants = () => {
    setView('list')
    setLoad(true)

    fetch(applicants_api)
      .then(res => res.json())
      .then(res => {
        setApplicants(res)
        setLoad(false)
      })
  }

  const getApplicantById = (id) => {
    setLoad(true)

    fetch(applicants_api + id)
      .then(res => res.json())
      .then(res => {
        setInfo(res)
        setLoad(false)
      })
      .catch(error => console.error(error.message))
  }

  const viewInfo = (id) => {
    setView('info')

    setApplicantId(id)
    getApplicantById(id)
  }

  const deleteInfo = (id) => {
    axios.delete(applicants_api + id)
      .then(res => console.log(res.data))
      .catch(error => console.error(error.message))

      setApplicants(applicants.filter(applicant => applicant._id !== id))
  }

  useEffect(() => {
    getApplicants()
  }, [])

  let content
  let pager

  if (load) {
    content = <span><AiOutlineLoading3Quarters className="load" /></span>
  } else {
    if (view === 'list') {
      pager = <div className="action"><a className="add" onClick={() => setView('add')}><FaUserPlus /> add applicant</a></div>
      content = <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Role & Level</th>
            <th>Department</th>
            <th>Date Applied</th>
            <th>Status</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant) =>
            <tr key={applicant._id}>
              <td>{applicant.name}</td>
              <td>{applicant.email}</td>
              <td>{applicant.contact}</td>
              <td>{applicant.role} - {applicant.level}</td>
              <td><span className={applicant.department === 'Creatives - UK' ? "badge badge-uk" : "badge badge-us"}>{applicant.department}</span></td>
              <td>{moment(applicant.date_applied).format('MMMM Do YYYY')}</td>
              <td>{applicant.status}</td>
              <td>
                <div className="table-action">
                  <a className="edit" onClick={() => viewInfo(applicant._id)}><FaEdit /></a>
                  <span>|</span>
                  <a className="delete" onClick={() => deleteInfo(applicant._id)}><FaTrash /></a>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    } else if (view === 'info') {
      pager = <div className="action exit"><a className="close" onClick={() => getApplicants()}><MdClose /></a></div>
      content = <div>
        <UpdateApplicant applicantId={applicantId} />
        </div>
    } else if (view === 'add') {
      pager = <div className="action exit"><a className="close" onClick={() => getApplicants()}><MdClose /></a></div>
      content = <ApplicantForm />
    }
  }

  return (
    <>
      <div className="menu">{pager}</div>
      <div className="list">{content}</div>
    </>
  )
}

export default ApplicantList
