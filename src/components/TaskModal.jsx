import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'

const TaskModal = ({ task, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '',
    duration: 30, // Default 30 minutes
    completed: false,
    category: 'personal',
    color: '#1976d2', // Default blue color
    isRecurring: false,
    recurringType: 'daily',
    recurringInterval: 1,
    recurringEndDate: '',
    recurringEndAfter: '',
    // Weekly options
    weeklyDays: [],
    // Monthly options
    monthlyType: 'dayOfMonth', // 'dayOfMonth', 'dayOfWeek'
    monthlyDay: 1, // day of month (1-31)
    monthlyWeekday: 1, // 1-7 (Mon-Sun)
    monthlyWeek: 1, // 1-4 (first, second, third, fourth) or -1 (last)
    // Subtasks
    subtasks: []
  })

  useEffect(() => {
    if (task) {
      if (task.isNew) {
        // New task with preselected values
        setFormData(prev => ({
          ...prev,
          title: '',
          description: '',
          date: task.date ? format(new Date(task.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
          time: task.time || '',
          completed: false,
          isRecurring: false
        }))
      } else {
        // Existing task
      setFormData({
        title: task.title || '',
        description: task.description || '',
        date: task.date ? format(new Date(task.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        time: task.time || '',
          duration: task.duration || 30,
          completed: task.completed || false,
          category: task.category || 'personal',
          color: task.color || '#1976d2',
          isRecurring: task.isRecurring || false,
          recurringType: task.recurringType || 'daily',
          recurringInterval: task.recurringInterval || 1,
          recurringEndDate: task.recurringEndDate ? format(new Date(task.recurringEndDate), 'yyyy-MM-dd') : '',
          recurringEndAfter: task.recurringEndAfter || '',
          weeklyDays: task.weeklyDays || [],
          monthlyType: task.monthlyType || 'dayOfMonth',
          monthlyDay: task.monthlyDay || 1,
          monthlyWeekday: task.monthlyWeekday || 1,
          monthlyWeek: task.monthlyWeek || 1,
          subtasks: task.subtasks || []
        })
      }
    }
  }, [task])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('Please enter a task title')
      return
    }

    const taskData = {
      ...formData,
      date: new Date(formData.date).toISOString(),
      recurringEndDate: formData.recurringEndDate ? new Date(formData.recurringEndDate).toISOString() : null
    }

    onSave(taskData)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Subtask management functions
  const addSubtask = () => {
    const newSubtask = {
      id: `subtask-${Date.now()}`,
      title: '',
      completed: false,
      order: formData.subtasks.length
    }
    setFormData(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, newSubtask]
    }))
  }

  const removeSubtask = (subtaskId) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(subtask => subtask.id !== subtaskId)
    }))
  }

  const updateSubtask = (subtaskId, field, value) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(subtask =>
        subtask.id === subtaskId ? { ...subtask, [field]: value } : subtask
      )
    }))
  }

  const toggleSubtaskCompletion = (subtaskId) => {
    setFormData(prev => {
      const updatedSubtasks = prev.subtasks.map(subtask =>
        subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
      )
      
      // Check if all subtasks are completed
      const allSubtasksCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every(subtask => subtask.completed)
      
      return {
        ...prev,
        subtasks: updatedSubtasks,
        completed: allSubtasksCompleted || prev.completed // Auto-complete if all subtasks done, or keep manual completion
      }
    })
  }

  const handleWeeklyDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      weeklyDays: prev.weeklyDays.includes(day)
        ? prev.weeklyDays.filter(d => d !== day)
        : [...prev.weeklyDays, day]
    }))
  }


  const handleDelete = () => {
      onDelete(task.id)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
                  {task && !task.isNew ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Subtasks Section */}
          <div className="form-group">
            <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span>Subtasks</span>
              <button
                type="button"
                onClick={addSubtask}
                style={{
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                + Add Subtask
              </button>
            </div>
            
            {formData.subtasks.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                {formData.subtasks.map((subtask, index) => (
                  <div 
                    key={subtask.id} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                      padding: '8px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      backgroundColor: '#f9f9f9'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtaskCompletion(subtask.id)}
                      style={{ margin: 0, width: '16px', height: '16px' }}
                    />
                    <input
                      type="text"
                      value={subtask.title}
                      onChange={(e) => updateSubtask(subtask.id, 'title', e.target.value)}
                      placeholder={`Subtask ${index + 1}`}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px',
                        background: 'white'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeSubtask(subtask.id)}
                      style={{
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-input form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description (optional)"
            />
          </div>

          <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="date">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-input"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="time">
              Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              className="form-input"
              value={formData.time}
              onChange={handleChange}
            />
          </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="duration">
                Duration
              </label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="form-input"
              >
                <option value={1}>1 minute</option>
                <option value={2}>2 minutes</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={25}>25 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={35}>35 minutes</option>
                <option value={40}>40 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={50}>50 minutes</option>
                <option value={55}>55 minutes</option>
                <option value={60}>1 hour</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="health">Health</option>
                <option value="education">Education</option>
                <option value="social">Social</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Task Color</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                {[
                  { value: '#1976d2', name: 'Blue', preview: '#1976d2' },
                  { value: '#388e3c', name: 'Green', preview: '#388e3c' },
                  { value: '#f57c00', name: 'Orange', preview: '#f57c00' },
                  { value: '#d32f2f', name: 'Red', preview: '#d32f2f' },
                  { value: '#7b1fa2', name: 'Purple', preview: '#7b1fa2' },
                  { value: '#00796b', name: 'Teal', preview: '#00796b' },
                  { value: '#5d4037', name: 'Brown', preview: '#5d4037' },
                  { value: '#455a64', name: 'Gray', preview: '#455a64' },
                  { value: '#e91e63', name: 'Pink', preview: '#e91e63' },
                  { value: '#ff9800', name: 'Amber', preview: '#ff9800' }
                ].map(color => (
                  <label 
                    key={color.value} 
                    title={color.name}
                    style={{
                      position: 'relative',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: formData.color === color.value ? '2px solid #1976d2' : '2px solid #e0e0e0',
                      background: '#f5f5f5',
                      transition: 'all 0.2s',
                      boxShadow: formData.color === color.value ? '0 0 0 2px rgba(25, 118, 210, 0.2)' : 'none'
                    }}
                  >
                    <input
                      type="radio"
                      name="color"
                      value={color.value}
                      checked={formData.color === color.value}
                      onChange={handleChange}
                      style={{
                        position: 'absolute',
                        opacity: 0,
                        width: '100%',
                        height: '100%',
                        margin: 0,
                        cursor: 'pointer'
                      }}
                    />
                    <span 
                      style={{ 
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '2px solid #fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        backgroundColor: color.preview
                      }}
                    ></span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  style={{ margin: 0, width: '16px', height: '16px' }}
                />
                Make this a recurring task
              </label>
            </div>
          </div>

          {formData.isRecurring && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="recurringType">
                    Repeat
                  </label>
                  <select
                    id="recurringType"
                    name="recurringType"
                    className="form-input"
                    value={formData.recurringType}
                    onChange={handleChange}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="recurringInterval">
                    Every
                  </label>
                  <input
                    type="number"
                    id="recurringInterval"
                    name="recurringInterval"
                    className="form-input"
                    value={formData.recurringInterval}
                    onChange={handleChange}
                    min="1"
                    max="365"
                    style={{ width: '80px' }}
                  />
                  <span style={{ marginLeft: '8px', color: '#5f6368' }}>
                    {formData.recurringType === 'daily' ? 'day(s)' :
                     formData.recurringType === 'weekly' ? 'week(s)' :
                     formData.recurringType === 'monthly' ? 'month(s)' : 'year(s)'}
                  </span>
                </div>
              </div>

              {/* Weekly day selection */}
              {formData.recurringType === 'weekly' && (
                <div className="form-group">
                  <label className="form-label">Repeat on days:</label>
                  <div className="weekly-days-container">
                    {[
                      { value: 1, label: 'Mon' },
                      { value: 2, label: 'Tue' },
                      { value: 3, label: 'Wed' },
                      { value: 4, label: 'Thu' },
                      { value: 5, label: 'Fri' },
                      { value: 6, label: 'Sat' },
                      { value: 0, label: 'Sun' }
                    ].map(day => (
                      <label 
                        key={day.value} 
                        className={`weekly-day-option ${formData.weeklyDays.includes(day.value) ? 'checked' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.weeklyDays.includes(day.value)}
                          onChange={() => handleWeeklyDayToggle(day.value)}
                        />
                        <span>{day.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Monthly options */}
              {formData.recurringType === 'monthly' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Repeat on:</label>
                    <div className="monthly-options">
                      <label className="monthly-option">
                        <input
                          type="radio"
                          name="monthlyType"
                          value="dayOfMonth"
                          checked={formData.monthlyType === 'dayOfMonth'}
                          onChange={handleChange}
                        />
                        <span>Day of month</span>
                      </label>
                      <label className="monthly-option">
                        <input
                          type="radio"
                          name="monthlyType"
                          value="dayOfWeek"
                          checked={formData.monthlyType === 'dayOfWeek'}
                          onChange={handleChange}
                        />
                        <span>Day of week</span>
                      </label>
                    </div>
                  </div>

                  {formData.monthlyType === 'dayOfMonth' && (
                    <div className="form-group">
                      <label className="form-label" htmlFor="monthlyDay">
                        Day of month
                      </label>
                      <input
                        type="number"
                        id="monthlyDay"
                        name="monthlyDay"
                        className="form-input"
                        value={formData.monthlyDay}
                        onChange={handleChange}
                        min="1"
                        max="31"
                        style={{ width: '80px' }}
                      />
                    </div>
                  )}

                  {formData.monthlyType === 'dayOfWeek' && (
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="monthlyWeek">
                          Week
                        </label>
                        <select
                          id="monthlyWeek"
                          name="monthlyWeek"
                          className="form-input"
                          value={formData.monthlyWeek}
                          onChange={handleChange}
                        >
                          <option value="1">First</option>
                          <option value="2">Second</option>
                          <option value="3">Third</option>
                          <option value="4">Fourth</option>
                          <option value="-1">Last</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="monthlyWeekday">
                          Day of week
                        </label>
                        <select
                          id="monthlyWeekday"
                          name="monthlyWeekday"
                          className="form-input"
                          value={formData.monthlyWeekday}
                          onChange={handleChange}
                        >
                          <option value="1">Monday</option>
                          <option value="2">Tuesday</option>
                          <option value="3">Wednesday</option>
                          <option value="4">Thursday</option>
                          <option value="5">Friday</option>
                          <option value="6">Saturday</option>
                          <option value="0">Sunday</option>
                        </select>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="recurringEndDate">
                    End Date (optional)
                  </label>
                  <input
                    type="date"
                    id="recurringEndDate"
                    name="recurringEndDate"
                    className="form-input"
                    value={formData.recurringEndDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="recurringEndAfter">
                    Or end after (optional)
                  </label>
                  <input
                    type="number"
                    id="recurringEndAfter"
                    name="recurringEndAfter"
                    className="form-input"
                    value={formData.recurringEndAfter}
                    onChange={handleChange}
                    min="1"
                    max="1000"
                    placeholder="Number of occurrences"
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-row">
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                name="completed"
                checked={formData.completed}
                onChange={handleChange}
                style={{ margin: 0, width: '16px', height: '16px' }}
              />
              Mark as completed
            </label>
          </div>
          </div>

          <div className="modal-actions">
            {task && (
              <button
                type="button"
                className="button button-secondary"
                onClick={handleDelete}
                style={{ marginRight: 'auto', color: '#d93025' }}
              >
                Delete
              </button>
            )}
            <button
              type="button"
              className="button button-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button button-primary"
            >
              {task ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal
