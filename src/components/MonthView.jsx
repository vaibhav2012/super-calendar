import React from 'react'
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  isToday,
  format
} from 'date-fns'
import DayCell from './DayCell'

const MonthView = ({ currentDate, tasks, onTaskClick, onToggleTask, onAddTask, isTodayIST }) => {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const dateFormat = 'd'
  const rows = []
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  let days_array = []
  let day = startDate

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const dayTasks = tasks.filter(task => 
        isSameDay(new Date(task.date), day)
      )
      
      days_array.push(
        <DayCell
          key={day}
          day={day}
          tasks={dayTasks}
          isCurrentMonth={isSameMonth(day, monthStart)}
          isToday={isTodayIST(day)}
          onTaskClick={onTaskClick}
          onToggleTask={onToggleTask}
          onAddTask={onAddTask}
          isTodayIST={isTodayIST}
        />
      )
      day = addDays(day, 1)
    }
    rows.push(
      <div key={day} className="week-row">
        {days_array}
      </div>
    )
    days_array = []
  }

  return (
    <div className="month-view">
      <div className="month-grid">
        {days.map(day => (
          <div key={day} className="month-day-header">
            {day}
          </div>
        ))}
        {rows}
      </div>
    </div>
  )
}

export default MonthView
