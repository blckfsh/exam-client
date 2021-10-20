import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import { FaEye, FaEdit, FaTrash, FaUserPlus } from "react-icons/fa"
import { MdClose } from "react-icons/md"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

import { api_4_applicants } from '../../api/apis'
import ApplicantStats from './ApplicantStats'
import ApplicantInfo from './ApplicantInfo'
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

  // states: for search function
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])

  const getApplicants = () => {
    setView('list')
    setLoad(true)

    fetch(applicants_api)
      .then(res => res.json())
      .then(res => {
        setApplicants(res)
        setData(res)
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

  const updateInfo = (id) => {
    setView('update')

    setApplicantId(id)
    getApplicantById(id)
  }

  const deleteInfo = (id) => {
    axios.delete(applicants_api + id)
      .then(res => console.log(res.data))
      .catch(error => console.error(error.message))

      setApplicants(applicants.filter(applicant => applicant._id !== id))
  }

  const handleSearch = (event) => {
    setSearch(event)
  }

  useEffect(() => {
    getApplicants()
  }, [])

  let content
  let menu
  let statistics

  if (load) {
    content = <span><AiOutlineLoading3Quarters className="load" /></span>
    statistics = <></>
  } else {
    if (view === 'list') {
      statistics = <ApplicantStats />
      menu = <>
        <div className="menu-left">
          <label>Search Name:</label>
          <input
            type="text"
            name="search-form"
            className="search"
            value={search}
            onChange={(e) => handleSearch(e.target.value) }
          />
        </div>
        <div className="action"><a className="add" onClick={() => setView('add')}><FaUserPlus /> add applicant</a></div>
      </>
      content = <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Date Applied</th>
            <th>Status</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {applicants.filter(applicant => applicant.name.toLowerCase().includes(search.toLowerCase()))
                     .sort((a, b) => a.date_applied < b.date_applied ? 1:-1)
                     .map((applicant, index) =>
                        <tr key={index}>
                          <td>{applicant.name}</td>
                          <td>{applicant.email}</td>
                          <td>{applicant.contact}</td>
                          <td>{moment(applicant.date_applied).format('MMMM Do YYYY')}</td>
                          <td>
                            <span
                                className={
                                            applicant.status === "in progress" ? "badge badge-in-progress" :
                                            applicant.status === "done screening" ? "badge badge-screening" :
                                            applicant.status === "passed exam" ? "badge badge-exam" :
                                            applicant.status === "initial interview" ? "badge badge-initial" :
                                            applicant.status === "final interview" ? "badge badge-final" :
                                            applicant.status === "completed" ? "badge badge-completed" :
                                            "badge badge-failed"
                                          }
                             >
                              {applicant.status}
                             </span>
                          </td>
                          <td>
                            <div className="table-action">
                              <a className="view" onClick={() => viewInfo(applicant._id)}><FaEye /></a>
                              <span>|</span>
                              <a className="edit" onClick={() => updateInfo(applicant._id)}><FaEdit /></a>
                              <span>|</span>
                              <a className="delete" onClick={() => deleteInfo(applicant._id)}><FaTrash /></a>
                            </div>
                          </td>
                        </tr>
          )}
        </tbody>
      </table>
    } else if (view === 'update') {
      menu = <div className="action exit"><a className="close" onClick={() => getApplicants()}><MdClose /></a></div>
      content = <div>
        <UpdateApplicant applicantId={applicantId} />
        </div>
    } else if (view === 'add') {
      menu = <div className="action exit"><a className="close" onClick={() => getApplicants()}><MdClose /></a></div>
      content = <ApplicantForm />
    } else if (view === 'info') {
      menu = <div className="action exit"><a className="close" onClick={() => getApplicants()}><MdClose /></a></div>
      content = <ApplicantInfo applicantId={applicantId} />
    }
  }

  return (
    <>
      {statistics}
      <div className="menu">
        {menu}
      </div>
      <div className="list">
        {content}
      </div>
    </>
  )
}

export default ApplicantList
