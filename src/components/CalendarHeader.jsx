import React from 'react'
import { format } from 'date-fns'

const CalendarHeader = ({ 
  currentDate, 
  view, 
  onPrevious, 
  onNext, 
  onToday, 
  onViewChange,
  isDarkMode,
  onToggleDarkMode,
  dayStartHour,
  onDayStartHourChange,
  focusMode,
  onToggleFocusMode,
  taskSize,
  onTaskSizeChange,
  onOpenMobileSettings
}) => {
  const monthYear = format(currentDate, 'MMM yyyy')

  return (
    <div className="calendar-header">
      {/* Line 1: Title and Navigation */}
      <div className="header-line-1">
        <div className="calendar-title">
          {monthYear}
        </div>
        
        <div className="navigation-buttons">
          <button 
            className="nav-button"
            onClick={onPrevious}
            title="Previous month"
          >
            ‹
          </button>
          <button 
            className="nav-button"
            onClick={onToday}
            title="Go to today"
          >
            Today
          </button>
          <button 
            className="nav-button"
            onClick={onNext}
            title="Next month"
          >
            ›
          </button>
        </div>
      </div>

      {/* Line 2: View Toggle and Settings */}
      <div className="header-line-2">
        <div className="view-toggle">
          <button 
            className={`view-button ${view === 'day' ? 'active' : ''}`}
            onClick={() => onViewChange('day')}
          >
            Day
          </button>
          <button 
            className={`view-button ${view === 'week' ? 'active' : ''}`}
            onClick={() => onViewChange('week')}
          >
            Week
          </button>
          <button 
            className={`view-button ${view === 'month' ? 'active' : ''}`}
            onClick={() => onViewChange('month')}
          >
            Month
          </button>
        </div>
        
        {/* Desktop Controls - Hidden on Mobile */}
        <div className="desktop-controls">
          <select
            className="day-start-filter"
            value={dayStartHour}
            onChange={(e) => onDayStartHourChange(parseInt(e.target.value))}
            title="Day start time"
          >
            <option value="0">12 AM</option>
            <option value="1">1 AM</option>
            <option value="2">2 AM</option>
            <option value="3">3 AM</option>
            <option value="4">4 AM</option>
            <option value="5">5 AM</option>
            <option value="6">6 AM</option>
            <option value="7">7 AM</option>
            <option value="8">8 AM</option>
            <option value="9">9 AM</option>
            <option value="10">10 AM</option>
            <option value="11">11 AM</option>
            <option value="12">12 PM</option>
            <option value="13">1 PM</option>
            <option value="14">2 PM</option>
            <option value="15">3 PM</option>
            <option value="16">4 PM</option>
            <option value="17">5 PM</option>
            <option value="18">6 PM</option>
            <option value="19">7 PM</option>
            <option value="20">8 PM</option>
            <option value="21">9 PM</option>
            <option value="22">10 PM</option>
            <option value="23">11 PM</option>
          </select>
          
          <select
            className="task-size-filter"
            value={taskSize}
            onChange={(e) => onTaskSizeChange(e.target.value)}
            title="Task size"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          
          <button
            className="theme-toggle"
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          
          <button
            className={`focus-toggle ${focusMode ? 'active' : ''}`}
            onClick={onToggleFocusMode}
            title={focusMode ? 'Exit focus mode' : 'Enter focus mode - collapse all time slots except current hour'}
          >
            {focusMode ? '🔍' : '👁️'}
          </button>
        </div>
        
        {/* Mobile Settings Button */}
        <button 
          className="mobile-settings-button"
          onClick={onOpenMobileSettings}
          title="Settings"
        >
          ⚙️
        </button>
      </div>
    </div>
  )
}

export default CalendarHeader