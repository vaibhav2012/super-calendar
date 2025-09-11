import { 
  addDays, 
  addWeeks, 
  addMonths, 
  addYears, 
  isBefore, 
  isAfter, 
  isSameDay,
  startOfDay,
  endOfDay,
  getDay,
  getDate,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  setDay,
  setDate
} from 'date-fns'

/**
 * Get the next occurrence for weekly recurrence with specific days
 * @param {Date} currentDate - Current date
 * @param {Array} weeklyDays - Array of day numbers (0=Sunday, 1=Monday, etc.)
 * @param {number} interval - Interval in weeks
 * @returns {Date} Next occurrence date
 */
const getNextWeeklyOccurrence = (currentDate, weeklyDays, interval) => {
  if (weeklyDays.length === 0) {
    return addWeeks(currentDate, interval)
  }

  const currentDay = getDay(currentDate)
  const sortedDays = [...weeklyDays].sort((a, b) => a - b)
  
  // Find next day in current week
  for (const day of sortedDays) {
    if (day > currentDay) {
      return addDays(currentDate, day - currentDay)
    }
  }
  
  // If no day found in current week, go to next interval week
  const nextWeekStart = addWeeks(currentDate, interval)
  const nextWeekDay = sortedDays[0]
  return addDays(nextWeekStart, nextWeekDay - getDay(nextWeekStart))
}

/**
 * Generate all weekly occurrences for a given week
 * @param {Date} weekStart - Start of the week
 * @param {Array} weeklyDays - Array of day numbers
 * @returns {Array} Array of dates for the week
 */
const getWeeklyOccurrencesForWeek = (weekStart, weeklyDays) => {
  if (!weeklyDays || weeklyDays.length === 0) {
    return [weekStart]
  }
  
  try {
    return weeklyDays.map(day => {
      // Convert to Sunday-based week (0=Sunday, 1=Monday, etc.)
      const sundayBasedDay = day === 0 ? 0 : day
      const currentDayOfWeek = getDay(weekStart) // 0=Sunday, 1=Monday, etc.
      const daysToAdd = sundayBasedDay >= currentDayOfWeek 
        ? sundayBasedDay - currentDayOfWeek 
        : (7 - currentDayOfWeek) + sundayBasedDay
      return addDays(weekStart, daysToAdd)
    }).sort((a, b) => a - b)
  } catch (error) {
    console.error('Error in getWeeklyOccurrencesForWeek:', error)
    return [weekStart]
  }
}

/**
 * Get the next occurrence for monthly recurrence
 * @param {Date} currentDate - Current date
 * @param {Object} monthlyOptions - Monthly recurrence options
 * @param {number} interval - Interval in months
 * @returns {Date} Next occurrence date
 */
const getNextMonthlyOccurrence = (currentDate, monthlyOptions, interval) => {
  const { monthlyType, monthlyDay, monthlyWeekday, monthlyWeek } = monthlyOptions
  
  if (monthlyType === 'dayOfMonth') {
    // Simple day of month recurrence
    const nextMonth = addMonths(currentDate, interval)
    const lastDayOfMonth = getDate(endOfMonth(nextMonth))
    const targetDay = Math.min(monthlyDay, lastDayOfMonth)
    return setDate(nextMonth, targetDay)
  } else {
    // Day of week recurrence (e.g., "First Monday", "Last Friday")
    const nextMonth = addMonths(currentDate, interval)
    const monthStart = startOfMonth(nextMonth)
    const monthEnd = endOfMonth(nextMonth)
    
    if (monthlyWeek === -1) {
      // Last occurrence of the day in the month
      let lastOccurrence = monthEnd
      while (getDay(lastOccurrence) !== monthlyWeekday) {
        lastOccurrence = addDays(lastOccurrence, -1)
      }
      return lastOccurrence
    } else {
      // Nth occurrence of the day in the month
      let occurrence = monthStart
      let count = 0
      
      // Find the first occurrence of the target day
      while (getDay(occurrence) !== monthlyWeekday) {
        occurrence = addDays(occurrence, 1)
      }
      
      // Count occurrences until we reach the desired one
      while (count < monthlyWeek && occurrence <= monthEnd) {
        if (getDay(occurrence) === monthlyWeekday) {
          count++
          if (count === monthlyWeek) {
            return occurrence
          }
        }
        occurrence = addDays(occurrence, 7)
      }
      
      // If not found in this month, try next month
      return getNextMonthlyOccurrence(addMonths(nextMonth, 1), monthlyOptions, 0)
    }
  }
}

/**
 * Generate recurring task instances based on the original task
 * @param {Object} originalTask - The original recurring task
 * @param {Date} startDate - Start date for generating instances
 * @param {Date} endDate - End date for generating instances
 * @param {Object} recurringData - Firestore recurring data object
 * @returns {Array} Array of task instances
 */
