import { useState, useEffect } from 'react'
import './Transportations.css'
import { toast } from 'react-toastify'

function TransportationForm({ transportation, onClose, onSuccess }) {
  const [locations, setLocations] = useState([])
  const [formData, setFormData] = useState({
    originId: '',
    destinationId: '',
    type: 'FLIGHT' // Varsayılan tip güncellendi
  })

  useEffect(() => {
    fetchLocations()
  }, [])

  useEffect(() => {
    if (transportation && locations.length > 0) {
      setFormData({
        originId: locations.find(location => location.name === transportation.originName)?.id || '',
        destinationId: locations.find(location => location.name === transportation.destinationName)?.id || '',
        type: transportation.type || 'FLIGHT'
      })
    }
  }, [transportation, locations])

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations')
      const result = await response.json()
      if (result.success) {
        setLocations(result.data)
      }
    } catch (err) {
      toast.error('Failed to fetch locations')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = transportation 
        ? `/api/transportations/${transportation.id}`
        : '/api/transportations'
      
      const response = await fetch(url, {
        method: transportation ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          originId: formData.originId,
          destinationId: formData.destinationId,
          type: formData.type
        })
      })

      const result = await response.json()
      if (result.success) {
        toast.success(transportation ? 'Transportation updated successfully' : 'Transportation created successfully')
        onSuccess()
      } else {
        toast.error(result.message || 'Failed to save transportation')
      }
    } catch (err) {
      toast.error('Failed to save transportation')
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{transportation ? 'Edit Transportation' : 'Add Transportation'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Origin Location:</label>
            <select
              value={formData.originId}
              onChange={e => setFormData({...formData, originId: e.target.value})}
              required
            >
              <option value="">Select Origin</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Destination Location:</label>
            <select
              value={formData.destinationId}
              onChange={e => setFormData({...formData, destinationId: e.target.value})}
              required
            >
              <option value="">Select Destination</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Type:</label>
            <select
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
              required
            >
              <option value="FLIGHT">Flight</option>
              <option value="BUS">Bus</option>
              <option value="SUBWAY">Subway</option>
              <option value="UBER">Uber</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-button">
              {transportation ? 'Update' : 'Create'}
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransportationForm 