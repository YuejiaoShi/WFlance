'use client';

import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { XCircleIcon } from '@heroicons/react/24/solid';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useEffect, useState } from 'react';
import { getFieldFromCookie } from '@/app/utils/auth';
import SpinnerMini from './SpinnerMini';
import { Delete } from '@mui/icons-material';

function Calender() {
  const [currentEvent, setCurrentEvent] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [selectDate, setSelectDate] = useState(null);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEventId, setLoadingEventId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = getFieldFromCookie('userId');
      setUserId(userId);
      try {
        const response = await fetch(`/api/events/${userId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const contentType = response.headers.get('Content-Type');
          if (contentType && contentType.includes('application/json')) {
            const result = await response.json();
            setCurrentEvent(result);
          }
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleDateClick = selected => {
    setSelectDate(selected);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle('');
  };

  const handleAddEvent = async e => {
    e.preventDefault();
    if (newEventTitle && selectDate) {
      const calendarApi = selectDate.view.calendar;
      calendarApi.unselect();

      const newEvent = {
        id: `${selectDate.start.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        start: selectDate.start,
        end: selectDate.end,
        allDay: selectDate.allDay,
        userId: `${userId}`,
      };

      try {
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvent),
        });

        if (response.ok) {
          setCurrentEvent(prevEvents => [...prevEvents, newEvent]);

          calendarApi.addEvent(newEvent);

          handleCloseDialog();
        } else {
          console.error('Failed to add event:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding event:', error);
      }
    }
  };

  const handleDeleteEvent = async eventId => {
    if (window.confirm('Are you sure you want to delete this event?')) setLoadingEventId(eventId);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setCurrentEvent(prevEvents => prevEvents.filter(event => event.id !== eventId));
        setSelectedEvent(null);
      } else {
        console.error('Failed to delete event.');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setIsLoading(false);
      setLoadingEventId(null);
    }
  };

  return (
    <>
      <div className='flex flex-col lg:flex-row w-full px-4 md:px-10 justify-start items-start gap-1'>
        <div className='w-full lg:w-3/12 md:h-[50vh]'>
          <div className='w-full py-7 text-xl md:text-2xl font-extrabold px-2 md:px-7'>Calendar Event</div>
          <div className='h-full overflow-y-auto'>
            <ul className='h-full space-y-2 w-full'>
              {currentEvent.length <= 0 && <div className='italic text-center text-gray-400'>No Events</div>}

              {currentEvent.length > 0 &&
                currentEvent.map(event => (
                  <li
                    className='flex flex-col justify-between items-center
                     border border-gray-200 shadow px-4 py-2 rounded-md bg-sky-700 
                      text-primary-neutral-light lg:flex-row'
                    key={event.id}
                  >
                    {event.title}
                    <label>
                      {formatDate(event.start, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </label>
                    <button onClick={() => handleDeleteEvent(event.id)} disabled={loadingEventId === event.id}>
                      {loadingEventId === event.id ? <SpinnerMini /> : <XCircleIcon className='h-6 w-6' />}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className='w-full lg:w-9/12 mt-6 lg:mt-8 md:text-md text-sm my-6 mx-auto'>
          <FullCalendar
            height={'55vh'}
            plugins={[dayGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay',
              width: 'full',
            }}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={selected => {
              if (selected) {
                handleDateClick(selected);
              }
            }}
            events={currentEvent}
          />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
          </DialogHeader>
          <form className='space-y-4 md:space-x-5 mb-4' onSubmit={handleAddEvent}>
            <input
              type='text'
              placeholder='Event Title'
              value={newEventTitle}
              onChange={e => setNewEventTitle(e.target.value)}
              required
              className='border border-gray-200 p-3 rounded-md text-sm md:text-lg w-full'
            />
            <button className='bg-accent-300 text-white p-3 mt-3 md:mt-5 rounded-md w-full md:w-auto' type='submit'>
              Add
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Calender;
