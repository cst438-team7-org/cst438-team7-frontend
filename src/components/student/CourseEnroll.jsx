import { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { REGISTRAR_URL } from '../../Constants';
import Messages from '../Messages';

const CourseEnroll = () => {

  // student adds a course to their schedule

  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState('');

  const fetchSections = async () => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/sections/open`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('jwt'),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSections(data);
        setMessage('');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const enrollInSection = async (section) => {
    try {
      const response = await fetch(
        `${REGISTRAR_URL}/enrollments/sections/${section.secNo}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );

      if (response.ok) {
        setMessage(
          `Successfully enrolled in ${section.courseId}-${section.secId}`
        );
        fetchSections();
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  const confirmEnrollment = (section) => {
    confirmAlert({
      title: 'Confirm enrollment',
      message: `Enroll in ${section.courseId}-${section.secId}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => enrollInSection(section),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const headers = [
    'section No',
    'year',
    'semester',
    'course Id',
    'section',
    'title',
    'building',
    'room',
    'times',
    'instructor',
    'capacity',
    'enrolled',
    'available',
    '',
  ];

  return (
    <div>
      <Messages response={message} />
      <h3>Open Sections Available for Enrollment</h3>

      <table className="Center">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sections.map((section) => (
            <tr key={section.secNo}>
              <td>{section.secNo}</td>
              <td>{section.year}</td>
              <td>{section.semester}</td>
              <td>{section.courseId}</td>
              <td>{section.secId}</td>
              <td>{section.title}</td>
              <td>{section.building}</td>
              <td>{section.room}</td>
              <td>{section.times}</td>
              <td>{section.instructorName}</td>
              <td>{section.capacity}</td>
              <td>{section.enrolledSeats}</td>
              <td>{section.availableSeats}</td>
              <td>
                <button
                  onClick={() => confirmEnrollment(section)}
                  disabled={section.availableSeats <= 0}
                >
                  {section.availableSeats <= 0 ? 'Full' : 'Enroll'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseEnroll;