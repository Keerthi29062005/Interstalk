import React, { useState, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useLocation } from 'react-router-dom';

export default function Profile() {
  const { Roll_no,Name } = useLocation().state || {}; // Getting name and rollNo from the location state
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [nameState, setNameState] = useState(Name || "Add your name...");
  const [about, setAbout] = useState('Add something about yourself...');
  
  const videoRef = useRef(null); // Ref for the video element
  const canvasRef = useRef(null); // Ref for the canvas element

  const handleNameSave = (event) => {
    setNameState(event.target.value);
    setIsEditingName(false);
  };

  const handleAboutSave = (event) => {
    setAbout(event.target.value);
    setIsEditingAbout(false);
  };

  const handleCameraClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setAnchorEl(null);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '20px' }}>
        <div style={{ position: 'relative', width: 300, height: 300, marginBottom: '50px' }}>
          <Avatar 
            alt="Profile Picture" 
            src={avatarSrc || '/static/images/avatar/1.jpg'} 
            sx={{ width: '100%', height: '100%', fontSize: 150 }} 
          >{Name.charAt(0).toUpperCase()}</Avatar>
          <div 
            style={{
              position: 'absolute', 
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              top: '90%', 
              left: '75%', 
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgb(0, 112, 209)', 
              height: 100, 
              width: 100, 
              opacity: 1,
              borderRadius: '50%',
              cursor: 'pointer'
            }}
            onClick={handleCameraClick}
          >
            <CameraAltIcon style={{ height: 70, width: 70, color: 'rgb(223, 229, 234)' }} />
          </div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => console.log("Camera opened")} style={{ fontSize: 30 }}>Open Camera</MenuItem>
            <MenuItem style={{ fontSize: 30 }}>
              <label htmlFor="upload-photo" style={{ cursor: 'pointer', width: '100%' }}>
                Upload Photo
              </label>
              <input 
                id="upload-photo" 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
              />
            </MenuItem>
          </Menu>
        </div>

        {/* Editable Name and About Sections */}
        <div style={{ backgroundColor: 'rgb(223, 223, 223)', height: 200, width: '100%', marginBottom: '20px', position: 'relative' }}>
          <p style={{ fontSize: 30, marginLeft: 30, marginBottom: 50 }}>Your name</p>
          {isEditingName ? (
            <TextField 
              variant="standard" 
              defaultValue={nameState} 
              onBlur={handleNameSave} 
              autoFocus 
              style={{ marginLeft: 30, fontSize: 100, width: 'calc(100% - 60px)' }}
            />
          ) : (
            <p style={{ fontSize: 30, marginLeft: 30 }}>{nameState}</p>
          )}
          <EditIcon 
            onClick={() => setIsEditingName(true)} 
            style={{ position: 'absolute', top: 100, right: 20, cursor: 'pointer', height: 40, width: 40 }} 
          />
        </div>

        <div style={{ backgroundColor: 'rgb(223, 223, 223)', height: 200, width: '100%', position: 'relative' }}>
          <p style={{ fontSize: 30, marginLeft: 30, marginBottom: 50 }}>About</p>
          {isEditingAbout ? (
            <TextField 
              variant="standard" 
              defaultValue={about} 
              onBlur={handleAboutSave} 
              autoFocus 
              multiline
              style={{ marginLeft: 30, fontSize: 30, width: 'calc(100% - 60px)' }}
            />
          ) : (
            <p style={{ fontSize: 30, marginLeft: 30 }}>{about}</p>
          )}
          <EditIcon 
            onClick={() => setIsEditingAbout(true)} 
            style={{ position: 'absolute', top: 100, right: 20, cursor: 'pointer', height: 40, width: 40 }} 
          />
        </div>
      </div>
    </>
  );
}
