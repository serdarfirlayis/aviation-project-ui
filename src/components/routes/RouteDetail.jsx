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
          {route.routeDetail.stations.map((station, index) => (
            <React.Fragment key={index}>
              <div className="route-node">
                <div className="node-circle"></div>
                <div className="location-name">{station}</div>
              </div>
              {index < route.routeDetail.stations.length - 1 && (
                <div className="route-connection">
                  <div className="connection-line"></div>
                  <div className="transportation-type">{route.transportations[index].type}</div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RouteDetail 