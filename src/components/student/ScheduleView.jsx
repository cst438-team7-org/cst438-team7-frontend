import { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { REGISTRAR_URL } from '../../Constants';
import SelectTerm from '../SelectTerm';
import Messages from '../Messages';

const ScheduleView = () => {

  // student views their class schedule for a given term

  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');
  const [term, setTerm] = useState({});

  const prefetchEnrollments = ({ year, semester }) => {
    setTerm({ year, semester });
    fetchEnrollments(year, semester);
  };

  const fetchEnrollments = async (year, semester) => {
    try {
      const response = await fetch(
        `${REGISTRAR_URL}/enrollments?year=${year}&semester=${semester}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEnrollments(data);
        setMessage('');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  const dropEnrollment = async (enrollment) => {
    try {
      const response = await fetch(
        `${REGISTRAR_URL}/enrollments/${enrollment.enrollmentId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );

      if (response.ok) {
        setMessage(
          `Successfully dropped ${enrollment.courseId}-${enrollment.secId}`
        );
        fetchEnrollments(term.year, term.semester);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  const confirmDrop = (enrollment) => {
    confirmAlert({
      title: 'Confirm drop',
      message: `Drop ${enrollment.courseId}-${enrollment.secId}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => dropEnrollment(enrollment),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const headings = [
    'enrollmentId',
    'secNo',
    'courseId',
    'secId',
    'building',
    'room',
    'times',
    '',
  ];

  return (
    <div>
      <Messages response={message} />
      <SelectTerm buttonText="Get Schedule" onClick={prefetchEnrollments} />

      <table className="Center">
        <thead>
          <tr>
            {headings.map((heading, index) => (
              <th key={index}>{heading}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {enrollments.map((enrollment) => (
            <tr key={enrollment.enrollmentId}>
              <td>{enrollment.enrollmentId}</td>
              <td>{enrollment.secNo}</td>
              <td>{enrollment.courseId}</td>
              <td>{enrollment.secId}</td>
              <td>{enrollment.building}</td>
              <td>{enrollment.room}</td>
              <td>{enrollment.times}</td>
              <td>
                <button onClick={() => confirmDrop(enrollment)}>
                  Drop
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleView;