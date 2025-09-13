import React, { useState, useEffect } from 'react'
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns'
import CalendarHeader from './CalendarHeader'
import MonthView from './MonthView'
import WeekView from './WeekView'
import DayView from './DayView'

const Calendar = ({ 
  currentDate, 
  view, 
  tasks, 
  onDateChange, 
  onViewChange, 
  onTaskClick, 
  onToggleTask,
  onAddTask,
  isDarkMode,
  onToggleDarkMode,
  hiddenTimeSlots,
  onToggleTimeSlot,
  dayStartHour,
  onDayStartHourChange,
  focusMode,
  onToggleFocusMode,
  taskSize,
  onTaskSizeChange,
  isTodayIST
}) => {
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  // Minimum distance for swipe
  const minSwipeDistance = 50

  const handleTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    }
    if (isRightSwipe) {
      handlePrevious()
    }
  }

  const handlePrevious = () => {
    switch (view) {
      case 'month':
        onDateChange(subMonths(currentDate, 1))
        break
      case 'week':
        onDateChange(subWeeks(currentDate, 1))
        break
      case 'day':
        onDateChange(subDays(currentDate, 1))
        break
      default:
        onDateChange(subMonths(currentDate, 1))
    }
  }

  const handleNext = () => {
    switch (view) {
      case 'month':
        onDateChange(addMonths(currentDate, 1))
        break
      case 'week':
        onDateChange(addWeeks(currentDate, 1))
        break
      case 'day':
        onDateChange(addDays(currentDate, 1))
        break
      default:
        onDateChange(addMonths(currentDate, 1))
    }
  }

  const handleToday = () => {
    // Get current date in IST
    const now = new Date()
    const istOffset = 5.5 * 60 // IST is UTC+5:30 in minutes
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
    const istTime = new Date(utc + (istOffset * 60000))
    onDateChange(istTime)
  }

  const renderView = () => {
    switch (view) {
      case 'week':
        return (
          <WeekView
            currentDate={currentDate}
            tasks={tasks}
            onTaskClick={onTaskClick}
            onToggleTask={onToggleTask}
            onAddTask={onAddTask}
            hiddenTimeSlots={hiddenTimeSlots}
            onToggleTimeSlot={onToggleTimeSlot}
            dayStartHour={dayStartHour}
            focusMode={focusMode}
            taskSize={taskSize}
            isTodayIST={isTodayIST}
          />
        )
      case 'day':
        return (
          <DayView
            currentDate={currentDate}
            tasks={tasks}
            onTaskClick={onTaskClick}
            onToggleTask={onToggleTask}
            onAddTask={onAddTask}
            hiddenTimeSlots={hiddenTimeSlots}
            onToggleTimeSlot={onToggleTimeSlot}
            dayStartHour={dayStartHour}
            focusMode={focusMode}
            taskSize={taskSize}
            isTodayIST={isTodayIST}
          />
        )
      default:
        return (
          <MonthView
            currentDate={currentDate}
            tasks={tasks}
            onTaskClick={onTaskClick}
            onToggleTask={onToggleTask}
            isTodayIST={isTodayIST}
          />
        )
    }
  }

  return (
    <div 
      className={`calendar-container ${view === 'day' ? 'day-view-container' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={onViewChange}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        dayStartHour={dayStartHour}
        onDayStartHourChange={onDayStartHourChange}
        focusMode={focusMode}
        onToggleFocusMode={onToggleFocusMode}
        taskSize={taskSize}
        onTaskSizeChange={onTaskSizeChange}
      />
      
      {renderView()}
      
      {/* Mobile Floating Action Button */}
      <button 
        className="mobile-fab"
        onClick={() => onAddTask()}
        aria-label="Add new task"
      >
        +
      </button>
    </div>
  )
}

export default Calendar
