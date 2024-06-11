import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import { Button, Grid, InputAdornment, TextField } from '@mui/material'
import { CardTravelOutlined, EmailOutlined, Event, LocationOn, PersonOutlined, PhoneOutlined, TextsmsOutlined, TimerOutlined } from '@mui/icons-material'
import Confirm from '../components/general/Confirm'
import { useState } from 'react'
import {Elements,PaymentElement,useElements,useStripe} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { useEffect } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../Configs'
import React,{ useRef } from 'react'
import { useSnackbar } from 'notistack'

const stripePromise = loadStripe('pk_test_51OVOQtFhFnxnoDMRquya5UT74vYR3BcJFVk79wFhtcXg3hgvyM44n9papYedTEXyoIqqYZWFKBGkfxTampbb7sG400RmgjkKoR');
const localizer = momentLocalizer(moment)
const CheckoutForm=()=>{
    const stripe=useStripe();
    const elements=useElements();
    const handlePayment=async (e)=>{
        e.preventDefault();
        if(!stripe||!elements) return;
        console.log(elements)
        const result = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        redirect:"if_required"
        });
        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            console.log(result.error.message);
        } else {
            console.log(result)
        }
    }
    return (
        <>
        <form onSubmit={handlePayment} >
            <PaymentElement/>
            <Button
            sx={{margin:1}}
            type='submit'
            variant='outlined'
            >Finish booking</Button>
        </form>
        </>
    )
}
export default function(props){
    const snackbar=useSnackbar()
    const [AskSave,setAskSave]=useState(false);
    const [PaymentIntent,setPaymentIntent]=useState(null);
    const refFullname=useRef(null);
    const refEmail=useRef(null);
    const refPhonenumber=useRef(null)
    const refLocation=useRef(null);
    const refDescription=useRef(null);
    const refEvent=useRef(null);

    const [Events,setEvents]=React.useState([]);
    const [ViewEvent,setViewEvent]=React.useState(null);
    const [BackgroundEvents,setBackgroundEvents]=React.useState([])
    
    const startSaving=()=>{
        axios.post(`${BACKEND_URL}/appointments/start-payment`,{
            price:15000
        })
        .then(response=>{
            if(response.data.status=="success"){
                setPaymentIntent(response.data.data)
            }
        })
    }
    const getEvents=(e)=>{
        setEvents([])
        axios.post(`${BACKEND_URL}/appointments/calendar`,{
            range:e
        },{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status=="success"){
                // setEvents([...response.data.data])
                var events_list=[];
                response.data.data.appointments.forEach(event => {
                    const fromDate=new Date(event.from);
                    const toDate=new Date(event.to);
                    const fromHour=String(fromDate.getHours()).padStart(2, '0');
                    const fromMinutes=String(fromDate.getMinutes()).padStart(2, '0');
                    const fromTime=`${fromHour}:${fromMinutes}`;
                    const toHour=String(toDate.getHours()).padStart(2, '0');
                    const toMinutes=String(toDate.getMinutes()).padStart(2, '0');
                    const toTime=`${toHour}:${toMinutes}`;
                    events_list.push({
                        start:fromDate,
                        end:toDate,
                        title:<div title="" style={{display:"flex",alignItems:"center",backgroundColor:"white",color:"black"}} >{event.user.fullname} {fromTime}-{toTime} {event.accepted?<Check color='primary' />:<TimerOutlined color='secondary' />}</div>,
                        resource:event
                    })
                });
                const backgroundEvents=[];
                response.data.data.events.forEach(event=>{
                    const start_date=new Date(event.start_date);
                    const end_date=new Date(event.end_date);
                    const start_hour=Math.floor(Number(event.start_time));
                    const end_hour=Math.floor(Number(event.end_time));
                    const start_min=(Number(event.start_time)-start_hour)*60;
                    const end_min=(Number(event.end_time)-end_hour)*60;
                    var current_date=start_date;
                    var eventTimes=[];
                    while (current_date<end_date) {
                        eventTimes.push({
                            title:event.title,
                            start: new Date(current_date.getFullYear(),current_date.getMonth(),current_date.getDate(),start_hour,start_min),
                            end: new Date(current_date.getFullYear(),current_date.getMonth(),current_date.getDate(),end_hour,end_min),
                        });
                        current_date.setDate(current_date.getDate()+1)
                    }
                    backgroundEvents.push(...eventTimes)
                })
                setEvents([
                    ...events_list,
                ])
                setBackgroundEvents([...backgroundEvents])
            }
        })
    }
    
    return (
        <>
        <Grid spacing={2} container justifyContent={`around`} alignItems={'center'}>
            <Grid item lg={6} sm={12} md={12}  >
                <Calendar
                localizer={localizer}
                backgroundEvents={BackgroundEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onRangeChange={getEvents}
                />
            </Grid>
            <Grid item lg={6} sm={12} md={12} >
                <TextField
                fullWidth
                variant='outlined'
                label="Dr Dean's work event"
                margin='normal'
                disabled
                inputRef={refEvent}
                InputProps={{
                    startAdornment:(
                    <InputAdornment position="start">
                        <Event/>
                    </InputAdornment>
                    )

                }}
                />
                <TextField
                fullWidth
                variant='outlined'
                label="Your name"
                margin='normal'
                inputRef={refFullname}
                InputProps={{
                    startAdornment:(
                    <InputAdornment>
                        <PersonOutlined/>
                    </InputAdornment>
                    )

                }}
                />
                <TextField
                fullWidth
                variant='outlined'
                label="Your Email"
                margin='normal'
                InputProps={{
                    startAdornment:(
                    <InputAdornment position="start">
                        <EmailOutlined/>
                    </InputAdornment>
                    )

                }}
                inputRef={refEmail}
                />
                <TextField
                fullWidth
                variant='outlined'
                label="Your Phone"
                margin='normal'
                InputProps={{
                    startAdornment:(
                    <InputAdornment position="start">
                        <PhoneOutlined/>
                    </InputAdornment>)

                }}
                inputRef={refPhonenumber}
                />
                <TextField
                fullWidth
                variant='outlined'
                label="Your Location"
                margin='normal'
                InputProps={{
                    startAdornment:(<InputAdornment position="start">
                        <LocationOn/>
                    </InputAdornment>)

                }}
                inputRef={refLocation}
                />
                <TextField
                fullWidth
                multiline
                rows={6}
                variant='outlined'
                label="Description"
                margin='normal'
                inputRef={refDescription}
                />
                {
                    !PaymentIntent?(
                        <Button
                        variant='outlined'
                        onClick={startSaving}
                        
                        >
                            Request
                        </Button>
                    ):(
                        <Elements stripe={stripePromise} options={PaymentIntent}>
                            <CheckoutForm/>
                        </Elements>
                    )
                }
                
            </Grid>
        
        </Grid>
        <Confirm onOk={e=>console.log("ok")} onCancel={e=>setAskSave(false)} open={AskSave} />
        </>
    )
}