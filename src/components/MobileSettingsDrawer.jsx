import React from 'react'

const MobileSettingsDrawer = ({ 
  isOpen, 
  onClose, 
  isDarkMode, 
  onToggleDarkMode, 
  dayStartHour, 
  onDayStartHourChange, 
  taskSize, 
  onTaskSizeChange, 
  focusMode, 
  onToggleFocusMode 
}) => {
  if (!isOpen) return null

  return (
    <div className="mobile-settings-overlay" onClick={onClose}>
      <div className="mobile-settings-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>Settings</h3>
          <button className="drawer-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="drawer-content">
          <div className="setting-group">
            <h4>Display</h4>
            <div className="setting-item">
              <label>Theme</label>
              <button
                className={`theme-toggle ${isDarkMode ? 'active' : ''}`}
                onClick={onToggleDarkMode}
              >
                {isDarkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
            
            <div className="setting-item">
              <label>Task Size</label>
              <select
                className="task-size-select"
                value={taskSize}
                onChange={(e) => onTaskSizeChange(e.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
          
          <div className="setting-group">
            <h4>Time</h4>
            <div className="setting-item">
              <label>Day Start Time</label>
              <select
                className="day-start-select"
                value={dayStartHour}
                onChange={(e) => onDayStartHourChange(parseInt(e.target.value))}
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
            </div>
          </div>
          
          <div className="setting-group">
            <h4>View</h4>
            <div className="setting-item">
              <label>Focus Mode</label>
              <button
                className={`focus-toggle ${focusMode ? 'active' : ''}`}
                onClick={onToggleFocusMode}
              >
                {focusMode ? '🔍 Exit Focus' : '👁️ Enter Focus'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileSettingsDrawer
