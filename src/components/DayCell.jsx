import React from 'react'
import { format } from 'date-fns'
import TaskItem from './TaskItem'

const DayCell = ({ 
  day, 
  tasks, 
  isCurrentMonth, 
  isToday, 
  onTaskClick, 
  onToggleTask,
  onAddTask
}) => {
  const dayNumber = format(day, 'd')

  const handleDayClick = (e) => {
    // Check if click is directly on a task item or its children
    if (e.target.classList.contains('task-item') || e.target.closest('.task-item')) {
      return // Don't create new task if clicking on existing task
    }
    
    // Check if click is on the more-tasks indicator
    if (e.target.classList.contains('more-tasks')) {
      return
    }
    
    // Create new task for any other click on the day cell
    onAddTask(format(day, 'yyyy-MM-dd'))
  }

  return (
    <div 
      className={`day-cell ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
      onClick={handleDayClick}
    >
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
