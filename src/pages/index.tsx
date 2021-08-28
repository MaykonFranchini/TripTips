import { Header } from '../components/Header/index'
import Head from 'next/head';
import { useState } from 'react';

interface Weather {
  day: () => number;
  temperature: number;
  condition: String;
  imgUrl: String;
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


export default function Home() {
  const url = 'https://api.foursquare.com/v2/venues/explore?near=';
  const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

  const [city, setCity] = useState<City>(); 
  const [weather, setWeather] = useState<Weather>();
  const [locations, setLocations] = useState<Location[]>([]);

  const getWeather = async () => {
    const urlToFetch = `${weatherUrl}?&q=london&APPID=${process.env.OPENWHEATHER_KEY}`;

      const response = await fetch(urlToFetch);
      const jsonResponse = await response.json();

      const data = {
        day: new Date().getDay,
        temperature: jsonResponse.main.temp,
        condition: jsonResponse.weather[0].description,
        imgUrl: `https://openweathermap.org/img/wn/${jsonResponse.weather[0].icon}@2x.png`,
      }
    setWeather(data)
    console.log(weather)
  }

  function handleWeather() {
    getWeather();
  }

  const getLocations = async () => {

  }

  return (
    <>
      <Head>
        <title>Trip Tips</title>
      </Head>
    <Header/>
    <form>
      <input type="text" id='input'/>
      <button type="submit" onClick={handleWeather}/>
    </form>
    <div>
    </div>
    </>
  )
}