export const generateRecurringInstances = (originalTask, startDate, endDate, recurringData = {}) => {
  try {
    if (!originalTask || !originalTask.isRecurring) {
      return [originalTask]
    }

    const instances = []
    const originalDate = new Date(originalTask.date)
    const originalTime = originalTask.time
    
    // Calculate the end condition
    const hasEndDate = originalTask.recurringEndDate
    const hasEndAfter = originalTask.recurringEndAfter && parseInt(originalTask.recurringEndAfter) > 0
    
    let currentDate = new Date(originalDate)
    let occurrenceCount = 0
    const maxOccurrences = hasEndAfter ? parseInt(originalTask.recurringEndAfter) : Infinity
    const endDateLimit = hasEndDate ? new Date(originalTask.recurringEndDate) : endDate

  // Generate instances
  if (originalTask.recurringType === 'weekly' && originalTask.weeklyDays && originalTask.weeklyDays.length > 0) {
    // Special handling for weekly with multiple days
    let weekStart = startOfWeek(originalDate, { weekStartsOn: 1 })
    
    while (weekStart <= endDateLimit && occurrenceCount < maxOccurrences) {
      const weekOccurrences = getWeeklyOccurrencesForWeek(weekStart, originalTask.weeklyDays)
      
      for (const occurrenceDate of weekOccurrences) {
        if (occurrenceDate >= startDate && occurrenceDate <= endDate && occurrenceDate <= endDateLimit) {
          const dateKey = occurrenceDate.toISOString().split('T')[0]
          
          
          const completionKey = `task_completion_${originalTask.id}_${dateKey}`
          const completionData = recurringData[completionKey]
          const isCompleted = completionData?.value === true || completionData === true
          
          // Check for global updates first (applies to all instances)
          let instanceData = { ...originalTask }
          const globalUpdateKey = `task_global_update_${originalTask.id}`
          const globalUpdateData = recurringData[globalUpdateKey]
          console.log(`Checking for global update: ${globalUpdateKey}, found: ${!!globalUpdateData}`)
          if (globalUpdateData) {
            instanceData = { ...instanceData, ...globalUpdateData }
            console.log(`Applied global update for ${dateKey}: ${globalUpdateKey}`, globalUpdateData)
          }
          
          // Check for instance-specific updates (overrides global updates)
          const updateKey = `task_update_${originalTask.id}_${dateKey}`
          const updateData = recurringData[updateKey]
          if (updateData) {
            instanceData = { ...instanceData, ...updateData }
            console.log(`Applied instance update for ${dateKey}: ${updateKey}`)
          }
          
          // Check if all subtasks are completed and auto-complete the task
          let finalCompleted = isCompleted
          if (instanceData.subtasks && instanceData.subtasks.length > 0) {
            const allSubtasksCompleted = instanceData.subtasks.every(subtask => subtask.completed)
            if (allSubtasksCompleted && !isCompleted) {
              // Only auto-complete if this is a global update (all tasks) or instance-specific update
              const hasGlobalUpdate = !!recurringData[`task_global_update_${originalTask.id}`]
              const hasInstanceSpecificUpdate = !!recurringData[`task_update_${originalTask.id}_${dateKey}`]
              
              if (hasGlobalUpdate || hasInstanceSpecificUpdate) {
                finalCompleted = true
              }
            }
          }

          const instance = {
            ...instanceData,
            id: `${originalTask.id}_${dateKey}`,
            date: occurrenceDate.toISOString(),
            originalTaskId: originalTask.id,
            isInstance: true,
            completed: finalCompleted
          }
        console.log(`Generated instance for ${dateKey}: ${instance.id}`, {
          title: instance.title,
          color: instance.color,
          time: instance.time,
          hasGlobalUpdate: !!recurringData[`task_global_update_${originalTask.id}`]
        })
        instances.push(instance)
        }
      }
      
      occurrenceCount++
      weekStart = addWeeks(weekStart, originalTask.recurringInterval || 1)
    }
  } else {
    // Standard handling for other recurrence types
    while (currentDate <= endDateLimit && occurrenceCount < maxOccurrences) {
      // Only include instances within our date range
      if (currentDate >= startDate && currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split('T')[0]
        
        
        const completionKey = `task_completion_${originalTask.id}_${dateKey}`
        const completionData = recurringData[completionKey]
        const isCompleted = completionData?.value === true || completionData === true
        
        // Check for global updates first (applies to all instances)
        let instanceData = { ...originalTask }
        const globalUpdateKey = `task_global_update_${originalTask.id}`
        const globalUpdateData = recurringData[globalUpdateKey]
        console.log(`Checking for global update: ${globalUpdateKey}, found: ${!!globalUpdateData}`)
        if (globalUpdateData) {
          instanceData = { ...instanceData, ...globalUpdateData }
          console.log(`Applied global update for ${dateKey}: ${globalUpdateKey}`, globalUpdateData)
        }
        
        // Check for instance-specific updates (overrides global updates)
        const updateKey = `task_update_${originalTask.id}_${dateKey}`
        const updateData = recurringData[updateKey]
        if (updateData) {
          instanceData = { ...instanceData, ...updateData }
          console.log(`Applied instance update for ${dateKey}: ${updateKey}`)
        }
        
        // Check if all subtasks are completed and auto-complete the task
        let finalCompleted = isCompleted
        if (instanceData.subtasks && instanceData.subtasks.length > 0) {
          const allSubtasksCompleted = instanceData.subtasks.every(subtask => subtask.completed)
            if (allSubtasksCompleted && !isCompleted) {
              // Only auto-complete if this is a global update (all tasks) or instance-specific update
              const hasGlobalUpdate = !!recurringData[`task_global_update_${originalTask.id}`]
              const hasInstanceSpecificUpdate = !!recurringData[`task_update_${originalTask.id}_${dateKey}`]
              
              if (hasGlobalUpdate || hasInstanceSpecificUpdate) {
                finalCompleted = true
              }
            }
        }

        const instance = {
          ...instanceData,
          id: `${originalTask.id}_${dateKey}`,
          date: currentDate.toISOString(),
          originalTaskId: originalTask.id,
          isInstance: true,
          completed: finalCompleted
        }
        console.log(`Generated instance for ${dateKey}: ${instance.id}`, {
          title: instance.title,
          color: instance.color,
          time: instance.time,
          hasGlobalUpdate: !!recurringData[`task_global_update_${originalTask.id}`]
        })
        instances.push(instance)
      }
      
      occurrenceCount++
      
      // Calculate next occurrence
      switch (originalTask.recurringType) {
        case 'daily':
          currentDate = addDays(currentDate, originalTask.recurringInterval || 1)
          break
        case 'weekly':
          currentDate = getNextWeeklyOccurrence(
            currentDate, 
            originalTask.weeklyDays || [], 
            originalTask.recurringInterval || 1
          )
          break
        case 'monthly':
          currentDate = getNextMonthlyOccurrence(
            currentDate,
            {
              monthlyType: originalTask.monthlyType || 'dayOfMonth',
              monthlyDay: originalTask.monthlyDay || 1,
              monthlyWeekday: originalTask.monthlyWeekday || 1,
              monthlyWeek: originalTask.monthlyWeek || 1
            },
            originalTask.recurringInterval || 1
          )
          break
        case 'yearly':
          currentDate = addYears(currentDate, originalTask.recurringInterval || 1)
          break
        default:
          currentDate = addDays(currentDate, 1)
      }
    }
  }

  return instances
  } catch (error) {
    console.error('Error in generateRecurringInstances:', error)
    return [originalTask]
  }
}

