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

  // const getWeather = async (city: string) => {
    
  // }

  

  async function handleWeather(event) {
    event.preventDefault()

      const urlToFetch = `${weatherUrl}?&q=${city}&APPID=67cbbcf670ade9bdc624ac5d94c5534d`;
  
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
    console.log(weather)
  }

  // const getLocations = async () => {

  // }
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
      <button type="submit" />
    </form>
    <div>
      <h2>{weather.city} {days[new Date().getDay()]}</h2>
      <p>Temperature: {temp} °C</p>
      <p>Condition: {weather.condition}</p>
      <img src={weather.imgUrl} alt="waether icon" />
    </div>
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