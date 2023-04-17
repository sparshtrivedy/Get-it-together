import React, { useEffect } from 'react'
import Wrapper from '../assets/wrappers/JobsContainer';
import Task from './Task';
import { useAppContext } from '../context/appContext';
import Loading from './Loading';
import PageBtnContainer from './PageBtnContainer';

const TasksContainer = () => {
  const {getTasks, tasks, isLoading, page, totalTasks, search, searchType, searchStatus, sort } = useAppContext();

  useEffect(() => {
    getTasks();
    // eslint-disable-next-line
  }, [search, searchType, searchStatus, sort, page])

  if (isLoading) {
    return <Loading center />
  }

  if (tasks.length === 0) {
    return (
      <Wrapper>
        <h2>No tasks to display...</h2>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <h5>{totalTasks} task{tasks.length > 1 && 's'} found</h5>
      <div className='jobs'>
        {tasks.map((task) => {
          return <Task key={task._id} {...task} />
        })}
      </div>
      <PageBtnContainer />
    </Wrapper>
  );
}

export default TasksContainer