/**
 * Get all tasks (including recurring instances) for a given date range
 * @param {Array} tasks - Array of all tasks
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Object} recurringData - Firestore recurring data object
 * @returns {Array} Array of all tasks and instances for the date range
 */
export const getAllTasksForDateRange = (tasks, startDate, endDate, recurringData = {}) => {
  try {
    const allTasks = []
    
    if (!tasks || !Array.isArray(tasks)) {
      return allTasks
    }
    
    tasks.forEach(task => {
      if (task && task.isRecurring) {
        const instances = generateRecurringInstances(task, startDate, endDate, recurringData)
        // Filter out deleted instances
        const filteredInstances = instances.filter(instance => {
          if (instance.isInstance) {
            const deletionKey = `task_deleted_${instance.originalTaskId}_${instance.date.split('T')[0]}`
            const isDeleted = recurringData[deletionKey] === true
            if (isDeleted) {
              console.log(`Filtered out deleted instance: ${instance.id} (${deletionKey})`)
            }
            return !isDeleted
          }
          return true
        })
        console.log(`Task ${task.id}: Generated ${instances.length} instances, filtered to ${filteredInstances.length}`)
        allTasks.push(...filteredInstances)
      } else if (task) {
        // Check if non-recurring task falls within date range
        const taskDate = new Date(task.date)
        if (taskDate >= startDate && taskDate <= endDate) {
          allTasks.push(task)
        }
      }
    })
    
    return allTasks
  } catch (error) {
    console.error('Error in getAllTasksForDateRange:', error)
    return []
  }
}

/**
 * Get tasks for a specific day (including recurring instances)
 * @param {Array} tasks - Array of all tasks
 * @param {Date} targetDate - The target date
 * @returns {Array} Array of tasks for the specific day
 */
export const getTasksForDay = (tasks, targetDate) => {
  const startOfTargetDay = startOfDay(targetDate)
  const endOfTargetDay = endOfDay(targetDate)
  
  return getAllTasksForDateRange(tasks, startOfTargetDay, endOfTargetDay)
}

/**
 * Check if a task is a recurring task instance
 * @param {Object} task - The task to check
 * @returns {boolean} True if the task is a recurring instance
 */
export const isRecurringInstance = (task) => {
  return task.isInstance === true && task.originalTaskId
}

/**
 * Get the original recurring task from an instance
 * @param {Array} tasks - Array of all tasks
 * @param {Object} instance - The recurring task instance
 * @returns {Object|null} The original recurring task or null
 */
export const getOriginalRecurringTask = (tasks, instance) => {
  if (!isRecurringInstance(instance)) {
    return null
  }
  
  return tasks.find(task => task.id === instance.originalTaskId)
}
