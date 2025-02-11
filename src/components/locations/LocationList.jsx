import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import './Locations.css'
import { toast } from 'react-toastify'

const LocationList = forwardRef(({ onEdit }, ref) => {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations')
      const result = await response.json()
      if (result.success) {
        setLocations(result.data)
      } else {
        toast.error(result.message || 'Failed to fetch locations')
      }
    } catch (err) {
      toast.error('Failed to fetch locations')
    } finally {
      setLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    fetchLocations
  }))

  useEffect(() => {
    fetchLocations()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        const response = await fetch(`/api/locations/${id}`, {
          method: 'DELETE'
        })
        const result = await response.json()
        if (result.success) {
          toast.success('Location deleted successfully')
          fetchLocations()
        } else {
          toast.error(result.message || 'Failed to delete location')
        }
      } catch (err) {
        toast.error('Failed to delete location')
      }
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="location-list">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>City</th>
            <th>Location Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map(location => (
            <tr key={location.id}>
              <td>{location.name}</td>
              <td>{location.country}</td>
              <td>{location.city}</td>
              <td>{location.locationCode}</td>
              <td>
                <button 
                  className="edit-button"
                  onClick={() => onEdit(location)}
                >
                  Edit
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(location.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

export default LocationList 