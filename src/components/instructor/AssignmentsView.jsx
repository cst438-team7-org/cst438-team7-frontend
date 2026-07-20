import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { GRADEBOOK_URL } from '../../Constants';
import AssignmentAdd from './AssignmentAdd';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentGrade from './AssignmentGrade';
import Messages from '../Messages';


const AssignmentsView = () => {

  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState('');

  const location = useLocation();
  const { secNo, courseId, secId } = location.state;


  const fetchAssignments = async () => {

    try {
      const response = await fetch(`${GRADEBOOK_URL}/sections/${secNo}/assignments`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem("jwt"),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, []);




  const headers = ['id', 'Title', 'Due Date', '', '', ''];

  return (
    <div>
      <Messages response={message} />

      <p>To be implemented. Display a table. Column headings are as givin in headers.
        For each row, show the id, title, due date of the assignment
        along with buttons to edit and delete the assignment </p>

      <table>
        <thead>
          <tr>
            <th>{headers[0]}</th>
            <th>{headers[1]}</th>
            <th>{headers[2]}</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>{assignment.id}</td>
              <td>{assignment.title}</td>
              <td>{assignment.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AssignmentAdd secNo={secNo} onClose={fetchAssignments} />
    </div>
  );
}

export default AssignmentsView;
