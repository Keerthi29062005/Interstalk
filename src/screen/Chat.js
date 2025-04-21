import React, { useState, useEffect } from 'react';
import socket from './socket';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import InputBase from '@mui/material/InputBase';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import Avatar from '@mui/material/Avatar';
import MicIcon from '@mui/icons-material/Mic';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import Picker from 'emoji-picker-react';
import Profile from './Profile';
import '../css/ChatBox.css';
import Chattingimg from '../images/chatting3.png';

const drawerWidth = 600;

const MainContent = styled(Box)(({ theme, drawerOpen }) => ({
  flexGrow: 1,
  width: '100px',
  marginLeft: '0',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  height: '50px',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(2, 2, 2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(6)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '25ch',
    },
  },
}));

export default function EnhancedNavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState('Chats');
  const [users, setUsers] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState({ id: '', Name: '' });
  const [message, setMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [allmessages, setallMessages] = useState([]);
  const [arrivalmsg, setarrivalmsg] = useState(null);
  const location = useLocation();
  const { Roll_no, Name, id } = location.state || {};

  // Fetch users when the Chats drawer is active
  useEffect(() => {
    if (drawerContent === 'Chats' || drawerContent === 'Community') {
      fetchUsers();
    }
  }, [drawerContent]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/checkuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await response.json();
      if (json.success) {
        setUsers(json.users);
      } else {
        console.error("Error fetching users:", json.message);
      }
    } catch (error) {
      console.error("Error in fetchUsers:", error);
    }
  };

  const handleDrawerToggle = () => {
    // Optionally, you can fetch users if switching to Chats
    if (!drawerOpen) {
      setDrawerContent('Chats');
    }
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    if (id) {
      socket.emit('add-user', id, Name);
    }
  }, [id, Name]);

  useEffect(() => {
    if (selectedFriend.id) {
      getallMsgs(selectedFriend);
    }
  }, [selectedFriend.id]);
// Chat.js (inside your component)

const getGroupMsgs = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/group/getgroupmsg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: id }),  // so the server can mark fromSelf
    });
    const json = await response.json();
    if (json.success) {
      setallMessages(json.projectMessages);
    } else {
      console.error("Error fetching group messages:", json.message);
    }
  } catch (error) {
    console.error("Error in getGroupMsgs:", error);
  }
};

useEffect(() => {
  if (drawerContent === 'Community') {
    getGroupMsgs();
  }
}, [drawerContent]);

// Chat.js (inside your component)

