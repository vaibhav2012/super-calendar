import React, { useState } from 'react'

const DeleteConfirmationModal = ({ task, onConfirm, onCancel }) => {
  const [deletionScope, setDeletionScope] = useState('current')

  const handleConfirm = () => {
    onConfirm(task.id, deletionScope)
  }

  const isRecurring = task && (task.isRecurring || task.isInstance)

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal delete-confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Delete Task</h2>
          <button className="close-button" onClick={onCancel}>
            ×
          </button>
        </div>
        
        <div className="modal-content">
          <p className="delete-warning">
            Are you sure you want to delete "{task?.title}"?
          </p>
          
          {isRecurring && (
            <div className="deletion-scope-section">
              <p className="scope-label">Choose deletion scope:</p>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="deletionScope"
                    value="current"
                    checked={deletionScope === 'current'}
                    onChange={(e) => setDeletionScope(e.target.value)}
                  />
                  <span className="radio-label">
                    <strong>This task only</strong>
                    <small>Delete only this specific instance</small>
                  </span>
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="deletionScope"
                    value="all"
                    checked={deletionScope === 'all'}
                    onChange={(e) => setDeletionScope(e.target.value)}
                  />
                  <span className="radio-label">
                    <strong>All tasks</strong>
                    <small>Delete all instances (past, current, and future)</small>
                  </span>
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="deletionScope"
                    value="currentAndFuture"
                    checked={deletionScope === 'currentAndFuture'}
                    onChange={(e) => setDeletionScope(e.target.value)}
                  />
                  <span className="radio-label">
                    <strong>Current & future tasks</strong>
                    <small>Delete this instance and all future instances</small>
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
            className="button button-danger"
            onClick={handleConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
