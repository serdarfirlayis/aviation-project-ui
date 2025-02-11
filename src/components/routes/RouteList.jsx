import { useState, useEffect } from 'react'
import './Routes.css'
import { toast } from 'react-toastify'
import RouteDetail from './RouteDetail'

function RouteList() {
  const [locations, setLocations] = useState([])
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    originId: '',
    destinationId: ''
  })
  const [selectedRoute, setSelectedRoute] = useState(null)

  useEffect(() => {
    fetchLocations()
  }, [])

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

  const handleSearch = async (e) => {
    e.preventDefault()
    if (formData.originId === formData.destinationId) {
      toast.error('Origin and destination cannot be the same')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/routes/${formData.originId}/${formData.destinationId}`)
      const result = await response.json()
      if (result.success) {
        setRoutes(result.data)
        if (result.data.length === 0) {
          toast.info('No routes found')
        }
      } else {
        toast.error(result.message || 'Failed to fetch routes')
      }
    } catch (err) {
      toast.error('Failed to fetch routes')
    } finally {
      setLoading(false)
    }
  }

  const formatRoute = (route) => {
    console.log('Route data:', route)
    
    if (!Array.isArray(route)) {
      console.error('Route is not an array:', route)
      return 'Invalid route data'
    }

    const flightTransportation = route.find(t => t.type === 'FLIGHT')
    console.log('Flight transportation:', flightTransportation)

    if (!flightTransportation) {
      return 'No flight route available'
    }

    if (!flightTransportation.destinationName) {
      console.error('No destination name in flight:', flightTransportation)
      return `Via ${flightTransportation.destination?.name || 'Unknown'}`
    }

    return `Via ${flightTransportation.destinationName}`
  }

  const handleRouteClick = (route) => {
    setSelectedRoute(route)
  }

  return (
    <div className="route-container">
      <form onSubmit={handleSearch} className="route-form">
        <div className="form-row">
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
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {routes.length > 0 && (
        <div className="routes-list">
          <h3>Available Routes</h3>
          <div className="routes">
            {routes.map((route, index) => (
              <div 
                key={index} 
                className="route-item"
                onClick={() => handleRouteClick(route)}
              >
                {formatRoute(route)}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedRoute && (
        <RouteDetail 
          route={selectedRoute} 
          onClose={() => setSelectedRoute(null)} 
        />
      )}
    </div>
  )
}

export default RouteList 