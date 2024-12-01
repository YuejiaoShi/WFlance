'use client';
import { IconButton, Popper, Paper, ClickAwayListener } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogOutButton from '../AuthComponents/LogOutButton';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Drawer, List, ListItemText, Box } from '@mui/material';
import { getFieldFromCookie } from '@/app/utils/auth';
import { FaUserAlt } from 'react-icons/fa';
import DevLogo from './DevLogo';

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [devName, setDevName] = useState('');
  const [devRole, setDevRole] = useState('');
  const [devEmail, setDevEmail] = useState('');
  const [userBoxVisible, setUserBoxVisible] = useState(false);
  const userAvatarRef = useRef(null);

  useEffect(() => {
    const userRole = getFieldFromCookie('userRole');
    const userName = getFieldFromCookie('userName');
    const userEmail = getFieldFromCookie('userEmail');

    setDevName(userName || '');
    setDevRole(userRole || '');
    setDevEmail(userEmail || '');
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(prev => !prev);
  };

  const handleMenuItemClick = () => {
    setDrawerOpen(false);
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dev-dashboard' },
    { name: 'Projects', path: '/dev-dashboard/projects' },
    { name: 'Chat', path: '/dev-dashboard/chat' },
    { name: 'Calendar', path: '/dev-dashboard/calendar' },
  ];

  const HeaderContent = () => (
    <List>
      {menuItems.map((item, index) => (
        <Link
          href={item.path}
          key={index}
          onClick={handleMenuItemClick}
          className='rounded-md hover:text-gray-400 px-10'
        >
          <ListItemText primary={item.name} />
        </Link>
      ))}
    </List>
  );

  const triggerUserBox = () => {
    setUserBoxVisible(prev => !prev);
  };

  return (
    <header className='flex justify-between items-center bg-primary-blue md:px-4 px-2 py-1 text-white w-full'>
      <DevLogo className='hidden md:block mr-10 ml-3' />
      <div className='flex flex-row justify-between items-center w-full mt-2'>
        <div className='flex flex-row justify-start md:hidden w-full my-1 px-2'>
          <IconButton edge='start' color='inherit' aria-label='menu' onClick={toggleDrawer} className='lg:hidden'>
            <MenuIcon />
          </IconButton>
          <DevLogo className='md:hidden ml-3' />
        </div>

        <div className='hidden md:flex md:flex-row space-x-6 m-2 '>
          {menuItems.map((item, index) => (
            <Link
              href={item.path}
              key={index}
              className='mt-2 pt-2 text-lg text-white items-center hover:text-primary-accent-dark font-semibold'
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className='relative flex items-end space-x-4'>
          <div
            id='user-avatar'
            ref={userAvatarRef}
            className='flex justify-center content-end items-end py-1.5 px-2 min-w-16 rounded-full bg-yellow-200 text-primary-blue-dark font-bold hover:cursor-pointer'
            onClick={triggerUserBox}
          >
            {devName
              ? devName.split(' ')[0].charAt(0).toUpperCase() + devName.split(' ')[0].slice(1).toLowerCase()
              : '?'}
          </div>

          <Popper open={userBoxVisible} anchorEl={userAvatarRef.current} placement='bottom-start'>
            {({ TransitionProps }) => (
              <ClickAwayListener onClickAway={() => setUserBoxVisible(false)}>
                <Paper {...TransitionProps} className='top-10 left-0 bg-yellow-50 shadow-xl rounded-md p-4'>
                  <div className='flex items-center space-x-2 justify-between'>
                    <div className='flex items-center space-x-2'>
                      <FaUserAlt className='text-lg text-gray-600' />
                      <p className='font-semibold text-sm'>Profile</p>
                    </div>
                    <LogOutButton />
                  </div>
                  <div className='mt-2 text-sm text-gray-700'>
                    <p>
                      <strong>Name:</strong> {devName || 'N/A'}
                    </p>
                    <p>
                      <strong>Role:</strong> {devRole || 'N/A'}
                    </p>
                    <p>
                      <strong>Email:</strong> {devEmail || 'N/A'}
                    </p>
                  </div>
                </Paper>
              </ClickAwayListener>
            )}
          </Popper>
        </div>
      </div>

      <Drawer anchor='left' open={drawerOpen} onClose={() => setDrawerOpen(false)} variant='temporary'>
        <Box className='p-4 bg-primary-blue h-full w-[120px] text-white'>
          <HeaderContent />
        </Box>
      </Drawer>
    </header>
  );
}
