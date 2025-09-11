import React from 'react'
import { format } from 'date-fns'
import TaskItem from './TaskItem'

const DayCell = ({ 
  day, 
  tasks, 
  isCurrentMonth, 
  isToday, 
  onTaskClick, 
  onToggleTask 
}) => {
  const dayNumber = format(day, 'd')

  return (
    <div className={`day-cell ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}>
      <div className={`day-number ${isToday ? 'today' : ''}`}>
        {dayNumber}
      </div>
      
      <div className="tasks-container">
        {tasks.slice(0, 3).map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            onToggle={(e) => {
              e.stopPropagation()
              onToggleTask(task.id)
            }}
          />
        ))}
        {tasks.length > 3 && (
          <div className="more-tasks">
            +{tasks.length - 3} more
          </div>
        )}
      </div>
    </div>
  )
}

export default DayCell
