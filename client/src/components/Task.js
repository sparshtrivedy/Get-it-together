import dayjs from 'dayjs'
import React from 'react'
import { FaLocationArrow, FaBook, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/Job';
import TaskInfo from './TaskInfo';

const Task = ({
  _id, 
  taskItem, 
  completeBy,
  taskLocation,
  taskType,
  status,
  description,
}) => {
  const {setEditTask, deleteTask} = useAppContext();
  const dueDate = dayjs(completeBy).format('MMM DD, YYYY');
  const statusClassName = status.replace(' ', '');
  return (
    <Wrapper>
      <header>
        <div className='main-icon'>
          {taskItem.charAt(0)}
        </div>
        <div className='info'>
          <h5>{taskItem}</h5>
          <p>{taskType}</p>
        </div>
      </header>
      <div className='content'>
        <div className='content-center'>
          <TaskInfo icon={<FaLocationArrow />} text={taskLocation} />
          <TaskInfo icon={<FaCalendarAlt />} text={dueDate} />
          <TaskInfo icon={<FaBook />} text={description} />
          <div className={`status ${statusClassName}`}> 
            {status}
          </div>
        </div>
        <footer>
          <div className='actions'>
            <Link to='/add-task' className='btn edit-btn' onClick={() => setEditTask(_id)}>
              Edit
            </Link>
            <button type="button" className='btn delete-btn' onClick={() => deleteTask(_id)}>
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  )
}

export default Task