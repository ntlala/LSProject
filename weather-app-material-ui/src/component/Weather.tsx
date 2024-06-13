import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import {
  WbSunny,
  Cloud,
  CloudOutlined,
  CloudQueue,
  CloudQueueOutlined,
  CloudDone,
  CloudDoneOutlined,
  Opacity,
  OpacityOutlined,
  FilterDrama,
  FilterDramaOutlined,
  InvertColors,
  InvertColorsOutlined,
  BeachAccess,
  BeachAccessOutlined,
  Waves,
  WavesOutlined,
} from "@mui/icons-material"; // Import icons from Material-UI Icons

interface WeatherData {
  temp: number;
  weather: {
    description: string;
    icon: string; // Add icon field to WeatherData interface
  };
  city_name: string;
}

const Weather: React.FC = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from cookies when component mounts
    const recentSearchesFromCookies = loadRecentSearchesFromCookies();
    setRecentSearches(recentSearchesFromCookies);
  }, []);

  const loadRecentSearchesFromCookies = (): string[] => {
    const recentSearchesStr = localStorage.getItem("recentSearches");
    if (recentSearchesStr) {
      return JSON.parse(recentSearchesStr);
    }
    return [];
  };

  const saveRecentSearchesToCookies = (searches: string[]) => {
    localStorage.setItem("recentSearches", JSON.stringify(searches));
  };

  const fetchWeatherData = async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        "https://weatherbit-v1-mashape.p.rapidapi.com/current",
        {
          params: { city: city, units: "imperial", lang: "en" },
          headers: {
            "x-rapidapi-key":
              "6e7b1f9f84mshd53e7f167cd1cf8p1e9624jsne66e188ce0c1",
            "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com",
          },
        }
      );
      setWeatherData(response.data.data[0]);
      setLoading(false);

      // Update recent searches and save to cookies
      const updatedRecentSearches = [city, ...recentSearches.slice(0, 4)];
      setRecentSearches(updatedRecentSearches);
      saveRecentSearchesToCookies(updatedRecentSearches);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchWeatherData(city);
  };

  const handleRecentSearchClick = (recentCity: string) => {
    setCity(recentCity);
    fetchWeatherData(recentCity);
  };

  const getWeatherIcon = (iconCode: string) => {
    // Return the corresponding Material-UI icon based on weather condition code
    switch (iconCode) {
      case "c01d": // clear sky day
      case "c01n": // clear sky night
        return <WbSunny />;
      case "c02d": // few clouds day
      case "c02n": // few clouds night
        return <Cloud />;
      case "c03d": // scattered clouds day
      case "c03n": // scattered clouds night
        return <CloudOutlined />;
      case "c04d": // broken clouds day
      case "c04n": // broken clouds night
        return <CloudQueue />;
      case "a01d": // isolated showers day
      case "a01n": // isolated showers night
        return <CloudQueueOutlined />;
      case "a02d": // scattered showers day
      case "a02n": // scattered showers night
        return <CloudDone />;
      case "a03d": // showers day
      case "a03n": // showers night
        return <CloudDoneOutlined />;
      case "a04d": // thunderstorm day
      case "a04n": // thunderstorm night
        return <FilterDrama />;
      case "a05d": // mixed rain and snow day
      case "a05n": // mixed rain and snow night
        return <FilterDramaOutlined />;
      case "a06d": // mixed rain and sleet day
      case "a06n": // mixed rain and sleet night
        return <Opacity />;
      case "a07d": // mixed snow and sleet day
      case "a07n": // mixed snow and sleet night
        return <OpacityOutlined />;
      case "a08d": // freezing drizzle day
      case "a08n": // freezing drizzle night
        return <InvertColors />;
      case "a09d": // freezing rain day
      case "a09n": // freezing rain night
        return <InvertColorsOutlined />;
      case "a10d": // snow showers day
      case "a10n": // snow showers night
        return <BeachAccess />;
      case "a11d": // snow flurries day
      case "a11n": // snow flurries night
        return <BeachAccessOutlined />;
      case "a12d": // light rain day
      case "a12n": // light rain night
        return <Waves />;
      case "a13d": // rain day
      case "a13n": // rain night
        return <WavesOutlined />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        {/* Recent Searches Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            mr: 2,
          }}
        >
          <Typography variant="h6">Recent Searches:</Typography>
          <Box>
            {recentSearches.map((recentCity, index) => (
              <Button
                key={index}
                variant="outlined"
                size="small"
                onClick={() => handleRecentSearchClick(recentCity)}
                sx={{ mt: 1 }}
              >
                {recentCity}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Main Weather Section */}
        <Box
          sx={{
            flex: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Get Weather
            </Button>
          </Box>

          {loading && <CircularProgress sx={{ mt: 2 }} />}

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              Error: {error.message}
            </Typography>
          )}

          {weatherData && (
            <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
              <Typography variant="h5">Weather Data</Typography>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                {getWeatherIcon(weatherData.weather.icon)}
              </Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography>Temperature: {weatherData.temp}°F</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    Weather Description: {weatherData.weather.description}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>City: {weatherData.city_name}</Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Weather;
