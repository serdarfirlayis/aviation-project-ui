import React from 'react'
import './Routes.css'

function RouteDetail({ route, onClose }) {
  return (
    <div className="route-detail-overlay">
      <div className="route-detail-panel">
        <div className="route-detail-header">
          <h3>Route Details</h3>
          <button className="close-button" onClick={onClose}>Close</button>
        </div>
        <div className="route-path">
          {route.map((transportation, index) => (
            <React.Fragment key={index}>
              <div className="route-node">
                {index === 0 && <div className="location-name">{transportation.origin.name}</div>}
                <div className="node-circle"></div>
                <div className="location-name">{transportation.destination.name}</div>
              </div>
              {index < route.length - 1 && (
                <div className="route-connection">
                  <div className="transportation-type">{transportation.type}</div>
                  <div className="connection-line"></div>
                </div>
              )}
              {index === route.length - 1 && (
                <div className="transportation-type last">{transportation.type}</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RouteDetail 