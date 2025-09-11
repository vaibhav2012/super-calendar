import React, { useState } from 'react'

const UpdateConfirmationModal = ({ task, onConfirm, onCancel }) => {
  const [updateScope, setUpdateScope] = useState('all')
  
  console.log(`UpdateConfirmationModal rendered for task: ${task?.id}, isRecurring: ${task && (task.isRecurring || task.isInstance)}`)

  const handleConfirm = () => {
    console.log(`UpdateConfirmationModal: Confirming update with scope: ${updateScope}`)
    onConfirm(updateScope)
  }

  const isRecurring = task && (task.isRecurring || task.isInstance)

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal update-confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Update Recurring Task</h2>
          <button className="close-button" onClick={onCancel}>
            ×
          </button>
        </div>
        
        <div className="modal-content">
          <p className="update-warning">
            How would you like to update "{task?.title}"?
          </p>
          
          {isRecurring && (
            <div className="update-scope-section">
              <p className="scope-label">Choose update scope:</p>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="updateScope"
                    value="current"
                    checked={updateScope === 'current'}
                    onChange={(e) => setUpdateScope(e.target.value)}
                  />
                  <span className="radio-label">
                    <strong>Only current task</strong>
                    <small>Update only this specific instance</small>
                  </span>
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="updateScope"
                    value="currentAndFuture"
                    checked={updateScope === 'currentAndFuture'}
                    onChange={(e) => setUpdateScope(e.target.value)}
                  />
                  <span className="radio-label">
                    <strong>Current & future tasks</strong>
                    <small>Update this instance and all future instances</small>
                  </span>
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="updateScope"
                    value="all"
                    checked={updateScope === 'all'}
                    onChange={(e) => setUpdateScope(e.target.value)}
                  />
                  <span className="radio-label">
                    <strong>All tasks</strong>
                    <small>Update all instances (past, current, and future)</small>
                  </span>
                </label>
              </div>
            </div>
          )}
          
        </div>
        
        <div className="modal-footer">
          <button
            type="button"
            className="button button-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="button button-primary"
            onClick={handleConfirm}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateConfirmationModal
