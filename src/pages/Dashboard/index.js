import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import './index.scss'
import video from '../../assets/video/main_bg.mp4'

const Dashboard = () => {
  return (
    <>
      <div className="video_main_container">
        <div className="video_container">
          <video src={video} autoPlay={true} muted={true} loop={true}></video>
        </div>
      </div>
    </>
  )
}

export default Dashboard
