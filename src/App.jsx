import { useState, useEffect, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import LocationList from './components/locations/LocationList'
import LocationForm from './components/locations/LocationForm'
import TransportationList from './components/transportations/TransportationList'
import TransportationForm from './components/transportations/TransportationForm'
import RouteList from './components/routes/RouteList'

function App() {
  const locationListRef = useRef()
  const transportationListRef = useRef()
  
  const [activeTab, setActiveTab] = useState('locations')
  const [theme, setTheme] = useState('dark')
  const [showLocationForm, setShowLocationForm] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [showTransportationForm, setShowTransportationForm] = useState(false)
  const [selectedTransportation, setSelectedTransportation] = useState(null)

  const tabs = [
    { id: 'locations', label: 'Locations' },
    { id: 'transportations', label: 'Transportations' },
    { id: 'routes', label: 'Routes' }
  ]

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  const handleLocationEdit = (location) => {
    setSelectedLocation(location)
    setShowLocationForm(true)
  }

  const handleLocationFormClose = () => {
    setSelectedLocation(null)
    setShowLocationForm(false)
  }

  const handleTransportationEdit = (transportation) => {
    setSelectedTransportation(transportation)
    setShowTransportationForm(true)
  }

  const handleTransportationFormClose = () => {
    setSelectedTransportation(null)
    setShowTransportationForm(false)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'locations':
        return (
          <>
            <div className="content-header">
              <h2>Locations</h2>
              <button 
                className="add-button"
                onClick={() => setShowLocationForm(true)}
              >
                Add Location
              </button>
            </div>
            <LocationList 
              ref={locationListRef} 
              onEdit={handleLocationEdit} 
            />
            {showLocationForm && (
              <LocationForm 
                location={selectedLocation}
                onClose={handleLocationFormClose}
                onSuccess={() => {
                  handleLocationFormClose()
                  locationListRef.current?.fetchLocations()
                }}
              />
            )}
          </>
        )
      case 'transportations':
        return (
          <>
            <div className="content-header">
              <h2>Transportations</h2>
              <button 
                className="add-button"
                onClick={() => setShowTransportationForm(true)}
              >
                Add Transportation
              </button>
            </div>
            <TransportationList 
              ref={transportationListRef}
              onEdit={handleTransportationEdit} 
            />
            {showTransportationForm && (
              <TransportationForm 
                transportation={selectedTransportation}
                onClose={handleTransportationFormClose}
                onSuccess={() => {
                  handleTransportationFormClose()
                  transportationListRef.current?.fetchTransportations()
                }}
              />
            )}
          </>
        )
      case 'routes':
        return (
          <>
            <div className="content-header">
              <h2>Routes</h2>
            </div>
            <RouteList />
          </>
        )
      default:
        return null
    }
  }

  return (
    <>
      <header className="header-strip">
        <h2 className="header-title">Case Study UI</h2>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>
      <div className="layout">
        <aside className="sidebar">
          <nav className="sidebar-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>
        <main className="content">
          {renderContent()}
        </main>
      </div>
      <ToastContainer />
    </>
  )
}

export default App
