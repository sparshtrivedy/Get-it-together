import React, {useEffect} from 'react'
import { useAppContext } from '../../context/appContext'
import { StatsContainer, Loading, ChartsContainer } from '../../components'

const Stats = () => {
  const {showStats, isLoading, monthlyTasks} = useAppContext();

  useEffect(() => {
    showStats();
    // eslint-disable-next-line
  }, [])

  if (isLoading) {
    return <Loading center />
  }

  return (
    <>
      <StatsContainer />
      {(monthlyTasks.length > 0) && <ChartsContainer />}
    </>
  )
}

export default Stats