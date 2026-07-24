import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentUpdate = ({ editAssignment, onClose }) => {


  const [message, setMessage] = useState('');
  const [assignment, setAssignment] = useState({});
  const dialogRef = useRef();

  const onChange = (event) => {
    setAssignment({ ...assignment, [event.target.name]: event.target.value });
  };

  /*
   *  dialog for edit of an assignment
   */
  const editOpen = () => {
    setMessage('');
    setAssignment(editAssignment);
    dialogRef.current.showModal();
  };

  // Closes edit assignment dialog and refreshes assignment list
  const editClose = () => {
    dialogRef.current.close();
    onClose();
  }

  // Send put request to update assignment in database
  const onSave = async () => {
    try {
      // Send put request
      const response = await fetch(`${GRADEBOOK_URL}/assignments`, {
        method: 'PUT',
        headers: {
          'Content-Type':'application/json',
          'Authorization': sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(assignment)
      });

      // Check response
      if (response.ok) {
        const data = await response.json();
        setMessage(`Assignment ${data.id} successfully updated.`);
      } else {
        const data = await response.json();
        setMessage(data);
      }
    } catch (err) {
      setMessage("request failed " + err);
    }
  }

  return (
    <>
      <button onClick={editOpen}>Edit</button>
      <dialog ref={dialogRef}>
        <h2>Edit Assignment {assignment.id}</h2>
        <Messages response={message} />
        <input id="title" type="text" name="title" placeholder="Title" onChange={onChange} value={assignment.title}/>
        <input id="dueDate" type="date" name="dueDate" placeholder="Due Date" onChange={onChange} value={assignment.dueDate}/>
        <button id="closeButton" onClick={editClose}>Close</button>
                <button id="saveButton" onClick={onSave}>Save</button>
      </dialog>
    </>
  )
}

export default AssignmentUpdate;
