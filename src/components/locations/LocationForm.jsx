import { useState, useEffect } from 'react'
import './Locations.css'
import { toast } from 'react-toastify'

function LocationForm({ location, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    city: '',
    locationCode: ''
  })

  useEffect(() => {
    if (location) {
      setFormData(location)
    }
  }, [location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = location 
        ? `/api/locations/${location.id}`
        : '/api/locations'
      
      const response = await fetch(url, {
        method: location ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      if (result.success) {
        toast.success(location ? 'Location updated successfully' : 'Location created successfully')
        onSuccess()
      } else {
        toast.error(result.message || 'Failed to save location')
      }
    } catch (err) {
      toast.error('Failed to save location')
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{location ? 'Edit Location' : 'Add Location'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Country:</label>
            <input
              type="text"
              value={formData.country}
              onChange={e => setFormData({...formData, country: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>City:</label>
            <input
              type="text"
              value={formData.city}
              onChange={e => setFormData({...formData, city: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Location Code:</label>
            <input
              type="text"
              value={formData.locationCode}
              onChange={e => setFormData({...formData, locationCode: e.target.value})}
              required
              maxLength={10}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-button">
              {location ? 'Update' : 'Create'}
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

export default LocationForm 