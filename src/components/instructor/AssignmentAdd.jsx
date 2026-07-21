import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentAdd = ({ onClose, secNo }) => {

  const [message, setMessage] = useState('');
  const [assignment, setAssignment] = useState({ title: '', dueDate: '' });
  const dialogRef = useRef();

    const onChange = (event) => {
        setAssignment({ ...assignment, [event.target.name]: event.target.value });
    };

  /*
   *  dialog for add assignment
   */
  const editOpen = () => {
    setMessage('');
    setAssignment({ ...assignment, secNo: secNo, title: '', dueDate: '' });
    dialogRef.current.showModal();
  };

  // Closes add assignment dialog and refreshes assignment list
  const editClose = () => {
    dialogRef.current.close();
    onClose();
  }

  // Send post request to add assignment to database
  const onSave = async () => {
    try {
      // Send post request
      const response = await fetch(`${GRADEBOOK_URL}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'Authorization': sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(assignment)
      });

      // Check response
      if (response.ok) {
        const data = await response.json();
        alert(`Assignment ${data.id} successfully created.`)
        setMessage('');
      } else {
        const data = await response.json();
        setMessage(data);
      }
    } catch (err) {
      alert("request failed " + err);
    }
  }

  return (
    <>
      <button id="addAssignmentButton" onClick={editOpen}>Add Assignment</button>
      <dialog ref={dialogRef} >
        <h2>Add Assignment</h2>
        <Messages response={message} />
        <input id="title" type="text" name="title" placeholder="Title" onChange={onChange} value={assignment.title}/>
        <input id="dueDate" type="text" name="dueDate" placeholder="Due Date" onChange={onChange} value={assignment.dueDate}/>
        <button id="saveButton" onClick={onSave}>save</button>
        <button id="closeButton" onClick={editClose}>close</button>
      </dialog>
    </>
  )
}

export default AssignmentAdd;
