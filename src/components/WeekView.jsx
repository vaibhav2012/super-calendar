import React, { useState, useEffect } from 'react'
import { 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  format,
  isSameDay,
  isToday
} from 'date-fns'
import TaskItem from './TaskItem'

const WeekView = ({ currentDate, tasks, onTaskClick, onToggleTask, onAddTask, hiddenTimeSlots = [], onToggleTimeSlot, dayStartHour = 8, focusMode = false, taskSize = 'small', isTodayIST }) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  
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

  // Get tasks for each day and time slot
  const getTasksForDayAndTime = (day, timeSlot) => {
    return tasks.filter(task => {
      if (!isSameDay(new Date(task.date), day)) return false
      if (!task.time) return false
      
      // Parse task time - handle both HH:MM and H:MM formats
      const timeParts = task.time.split(':')
      const taskHour = parseInt(timeParts[0], 10)
      const taskMinute = parseInt(timeParts[1] || '0', 10)
      
      // Simple hour comparison - task should be in the slot that matches its hour
      return taskHour === timeSlot.hour
    })
  }

  // Get all-day tasks for each day
  const getAllDayTasksForDay = (day) => {
    return tasks.filter(task => {
      if (!isSameDay(new Date(task.date), day)) return false
      return !task.time
    })
  }

  // Calculate dynamic height for time slots based on task count and size
  const getTimeSlotHeight = (taskCount) => {
    const baseHeight = 50 // Increased base height for better task visibility
    
    let taskHeight, maxHeight
    switch (taskSize) {
      case 'small':
        taskHeight = 8 // Increased for better visibility
        maxHeight = 80
        break
      case 'medium':
        taskHeight = 12 // Increased for better visibility
        maxHeight = 100
        break
      case 'large':
        taskHeight = 16 // Increased for better visibility
        maxHeight = 120
        break
      default:
        taskHeight = 8
        maxHeight = 80
    }
    
    // For dynamic sizing: if 1 task, give it more space; if multiple, distribute equally
    if (taskCount === 0) {
      return baseHeight
    } else if (taskCount === 1) {
      return Math.max(baseHeight + taskHeight * 2, 60) // Single task gets more space
    } else {
      return Math.min(baseHeight + (taskCount * taskHeight), maxHeight)
    }
  }



  // Calculate dynamic height for all-day sections based on task count
  const getAllDaySectionHeight = (taskCount) => {
    const baseHeight = 60 // Base height for empty section
    const taskHeight = 35 // Height per task
    const maxHeight = 200 // Maximum height
    return Math.min(baseHeight + (taskCount * taskHeight), maxHeight)
  }

  // Generate day headers based on the actual week start (Monday)
  const dayHeaders = []
  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i)
    dayHeaders.push(format(day, 'EEE'))
  }

  return (
    <div className="week-view">
      {/* Day headers - separate from grid */}
      <div className="week-day-headers">
        <div className="week-time-column-header"></div>
        {dayHeaders.map((dayName, index) => {
          const day = addDays(weekStart, index)
          return (
            <div 
              key={`header-${dayName}`} 
              className={`week-day-header ${isTodayIST(day) ? 'today' : ''}`}
            >
              <div className="day-name">{dayName}</div>
              <div className="day-date">{format(day, 'd')}</div>
            </div>
          )
        })}
      </div>
      
      {/* Time slots grid - separate from headers */}
      <div className="week-time-slots">
        {/* Time column header */}
        <div className="week-time-header"></div>
        
        {/* Time labels */}
        {timeSlots.map((timeSlot, timeIndex) => {
          const isCollapsed = isTimeSlotCollapsed(timeSlot)
          const labelHeight = isCollapsed ? 20 : 40
          
          return (
            <div 
              key={timeSlot.hour} 
              className={`week-time-label ${isCollapsed ? 'collapsed' : ''}`}
              style={{ 
                gridRow: timeIndex + 1,
                minHeight: `${labelHeight}px`
              }}
            >
              {timeSlot.displayTime}
            </div>
          )
        })}
        
        {/* Day time slots */}
        {dayHeaders.map((dayName, dayIndex) => {
          const day = addDays(weekStart, dayIndex)
          return timeSlots.map((timeSlot, timeIndex) => {
            const slotTasks = getTasksForDayAndTime(day, timeSlot)
            const isCollapsed = isTimeSlotCollapsed(timeSlot)
            const slotHeight = isCollapsed ? 20 : getTimeSlotHeight(slotTasks.length)
            
            return (
              <div 
                key={`${dayName}-${timeSlot.hour}`} 
                className={`week-time-slot ${isTodayIST(day) && currentTime.getHours() === timeSlot.hour ? 'current-time-slot' : ''} ${isCollapsed ? 'collapsed' : ''}`}
                style={{ 
                  gridColumn: dayIndex + 2,
                  gridRow: timeIndex + 1,
                  minHeight: `${slotHeight}px`
                }}
                onClick={(e) => {
                  // Check if click is directly on a task item
                  if (e.target.classList.contains('task-item') || e.target.closest('.task-item')) {
                    return
                  }
                  onAddTask(format(day, 'yyyy-MM-dd'), timeSlot.time)
                }}
              >
                <div className="week-time-content">
                  {!isCollapsed && slotTasks.map(task => (
                    <div key={task.id} className={`week-time-slot-task task-size-${taskSize}`}>
                      <TaskItem
                        task={task}
                        onClick={() => onTaskClick(task)}
                        onToggle={() => onToggleTask(task.id)}
                      />
          </div>
        ))}
                </div>
              </div>
            )
          })
        })}
      </div>
    </div>
  )
}

export default WeekView
