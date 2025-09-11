import React from 'react'

const TaskItem = ({ task, onClick, onToggle }) => {
  const handleClick = (e) => {
    e.stopPropagation()
    onClick()
  }

  const handleToggleClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onToggle()
  }

  const getTaskColor = (task) => {
    // Use custom color if available, otherwise fall back to category color
    if (task.color) {
      return task.color
    }
    
    const categoryColors = {
      personal: '#1976d2',
      work: '#f57c00',
      health: '#388e3c',
      education: '#7b1fa2',
      social: '#e91e63',
      other: '#455a64'
    }
    return categoryColors[task.category] || categoryColors.other
  }

  const getTaskBackgroundColor = (task) => {
    const taskColor = getTaskColor(task)
    // Convert hex to rgba with low opacity for background
    const hex = taskColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    return `rgba(${r}, ${g}, ${b}, 0.1)`
  }

  return (
    <div 
      className={`task-item ${task.completed ? 'completed' : ''}`}
      onClick={handleClick}
      style={{
        backgroundColor: getTaskBackgroundColor(task),
        borderColor: getTaskColor(task),
        borderLeftColor: getTaskColor(task)
      }}
    >
      <div 
        className={`task-checkbox ${task.completed ? 'checked' : ''}`}
        onClick={handleToggleClick}
      >
        {task.completed && '✓'}
      </div>
      <span className="task-title">
        {task.title}
        {task.duration && (
          <span className="task-duration" title={`Duration: ${task.duration} minutes`}>
            ({task.duration === 60 ? '1h' : `${task.duration}m`})
          </span>
        )}
        {task.subtasks && task.subtasks.length > 0 && (
          <span className="subtask-count" title={`Subtasks: ${task.subtasks.filter(s => s.completed).length}/${task.subtasks.length} completed`}>
            {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
          </span>
        )}
      </span>
    </div>
  )
}

export default TaskItem
