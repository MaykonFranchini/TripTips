import { GetServerSideProps } from 'next';
import { Header } from '../components/Header/index'
import Head from 'next/head';
import { useState, useEffect } from 'react';



interface Weather {
  day?:  number;
  temperature: number;
  condition: String;
  imgUrl: string;
  city: string;
}

interface Location {
  address: string;
  city: string;
  country: string;
  imgUrl: string;
  name: string;
}

interface City {
  name: string;
}


export default function Home(props) {
  const url = 'https://api.foursquare.com/v2/venues/explore?near=';
  const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
  
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<Weather>(props);
  const [locations, setLocations] = useState<Location[]>([]);

  const getWeather = async () => {
    const urlToFetch = `${weatherUrl}?&q=${city}&APPID=${process.env.NEXT_PUBLIC_OPENWHEATHER_KEY}`;
  
      const response = await fetch(urlToFetch);
      const jsonResponse = await response.json();
  
      const data = {
        day: new Date().getDay(),
        temperature: jsonResponse.main.temp,
        condition: jsonResponse.weather[0].description,
        imgUrl: `https://openweathermap.org/img/wn/${jsonResponse.weather[0].icon}@2x.png`,
        city: jsonResponse.name,
      }
    setWeather(data)
  }

  async function getLocations() {
    const urlToFetch = `${url}${city}&limit=10&client_id=${process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_SECRET}&v=20210827`;
    const response = await fetch(urlToFetch);
    const jsonResponse = await response.json();
    const venues = jsonResponse.response.groups[0].items.map(item => item.venue);

    const venuesFiltered = venues.map( location => {
      return {
        name: location.name,
        address: location.location.formattedAddress[0],
        city: location.location.formattedAddress[1],
        country: location.location.formattedAddress[2],
        imgUrl: `${location.categories[0].icon.prefix}bg_64${location.categories[0].icon.suffix}`,
      }
    })

    setLocations(venuesFiltered)
  }


  async function handleWeather(event) {
    event.preventDefault()
    getWeather()
    getLocations()
  
  }


  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const temp = Math.floor(weather.temperature - 273.15)
  return (
    <>
      <Head>
        <title>Trip Tips</title>
      </Head>
    <Header/>
    <form onSubmit={handleWeather}>
      <input type="text" id='input' value={city} onChange={e => setCity(e.currentTarget.value)}/>
      <button type="submit" >Search</button>
    </form>
    <div>
      <h2>{weather.city} {days[new Date().getDay()]}</h2>
      <p>Temperature: {temp} °C</p>
      <p>Condition: {weather.condition}</p>
      <img src={weather.imgUrl} alt="waether icon" />
    </div>
    <h2>Points of Interest</h2>
    {locations.map(location => (
      <div key={location.name}>
        <img src={location.imgUrl} alt="place icon" />
        <div>
        <h3>{location.name}</h3>
        <p>Address: {location.address}, {location.city}</p>
        </div>
      </div>
    ))}

    </>
  )
}


export const getServerSideProps: GetServerSideProps = async () => {

  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?&q=london&APPID=${process.env.OPENWHEATHER_KEY}`);
      const jsonResponse = await response.json();

    return {
      props: {
        temperature: Number.parseFloat(jsonResponse.main.temp),
        condition: jsonResponse.weather[0].description,
        imgUrl: `https://openweathermap.org/img/wn/${jsonResponse.weather[0].icon}@2x.png`,
      }
    }
}