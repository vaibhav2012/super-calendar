import React, { useState, useEffect } from 'react'
import { 
  format,
  isSameDay,
  isToday,
  addDays,
  subDays
} from 'date-fns'
import TaskItem from './TaskItem'

const DayView = ({ currentDate, tasks, onTaskClick, onToggleTask, onAddTask, hiddenTimeSlots = [], onToggleTimeSlot, dayStartHour = 8, focusMode = false, taskSize = 'small', isTodayIST }) => {
  const dayTasks = tasks.filter(task => 
    isSameDay(new Date(task.date), currentDate)
  )

  // Generate time slots starting from dayStartHour, filtering out hidden ones
  const timeSlots = []
  for (let i = 0; i < 24; i++) {
    const hour = (dayStartHour + i) % 24
    if (!hiddenTimeSlots.includes(hour)) {
      timeSlots.push({
        hour,
        time: `${hour.toString().padStart(2, '0')}:00`,
        displayTime: format(new Date(`2000-01-01T${hour.toString().padStart(2, '0')}:00`), 'h a')
      })
    }
  }
  
  // Current time tracking in IST
  const getISTTime = () => {
    const now = new Date()
    const istOffset = 5.5 * 60 // IST is UTC+5:30 in minutes
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
    const istTime = new Date(utc + (istOffset * 60000))
    return istTime
  }
  
  const [currentTime, setCurrentTime] = useState(getISTTime())
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getISTTime())
    }, 60000) // Update every minute
    
    return () => clearInterval(timer)
  }, [])
  
  // Calculate current time position
  const getCurrentTimePosition = () => {
    const now = currentTime
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    
    // Check if current time is in visible time slots
    if (timeSlots.length === 0) return null
    
    const firstVisibleHour = Math.min(...timeSlots.map(slot => slot.hour))
    const lastVisibleHour = Math.max(...timeSlots.map(slot => slot.hour))
    
    if (currentHour < firstVisibleHour || currentHour > lastVisibleHour) return null
    
    // Calculate position relative to visible slots
    const slotHeight = 60 // Base slot height
    const minutesPerSlot = 60
    const positionFromFirstSlot = (currentHour - firstVisibleHour) * slotHeight + (currentMinute / minutesPerSlot) * slotHeight
    
    return positionFromFirstSlot
  }
  
  const currentTimePosition = getCurrentTimePosition()
  
  // Check if a time slot should be collapsed in focus mode
  const isTimeSlotCollapsed = (timeSlot) => {
    if (!focusMode) return false
    
    // Get current hour in IST
    const now = currentTime
    const currentHour = now.getHours()
    
    // Only show the current hour slot, collapse all others
    return timeSlot.hour !== currentHour
  }
  
  // Get tasks for each time slot
  const getTasksForTimeSlot = (timeSlot) => {
    return dayTasks.filter(task => {
      if (!task.time) return false
      
      // Parse task time - handle both HH:MM and H:MM formats
      const timeParts = task.time.split(':')
      const taskHour = parseInt(timeParts[0], 10)
      const taskMinute = parseInt(timeParts[1] || '0', 10)
      
      // Simple hour comparison - task should be in the slot that matches its hour
      return taskHour === timeSlot.hour
    })
  }

  // Calculate dynamic height for time slots based on task count and size
  const getTimeSlotHeight = (taskCount) => {
    const baseHeight = 70 // Increased base height for better task visibility
    
    let taskHeight, maxHeight
    switch (taskSize) {
      case 'small':
        taskHeight = 10 // Increased for better visibility
        maxHeight = 100
        break
      case 'medium':
        taskHeight = 15 // Increased for better visibility
        maxHeight = 120
        break
      case 'large':
        taskHeight = 20 // Increased for better visibility
        maxHeight = 140
        break
      default:
        taskHeight = 10
        maxHeight = 100
    }
    
    // For dynamic sizing: if 1 task, give it more space; if multiple, distribute equally
    if (taskCount === 0) {
      return baseHeight
    } else if (taskCount === 1) {
      return Math.max(baseHeight + taskHeight * 2, 80) // Single task gets more space
    } else {
      return Math.min(baseHeight + (taskCount * taskHeight), maxHeight)
    }
  }

  // Get all-day tasks
  const allDayTasks = dayTasks.filter(task => !task.time)

  return (
    <div className="day-view">
        <div className={`day-header ${isTodayIST(currentDate) ? 'today' : ''}`}>
        <div className="day-title">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </div>
      </div>
      
      <div className="day-content">

        {/* Time slots grid */}
        <div className="day-time-slots">
          <div className="day-time-labels">
            {timeSlots.map(timeSlot => (
              <div 
                key={timeSlot.hour} 
                className="day-time-label"
                style={{ minHeight: `${getTimeSlotHeight(getTasksForTimeSlot(timeSlot).length)}px` }}
              >
                {timeSlot.displayTime}
              </div>
            ))}
          </div>
          <div className="day-time-content">
            {timeSlots.map(timeSlot => {
              const slotTasks = getTasksForTimeSlot(timeSlot)
              const isCollapsed = isTimeSlotCollapsed(timeSlot)
              const slotHeight = isCollapsed ? 20 : getTimeSlotHeight(slotTasks.length)
              return (
                <div 
                  key={timeSlot.hour} 
                  className={`day-time-slot ${isTodayIST(currentDate) && currentTime.getHours() === timeSlot.hour ? 'current-time-slot' : ''} ${isCollapsed ? 'collapsed' : ''}`}
                  style={{ minHeight: `${slotHeight}px` }}
                  onClick={(e) => {
                    // Check if click is on a task - if so, don't add new task
                    if (e.target.closest('.day-time-slot-task')) {
                      return
                    }
                    // Otherwise, add new task
                    onAddTask(format(currentDate, 'yyyy-MM-dd'), timeSlot.time)
                  }}
                >
                  {!isCollapsed && slotTasks.map(task => (
                    <div key={task.id} className={`day-time-slot-task task-size-${taskSize}`}>
                      <TaskItem
                        task={task}
                        onClick={() => onTaskClick(task)}
                        onToggle={() => onToggleTask(task.id)}
                      />
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>


        {/* No tasks message */}
        {dayTasks.length === 0 && (
          <div className="no-tasks">
            <p>No tasks scheduled for this day</p>
            <p className="no-tasks-subtitle">Click the + button to add a new task</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DayView
