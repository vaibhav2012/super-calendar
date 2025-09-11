import React, { useState, useEffect, useMemo } from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay, addDays, addWeeks, addMonths, addYears } from 'date-fns'
import Calendar from './components/Calendar'
import TaskModal from './components/TaskModal'
import DeleteConfirmationModal from './components/DeleteConfirmationModal'
import UpdateConfirmationModal from './components/UpdateConfirmationModal'
import Navigation from './components/Navigation'
import Auth from './components/Auth'
import MigrationModal from './components/MigrationModal'
import { useAuth } from './contexts/AuthContext'
import { useTasks, useSettings, useRecurringData } from './hooks/useFirestore'
import { getAllTasksForDateRange, getTasksForDay, generateRecurringInstances } from './utils/recurringTasks'
import { hasLocalStorageData, migrateLocalStorageToFirestore } from './utils/migrateData'

function CalendarApp() {
  // Get current date in IST
  const getISTDate = () => {
    const now = new Date()
    // Get IST time using a more reliable method
    const istOffset = 5.5 * 60 // IST is UTC+5:30 in minutes
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
    const istTime = new Date(utc + (istOffset * 60000))
    return istTime
  }
  
  // IST-aware isToday function
  const isTodayIST = (date) => {
    const istToday = getISTDate()
    const istDate = new Date(date)
    istDate.setHours(0, 0, 0, 0)
    istToday.setHours(0, 0, 0, 0)
    return istDate.getTime() === istToday.getTime()
  }
  
  const { currentUser } = useAuth()
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask, batchUpdateTasks } = useTasks()
  const { settings, loading: settingsLoading, updateSettings } = useSettings()
  const { recurringData, updateRecurringData, batchUpdateRecurringData } = useRecurringData()
  
  const [currentDate, setCurrentDate] = useState(getISTDate())
  const [selectedTask, setSelectedTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [taskToUpdate, setTaskToUpdate] = useState(null)
  const [pendingTaskData, setPendingTaskData] = useState(null)
  const [showMigrationModal, setShowMigrationModal] = useState(false)
  const [migrationCompleted, setMigrationCompleted] = useState(false)

  // Check for localStorage data on first login
  useEffect(() => {
    if (currentUser && !migrationCompleted && hasLocalStorageData()) {
      setShowMigrationModal(true)
    }
  }, [currentUser, migrationCompleted])

  const handleMigrationComplete = () => {
    setShowMigrationModal(false)
    setMigrationCompleted(true)
  }

  const handleAddTask = (preselectedDate = null, preselectedTime = null) => {
    // Create a special object for new tasks with preselected values
    const newTaskData = {
      isNew: true,
      date: preselectedDate,
      time: preselectedTime
    }
    setSelectedTask(newTaskData)
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask && !selectedTask.isNew) {
      // Edit existing task
        if (selectedTask.isInstance && selectedTask.originalTaskId) {
          // If editing a recurring task instance, show update confirmation modal
          console.log(`Triggering update modal for recurring task instance: ${selectedTask.id}`)
          setTaskToUpdate(selectedTask)
          setPendingTaskData(taskData)
          setIsUpdateModalOpen(true)
          return // Don't close the modal yet
        } else {
          // If editing a regular task or original recurring task
          const updatedTask = { ...taskData }
          // Check if all subtasks are completed and auto-complete the task
          if (updatedTask.subtasks && updatedTask.subtasks.length > 0) {
            const allSubtasksCompleted = updatedTask.subtasks.every(subtask => subtask.completed)
            if (allSubtasksCompleted && !updatedTask.completed) {
              updatedTask.completed = true
            }
          }
          await updateTask(selectedTask.id, updatedTask)
        }
    } else {
        // Add new task (either from plus button or time slot click)
      const newTask = {
        ...taskData,
        createdAt: new Date().toISOString()
      }
        
        // Check if all subtasks are completed and auto-complete the task
        if (newTask.subtasks && newTask.subtasks.length > 0) {
          const allSubtasksCompleted = newTask.subtasks.every(subtask => subtask.completed)
          if (allSubtasksCompleted && !newTask.completed) {
            newTask.completed = true
          }
        }
        
        await addTask(newTask)
    }
    setIsModalOpen(false)
    setSelectedTask(null)
    } catch (error) {
      console.error('Error saving task:', error)
      // You might want to show an error message to the user here
    }
  }

  const handleUpdateConfirm = async (updateScope) => {
    if (!taskToUpdate || !pendingTaskData) return

    try {
      const currentDate = taskToUpdate.date.split('T')[0]

      // Check if all subtasks are completed and auto-complete the task
      let updatedPendingData = { ...pendingTaskData }
      if (updatedPendingData.subtasks && updatedPendingData.subtasks.length > 0) {
        const allSubtasksCompleted = updatedPendingData.subtasks.every(subtask => subtask.completed)
        if (allSubtasksCompleted && !updatedPendingData.completed) {
          updatedPendingData.completed = true
          // Add a flag to indicate this update includes auto-completion
          updatedPendingData._autoCompleted = true
        }
      }

      console.log(`Update scope: ${updateScope}, Current date: ${currentDate}, Task ID: ${taskToUpdate.originalTaskId}`)

      if (updateScope === 'all') {
        // For "all tasks", store a global update that applies to all instances
        console.log(`Updating all instances for task: ${taskToUpdate.originalTaskId}`)
        
        const globalUpdateKey = `task_global_update_${taskToUpdate.originalTaskId}`
        await updateRecurringData(globalUpdateKey, updatedPendingData)
        
        // Clear any existing instance-specific updates since global update should override them
        const updates = []
        Object.keys(recurringData).forEach(key => {
          if (key.startsWith(`task_update_${taskToUpdate.originalTaskId}_`)) {
            updates.push({ key, data: null }) // null means delete
          }
        })
        
        if (updates.length > 0) {
          await batchUpdateRecurringData(updates)
        }
        
      } else if (updateScope === 'currentAndFuture') {
        // For "current & future tasks", store updates for current and future instances only
        console.log(`Updating current and future instances for task: ${taskToUpdate.originalTaskId}`)
        
        // Store the updated data for the current instance
        const updateKey = `task_update_${taskToUpdate.originalTaskId}_${currentDate}`
        await updateRecurringData(updateKey, updatedPendingData)
        
        // Get the original task to find future instances
        const originalTask = tasks.find(task => task.id === taskToUpdate.originalTaskId)
        if (originalTask) {
          // Generate future instances (from the day after the current instance's date onwards)
          const currentInstanceDate = new Date(taskToUpdate.date)
          const startDate = new Date(currentInstanceDate)
          startDate.setDate(startDate.getDate() + 1) // Day after current instance
          const endDate = new Date()
          endDate.setDate(endDate.getDate() + 30)
          
          console.log(`Current instance date: ${currentInstanceDate.toISOString().split('T')[0]}`)
          console.log(`Future instances start from: ${startDate.toISOString().split('T')[0]}`)
          
          // Generate future instances using the clean original task
          const futureInstances = generateRecurringInstances(originalTask, startDate, endDate)
          
          // Store updates for future instances only
          const updates = []
          futureInstances.forEach(instance => {
            if (instance.isInstance) {
              const instanceDate = instance.date.split('T')[0]
              const updateKey = `task_update_${taskToUpdate.originalTaskId}_${instanceDate}`
              updates.push({ key: updateKey, data: updatedPendingData })
            }
          })
          
          if (updates.length > 0) {
            await batchUpdateRecurringData(updates)
          }
        }
      } else {
        // For "only current task", store the updated data for this specific instance
        const updateKey = `task_update_${taskToUpdate.originalTaskId}_${currentDate}`
        await updateRecurringData(updateKey, updatedPendingData)
        console.log(`Updated current instance only via Firestore override`)
      }

      // Close modals and reset state
      setIsUpdateModalOpen(false)
      setIsModalOpen(false)
      setTaskToUpdate(null)
      setPendingTaskData(null)
      setSelectedTask(null)
    } catch (error) {
      console.error('Error updating task:', error)
      // You might want to show an error message to the user here
    }
  }

  const handleUpdateCancel = () => {
    setIsUpdateModalOpen(false)
    setTaskToUpdate(null)
    setPendingTaskData(null)
  }

  const handleDeleteTask = async (taskId, deletionScope = 'current') => {
    try {
      // Look for the task in both the original tasks array and filtered tasks
      let taskToDelete = tasks.find(task => task.id === taskId)
      if (!taskToDelete) {
        taskToDelete = filteredTasks.find(task => task.id === taskId)
      }
      
      if (!taskToDelete) return
      
      if (taskToDelete.isRecurring || taskToDelete.isInstance) {
        // Handle recurring task deletion based on scope
        if (deletionScope === 'current') {
          if (taskToDelete.isInstance) {
            // For recurring instances, we need to delete the original task
            // and regenerate instances without this specific instance
            const originalId = taskToDelete.originalTaskId
            const originalTask = tasks.find(task => task.id === originalId)
            if (originalTask) {
              // Add a completion marker for this specific instance
              const completionKey = `task_deleted_${originalId}_${taskToDelete.date.split('T')[0]}`
              await updateRecurringData(completionKey, true)
            }
          } else {
            // For original recurring task, delete only the original
            await deleteTask(taskId)
          }
        } else if (deletionScope === 'all') {
          // Delete all instances (original + all generated instances)
          const originalId = taskToDelete.isInstance ? taskToDelete.originalTaskId : taskToDelete.id
          await deleteTask(originalId)
        } else if (deletionScope === 'currentAndFuture') {
          // Delete current and future instances
          if (taskToDelete.isInstance) {
            // Delete this instance and all future instances
            const originalId = taskToDelete.originalTaskId
            const originalTask = tasks.find(task => task.id === originalId)
            if (originalTask) {
              // Mark the current instance as deleted
              const deletionKey = `task_deleted_${originalId}_${taskToDelete.date.split('T')[0]}`
              await updateRecurringData(deletionKey, true)
              
              // Update the original task to end before the current date
              const updatedTask = {
                ...originalTask,
                recurringEndDate: new Date(taskToDelete.date).toISOString()
              }
              await updateTask(originalId, updatedTask)
            }
          } else {
            // Delete original and all future instances
            const currentDate = new Date()
            const updatedTask = {
              ...taskToDelete,
              recurringEndDate: currentDate.toISOString()
            }
            await updateTask(taskId, updatedTask)
          }
        }
      } else {
        // Regular task deletion
        await deleteTask(taskId)
      }
      
    setIsModalOpen(false)
    setSelectedTask(null)
    } catch (error) {
      console.error('Error deleting task:', error)
      // You might want to show an error message to the user here
    }
  }

  const handleDeleteClick = (taskId) => {
    // Look for the task in both the original tasks array and filtered tasks
    let task = tasks.find(t => t.id === taskId)
    if (!task) {
      task = filteredTasks.find(t => t.id === taskId)
    }
    setTaskToDelete(task)
    setIsDeleteModalOpen(true)
    setIsModalOpen(false) // Close the task modal
  }

  const handleDeleteConfirm = (taskId, deletionScope) => {
    handleDeleteTask(taskId, deletionScope)
    setIsDeleteModalOpen(false)
    setTaskToDelete(null)
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setTaskToDelete(null)
  }

  const handleToggleTask = async (taskId) => {
    try {
      // Check if this is a recurring task instance
      const taskToToggle = filteredTasks.find(task => task.id === taskId)
      
      if (taskToToggle && taskToToggle.isInstance) {
        // For recurring instances, we need to handle completion differently
        // We'll store completion status for specific instances
        const completionKey = `task_completion_${taskToToggle.originalTaskId}_${taskToToggle.date.split('T')[0]}`
        const completionData = recurringData[completionKey]
        const isCompleted = completionData?.value === true || completionData === true
        await updateRecurringData(completionKey, !isCompleted)
        
        // The useMemo will automatically recalculate filteredTasks when recurringData changes
      } else {
        // For regular tasks, update normally
        const task = tasks.find(t => t.id === taskId)
        if (task) {
          const newCompleted = !task.completed
          
          // If task has subtasks, check if all subtasks are completed
          if (task.subtasks && task.subtasks.length > 0) {
            const allSubtasksCompleted = task.subtasks.every(subtask => subtask.completed)
            // Auto-complete if all subtasks are done, otherwise use manual toggle
            await updateTask(taskId, { completed: allSubtasksCompleted || newCompleted })
          } else {
            await updateTask(taskId, { completed: newCompleted })
          }
        }
      }
    } catch (error) {
      console.error('Error toggling task:', error)
      // You might want to show an error message to the user here
    }
  }

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate)
  }

  const handleViewChange = async (newView) => {
    await updateSettings({ view: newView })
  }

  const handleToggleDarkMode = async () => {
    await updateSettings({ darkMode: !settings.darkMode })
  }

  const handleToggleTimeSlot = async (hour) => {
    const newHiddenTimeSlots = settings.hiddenTimeSlots?.includes(hour) 
      ? settings.hiddenTimeSlots.filter(h => h !== hour)
      : [...(settings.hiddenTimeSlots || []), hour]
    await updateSettings({ hiddenTimeSlots: newHiddenTimeSlots })
  }

  const handleDayStartHourChange = async (hour) => {
    await updateSettings({ dayStartHour: hour })
  }

  const handleToggleFocusMode = async () => {
    await updateSettings({ focusMode: !settings.focusMode })
  }

  const handleTaskSizeChange = async (size) => {
    await updateSettings({ taskSize: size })
  }

  const handleExportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `calendar-tasks-${format(new Date(), 'yyyy-MM-dd')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportTasks = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const importedTasks = JSON.parse(e.target.result)
        if (Array.isArray(importedTasks)) {
          if (window.confirm(`Import ${importedTasks.length} tasks? This will replace your current tasks.`)) {
            // Clear existing tasks and add imported ones
            const updates = []
            tasks.forEach(task => {
              updates.push({ taskId: task.id, data: null }) // null means delete
            })
            if (updates.length > 0) {
              await batchUpdateTasks(updates)
            }
            
            // Add imported tasks
            for (const task of importedTasks) {
              await addTask(task)
            }
          }
        } else {
          alert('Invalid file format. Please select a valid JSON file.')
        }
      } catch (error) {
        alert('Error reading file. Please make sure it\'s a valid JSON file.')
      }
    }
    reader.readAsText(file)
    event.target.value = '' // Reset file input
  }

  // Get tasks for the current view's date range
  const getTasksForCurrentView = () => {
    try {
      let startDate, endDate
      
      switch (settings.view || 'week') {
        case 'month':
          startDate = startOfMonth(currentDate)
          endDate = endOfMonth(currentDate)
          break
        case 'week':
          startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
          endDate = endOfWeek(currentDate, { weekStartsOn: 1 })
          break
        case 'day':
          startDate = startOfDay(currentDate)
          endDate = endOfDay(currentDate)
          break
        default:
          startDate = startOfMonth(currentDate)
          endDate = endOfMonth(currentDate)
      }
      
      return getAllTasksForDateRange(tasks, startDate, endDate, recurringData)
    } catch (error) {
      console.error('Error in getTasksForCurrentView:', error)
      return tasks || []
    }
  }

  // Get tasks for current view (includes recurring task generation)
  const filteredTasks = useMemo(() => {
    return getTasksForCurrentView()
  }, [tasks, currentDate, settings.view, recurringData])

  // Show loading state while Firebase is initializing
  if (tasksLoading || settingsLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your calendar...</p>
      </div>
    )
  }

  // Show authentication if user is not logged in
  if (!currentUser) {
    return <Auth />
  }

  // Show migration modal if needed
  if (showMigrationModal) {
    return (
      <MigrationModal 
        isOpen={showMigrationModal}
        onClose={() => setShowMigrationModal(false)}
        onComplete={handleMigrationComplete}
      />
    )
  }

  return (
    <div className={`App ${settings.darkMode ? 'dark-mode' : ''}`}>
      <Navigation />
      <Calendar
        currentDate={currentDate}
        view={settings.view || 'week'}
        tasks={filteredTasks}
        onDateChange={handleDateChange}
        onViewChange={handleViewChange}
        onTaskClick={handleEditTask}
        onToggleTask={handleToggleTask}
        onAddTask={handleAddTask}
        isDarkMode={settings.darkMode || false}
        onToggleDarkMode={handleToggleDarkMode}
        hiddenTimeSlots={settings.hiddenTimeSlots || []}
        onToggleTimeSlot={handleToggleTimeSlot}
        dayStartHour={settings.dayStartHour || 8}
        onDayStartHourChange={handleDayStartHourChange}
        focusMode={settings.focusMode || false}
        onToggleFocusMode={handleToggleFocusMode}
        taskSize={settings.taskSize || 'small'}
        onTaskSizeChange={handleTaskSizeChange}
        isTodayIST={isTodayIST}
      />
      

      {isModalOpen && (
        <TaskModal
          task={selectedTask}
          onSave={handleSaveTask}
          onDelete={handleDeleteClick}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedTask(null)
          }}
        />
      )}
      
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          task={taskToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
      
      {isUpdateModalOpen && (
        <>
          {console.log(`Rendering UpdateConfirmationModal for task: ${taskToUpdate?.id}`)}
          <UpdateConfirmationModal
            task={taskToUpdate}
            onConfirm={handleUpdateConfirm}
            onCancel={handleUpdateCancel}
          />
        </>
      )}
    </div>
  )
}

export default CalendarApp