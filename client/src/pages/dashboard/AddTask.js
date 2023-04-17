import React from 'react'
import {FormRow, FormRowSelect, Alert} from '../../components';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

const AddTask = () => {
  const {
    isLoading,
    isEditing,
    showAlert,
    displayAlert,
    taskItem,
    description,
    completeBy,
    status,
    statusOptions,
    taskType,
    taskTypeOptions,
    taskLocation,
    handleChange,
    clearValues,
    createTask,
    editTask
  } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!taskItem || !completeBy || !taskLocation) {
      displayAlert();
      return
    }

    if (isEditing) {
      editTask();
      return;
    }
    createTask();
    console.log('create task')
  }

  const handleTaskInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    handleChange({name, value});
  }

  return (
    <Wrapper>
      <form className='form'>
        <h3>{isEditing? 'edit task': 'add task'}</h3>
        {showAlert && <Alert />}
        <div className='form-center'>
          {/* task name */}
          <FormRow
            type="text"
            name="taskItem"
            labelText={"task"}
            value={taskItem}
            handleChange={handleTaskInput}
          />
          {/* task due date  */}
          <FormRow
            type="date"
            name="completeBy"
            labelText={"due on"}
            value={completeBy}
            handleChange={(handleTaskInput)}
          />
          {/* task location */}
          <FormRow
            type="text"
            name="taskLocation"
            labelText={"location"}
            value={taskLocation}
            handleChange={handleTaskInput}
          />
          {/* task type */}
          <FormRowSelect
            name="taskType"
            labelText={"task type"}
            value={taskType}
            list={taskTypeOptions}
            handleChange={handleTaskInput}
          />
          {/* task status */}
          <FormRowSelect
            name="status"
            labelText={"task status"}
            value={status}
            list={statusOptions}
            handleChange={handleTaskInput}
          />
          {/*  task description */}
          <FormRow
            type="text"
            name="description"
            value={description}
            handleChange={handleTaskInput}
          />
          <div className='btn-container'>
            <button type="submit" className='btn btn-block submit-btn' onClick={handleSubmit} disabled={isLoading}>
              submit
            </button>
            <button 
              className='btn btn-block clear-btn' 
              onClick={(e) => {
                e.preventDefault()
                clearValues()
              }}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  )
}

export default AddTask