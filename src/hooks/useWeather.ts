import axios from "axios"
import { z } from 'zod'
// import { object, string, number, type InferOutput, parse } from 'valibot'
import type { SearchType } from "../types"
import { useMemo, useState } from "react"

//type guard
// function isWeatherResponse(weather : unknown) : weather is Weather{
//     return (
//         // primero comprobamos que exista algo en weather
//         Boolean(weather) && 
//         // despues comprobamos que sea un objeto
//         typeof weather === 'object' &&
//         // y despues accedemos a cada uno de los elementos verificando si son string o numero
//         typeof (weather as Weather).name === 'string' &&
//         typeof (weather as Weather).main.temp === 'number' &&
//         typeof (weather as Weather).main.temp_max === 'number' &&
//         typeof (weather as Weather).main.temp_min === 'number' 
//     )
// }

//Zod
// primero debes crear un schema, parecido al type
const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number()
    })
})

//y ahora creas el type y le asignas el schema creado
export type Weather = z.infer<typeof Weather>

//Valibot
// const WeatherSchema = object({
//     name: string(),
//     main: object({
//         temp: number(),
//         temp_max: number(),
//         temp_min: number()
//     })
// })

// type Weather = InferOutput<typeof WeatherSchema>


const inicalState = {
        name: '',
        main: {
            temp: 0,
            temp_max: 0,
            temp_min: 0
    }
    }


export default function useWeather() {


  const [weather, setWeather] = useState<Weather>(inicalState)

    const [loading, setLoading] = useState(false)
    const [notFound, setNotFound] = useState(false)

  const fetchWeather = async(search: SearchType) => {

    // el api key lo pondermos en las variables de abiente (env) para que esa informacion sea protegida y no se suba a GIt o a otros lados
    const appId = import.meta.env.VITE_API_KEY
    setNotFound(false)
    setLoading(true)
    setWeather(inicalState)
    try {        
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`

        const {data} = await axios.get(geoUrl)

        // COMPROBAR SI EXISTE
        if (!data[0]) {
            setNotFound(true)
            return
        }

        const lat = data[0].lat
        const lon = data[0].lon

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

        // lo que hace los : es reasignar el nombre de data a weatherResult, para que axios no tenga problemas
        // const { data: weatherResult } = await axios(weatherUrl)
        // console.log(weatherResult)

        //Asignar Type
        // opciones para typar el campo weatherResult para que no sea any
        // la primera forma y la performance, es creando un type
        // esto forza el type, esto puede dar problemas al momento de trabajar, ya que se no se forzar adecuadamente, puede tronar la respuesta
        // const { data: weatherResult } = await axios<Weathers>(weatherUrl)
        // console.log(weatherResult.main.temp)
        // console.log(weatherResult.name)

        //typeGuard
        // es parecido a asignar type, solamente que aqui ya no fuerzas a la variable, si no que de verdad se garantiza que es de esa format, asi si da error, te lo informaria
        // el problema de esto, es que no es muy mantenible y recomendado, ya que si son codigos grandes, seria muy tedioso crear una funcion y comporbar cada campo 
        // const { data: weatherResult } = await axios(weatherUrl)
        // const result = isWeatherResponse(weatherResult)
        // if (result) {
        //     console.log(weatherResult.main.temp)
        //     console.log(weatherResult.name)
        // }

        //ZOD
        //su unica desventaja es que es algo pesado
        const { data: weatherResult } = await axios(weatherUrl)
        // el metodo safeParse, toma las propiedades del objeto y las compara con las del Schema, es una validacion, si se cumple, te deja usarlo
        const result = Weather.safeParse(weatherResult)
        if (result.success) {
            setWeather(result.data)
        }     

        //Valibot
        // es una alternativa a zod, hace lo mismo pero mas ligero
        // const { data: weatherResult } = await axios(weatherUrl)
        // const result = parse(weatherResult, weatherResult)
        // if (result) {
        //     console.log(result.name)
        // }

        

    } catch (error) {
        console.log(error)
    } finally {
        setLoading(false)
    }

  }

  const hasWeatherData = useMemo(() => weather.name, [weather])

  return {
    weather,
    fetchWeather,
    hasWeatherData,
    loading,
    notFound
  }
}
