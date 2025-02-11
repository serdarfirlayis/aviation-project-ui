import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import './Transportations.css'
import { toast } from 'react-toastify'

const TransportationList = forwardRef(({ onEdit }, ref) => {
  const [transportations, setTransportations] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTransportations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/transportations')
      const result = await response.json()
      if (result.success) {
        setTransportations(result.data)
      } else {
        toast.error(result.message || 'Failed to fetch transportations')
      }
    } catch (err) {
      toast.error('Failed to fetch transportations: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    fetchTransportations
  }))

  useEffect(() => {
    fetchTransportations()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transportation?')) {
      try {
        const response = await fetch(`/api/transportations/${id}`, {
          method: 'DELETE'
        })
        const result = await response.json()
        if (result.success) {
          toast.success('Transportation deleted successfully')
          fetchTransportations()
        } else {
          toast.error(result.message || 'Failed to delete transportation')
        }
      } catch (err) {
        toast.error('Failed to delete transportation')
      }
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="transportation-list">
      {transportations.length === 0 ? (
        <div className="no-data">No transportations found</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Origin</th>
              <th>Destination</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transportations.map(transportation => (
              <tr key={transportation.id}>
                <td>{transportation.originName || 'N/A'}</td>
                <td>{transportation.destinationName || 'N/A'}</td>
                <td>{transportation.type}</td>
                <td>
                  <button 
                    className="edit-button"
                    onClick={() => onEdit(transportation)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(transportation.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
})

export default TransportationList 