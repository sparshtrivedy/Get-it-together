import React from 'react'
import StatItem from './StatItem'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/StatsContainer'
import { FaPlay, FaPause, FaMinusCircle, FaCheckCircle } from 'react-icons/fa'

const StatsContainer = () => {
    const {stats} = useAppContext()
    const defaultStats = [
        {
          title: 'in progress',
          count: stats['in progress'] || 0,
          icon: <FaPlay />,
          color: '#647acb',
          bcg: '#e0e8f9',
        },
        {
          title: 'to do',
          count: stats['to do'] || 0,
          icon: <FaPause />,
          color: '#e9b949',
          bcg: '#fcefc7',
        },
        {
          title: 'complete',
          count: stats['complete'] || 0,
          icon: <FaCheckCircle />,
          color: '#7dbd59',
          bcg: '#def9e1',
        },
        {
            title: 'blocked',
            count: stats['blocked'] || 0,
            icon: <FaMinusCircle />,
            color: '#d66a6a',
            bcg: '#ffeeee',
          },
      ];

    return (
        <Wrapper>
            {defaultStats.map((item,index) => {
                return <StatItem key={index} {...item} />
            })}
        </Wrapper>
    )
}

export default StatsContainer