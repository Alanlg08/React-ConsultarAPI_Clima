import styles from "./App.module.css"
import Form from "./Compontets/Form/Form"
import Spinner from "./Compontets/Spinner/Spinner"
import WeatherDetail from "./Compontets/WeatherDetail/WeatherDetail"
import useWeather from "./hooks/useWeather"
import Alert from "./Compontets/Alert/Alert";

function App() {

  const { weather, fetchWeather, hasWeatherData, loading, notFound } = useWeather()

  return (
    <>
      <h1 className={styles.title}> Consulta el clima de tu ciudad </h1>

      <div className={styles.container}>
        <Form
          fetchWeather={fetchWeather}
        />
        {loading && (
          <div className={styles.spinnerWrapper}>
            <Spinner />
          </div>
        )}
        {hasWeatherData && <WeatherDetail weather={weather}/>}
        {notFound && <Alert>Ciudad No Encontrada</Alert>}
      </div>
    </>
  )
}

export default App
