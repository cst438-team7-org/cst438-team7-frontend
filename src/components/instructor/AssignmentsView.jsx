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

  // Show a confirm alert asking the user if they want to delete the selected assignment.
  const confirmDelete = (assignmentId) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Delete assignment ' + assignmentId + '?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => doDelete(assignmentId)
        },
        {
          label: 'No',
        }
      ]
    });
  }

  // Send a DELETE request to delete the assignemnt with the corresponding id.
  const doDelete = async (assignmentId) => {
    try {
      // Send request and get server response
      const response = await fetch(
        `${GRADEBOOK_URL}/assignments/${assignmentId}`,
        {
          method: "DELETE",
          headers: {
            'Authorization': sessionStorage.getItem("jwt")
          },
        }
      );

      // Check server response
      if (response.ok) {
        alert(`Assignment ${assignmentId} successfully deleted.`);
        fetchAssignments();
      } else {
        alert("Assignment delete failed.");
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
      <table className="Center">
        <thead>
          <tr>
            <th>{headers[0]}</th>
            <th>{headers[1]}</th>
            <th>{headers[2]}</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>{assignment.id}</td>
              <td>{assignment.title}</td>
              <td>{assignment.dueDate}</td>
              <td><AssignmentGrade assignment={assignment} /></td>
              <td><AssignmentUpdate editAssignment={assignment} onClose={fetchAssignments}/></td>
              <td><button onClick={() => confirmDelete(assignment.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <AssignmentAdd secNo={secNo} onClose={fetchAssignments} />
    </div>
  );
}

export default AssignmentsView;