const sendGroupMsg = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:5000/api/group/addgroupmsg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: id,       // your current user’s ID
        message: message, // the text
      }),
    });
    const json = await response.json();
    if (response.ok && json.success) {
      // emit via socket.io so everyone in "community" gets it
      socket.emit("send-group-msg", { sender: id, message });
      // optimistically append it
      setallMessages(prev => [...prev, { fromSelf: true, message }]);
      setMessage('');
    } else {
      console.error("Group msg send failed:", json.message);
    }
  } catch (error) {
    console.error("Error sending group msg:", error);
  }
};
useEffect(() => {
  socket.on("group-msg-receive", (data) => {
    setallMessages((prev) => [...prev, {
      fromSelf: false,
      message: data.message,
    }]);
  });

  return () => socket.off("group-msg-receive");
}, []);

  const getallMsgs = async (selectedFriend) => {
    try {
      const response = await fetch("http://localhost:5000/api/msg/getmsg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: id,
          to: selectedFriend.id,
        }),
      });
      const json = await response.json();
      setallMessages([...json.projectMessages]);
    } catch (error) {
      console.error("Error getting messages:", error);
    }
  };

  const sendMsg = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/msg/addmsg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: id,
          to: selectedFriend.id,
          message: message,
        }),
      });
      const json = await response.json();
      if (response.ok && json.success) {
        socket.emit("send-msg", {
          to: selectedFriend.id,
          from: id,
          message: message,
        });
        setallMessages((prev) => [
          ...prev,
          { fromSelf: true, message: message },
        ]);
        setMessage('');
      } else {
        console.error("Message send failed:", json.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    socket.on('msg-receive', (message) => {
      setarrivalmsg({ fromSelf: false, message });
    });
    return () => {
      socket.off('msg-receive');
    };
  }, []);

  useEffect(() => {
    if (arrivalmsg) {
      setallMessages((prev) => [...prev, arrivalmsg]);
    }
  }, [arrivalmsg]);

  const updateDrawerContent = (content) => {
    setDrawerOpen(true);
    setDrawerContent(content);
  };

  // Render content based on drawerContent value
  const renderDrawerContent = () => {
    if (drawerContent === 'Profile') {
      return <Profile />;
    }
    if (drawerContent === 'Community') {
      // You can still render Convo here if Community-specific UI is desired.
      return (
        <div>
          <h3>My Community</h3>
          <List>
              {users.map((user, index) => (
                <ListItem
                  button
                  key={index}
                  
                >
                  <ListItemText primary={user.Name} />
                </ListItem>
              ))}
            </List>
        </div>
      );
    }
    if (drawerContent === 'Chats') {
      return (
        <>
          <h3>My Friends</h3>
          {users.length === 0 ? (
            <p>Loading...</p>
          ) : (
            <List>
              {users.map((user, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => {
                    const newFriend = { id: user._id, Name: user.Name };
                    setSelectedFriend(newFriend);
                  }}
                >
                  <ListItemText primary={user.Name} />
                </ListItem>
              ))}
            </List>
          )}
        </>
      );
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowPicker(false);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: 'rgb(236, 231, 231)', width: '100vw' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height: '13vh' }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon sx={{ fontSize: 40 }} />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '30px' }}>
            Interstalk
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon sx={{ fontSize: 40 }} />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} sx={{ fontSize: '20px', width: '30vw' }} />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" color="inherit" onClick={() => updateDrawerContent('Chats')}>
              <Badge badgeContent={0} color="error">
                <MailIcon sx={{ fontSize: 40 }} />
              </Badge>
            </IconButton>
            <IconButton size="large" color="inherit" onClick={() => updateDrawerContent('Community')}>
              <Badge badgeContent={0} color="error">
                <GroupsIcon sx={{ fontSize: 40 }} />
              </Badge>
            </IconButton>
            <IconButton size="large" color="inherit" onClick={() => updateDrawerContent('Profile')}>
              <AccountCircle sx={{ fontSize: 40 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '150px',
          },
        }}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
      >
        {renderDrawerContent()}
      </Drawer>
      <MainContent drawerOpen={drawerOpen} sx={{ marginTop: '150px', position: 'relative' }}>
  {/* If drawer is not open, show the landing image */}
  {(!drawerOpen) || (drawerContent === 'Chats' && !selectedFriend.Name) ? (
    <img src={Chattingimg} alt="Chatting" height="900vh" width="auto" />
  ) : (
    // If drawer is open, decide what to show:
    // For Chats mode, if a friend is selected, show personal chat; otherwise show community chat.
    drawerContent === 'Chats' && selectedFriend.Name ? (
      <>
        <div className="ChatBoxName" style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt="Profile Picture" sx={{ width: '80px', height: '80px', fontSize: 50, marginLeft: '20px' }}>
            {selectedFriend.Name.charAt(0).toUpperCase()}
          </Avatar>
          <h1 style={{ marginLeft: '20px' }}>{selectedFriend.Name}</h1>
          <MoreVertIcon style={{ fontSize: 50, marginLeft: 'auto' }} />
        </div>
        <div className="ChatBoxchats">
          {allmessages.map((message, index) => (
            <div key={index}>
              <div className={`message ${message.fromSelf ? "sended" : "received"}`}>
                <div className='contentchat'>
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="ChatBoxtype" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <EmojiEmotionsOutlinedIcon style={{ fontSize: 50, marginLeft: '10px' }} onClick={() => setShowPicker(val => !val)} />
          {showPicker && (
            <div style={{
              position: 'absolute',
              bottom: '80px',
              left: '10px',
              zIndex: 1000,
              width: '400px',
              height: '490px',
            }}>
              <Picker pickerStyle={{ width: '100%', height: '100%' }} onEmojiClick={onEmojiClick} />
            </div>
          )}
          <AddIcon style={{ fontSize: 50, marginLeft: '10px' }} />
          <form onSubmit={ drawerContent === 'Community'
      ? sendGroupMsg
      : sendMsg} style={{ flexGrow: 1, margin: '0 10px' }}>
            <input
              className="ChatBoxtypein"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ width: '100%' }}
            />
          </form>
          <MicIcon style={{ fontSize: 50, marginLeft: '10px' }} />
        </div>
      </>
    ) : (
      // In all other cases (Community mode OR Chat mode without a friend selected), show community (group) chat.
      <>
        <div className="ChatBoxName" style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{ marginLeft: '20px' }}>Community Chat</h1>
          <MoreVertIcon style={{ fontSize: 50, marginLeft: 'auto' }} />
        </div>
        <div className="ChatBoxchats">
          {allmessages.map((message, index) => (
            <div key={index}>
              <div className={`message ${message.fromSelf ? "sended" : "received"}`}>
                <div className='contentchat'>
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="ChatBoxtype" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <EmojiEmotionsOutlinedIcon style={{ fontSize: 50, marginLeft: '10px' }} onClick={() => setShowPicker(val => !val)} />
          {showPicker && (
            <div style={{
              position: 'absolute',
              bottom: '80px',
              left: '10px',
              zIndex: 1000,
              width: '400px',
              height: '490px',
            }}>
              <Picker pickerStyle={{ width: '100%', height: '100%' }} onEmojiClick={onEmojiClick} />
            </div>
          )}
          <AddIcon style={{ fontSize: 50, marginLeft: '10px' }} />
          <form onSubmit={ drawerContent === 'Community'
      ? sendGroupMsg
      : sendMsg} style={{ flexGrow: 1, margin: '0 10px' }}>
            <input
              className="ChatBoxtypein"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ width: '100%' }}
            />
          </form>
          <MicIcon style={{ fontSize: 50, marginLeft: '10px' }} />
        </div>
      </>
    )
  )}
</MainContent>
    </Box>
  );
}

