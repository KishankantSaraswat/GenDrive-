import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, Typography, IconButton, CircularProgress, Fade, Divider, Avatar } from '@mui/material';
import { 
  Speed as SpeedIcon,
  DirectionsCar as CarIcon,
  Thermostat as TempIcon,
  Battery90 as BatteryIcon,
  Navigation as NavigationIcon,
  Settings as SettingsIcon,
  MusicNote as MusicIcon,
  NotificationsNone as NotificationIcon,
  Person as PersonIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ArrowForward as ArrowIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import MapDisplay from './MapDisplay';

// Premium gauge component with metallic effect and precise animations
const PremiumGauge = ({ value, max, label, color, size = 180, icon, unit }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  // Calculate angle for tick marks
  const tickMarks = Array.from({ length: 12 }, (_, i) => ({
    angle: i * 30,
    isMajor: i % 3 === 0
  }));

  return (
    <Box position="relative" display="flex" flexDirection="column" alignItems="center" sx={{ 
      padding: 2
    }}>
      {/* Outer decorative ring */}
      <Box sx={{
        position: 'absolute',
        width: size + 30,
        height: size + 30,
        borderRadius: '50%',
        background: `linear-gradient(135deg, rgba(255,255,255,0.15), rgba(0,0,0,0.2))`,
        boxShadow: `0 4px 20px rgba(0,0,0,0.2), inset 0 2px 3px rgba(255,255,255,0.1)`,
      }} />
      
      {/* Background circle with tick marks */}
      <Box sx={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: `radial-gradient(circle, #1a1a1a 0%, #111111 100%)`,
        boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.5)',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: size - 10,
          height: size - 10,
          borderRadius: '50%',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.05)',
        }
      }}>
        {/* Tick marks */}
        {tickMarks.map((tick, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              height: tick.isMajor ? '10px' : '5px',
              width: tick.isMajor ? '2px' : '1px',
              background: tick.isMajor ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
              transform: `rotate(${tick.angle}deg) translateY(-${(size / 2) - 10}px)`,
              transformOrigin: 'center bottom',
            }}
          />
        ))}
        
        {/* Progress indicator */}
        <CircularProgress
          variant="determinate"
          value={(animatedValue / max) * 100}
          size={size - 30}
          thickness={4}
          sx={{ 
            color,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 0 15px ${color}50`,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
              filter: `drop-shadow(0 0 3px ${color})`
            }
          }}
        />
        
        {/* Inner content */}
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            padding: 2
          }}
        >
          {icon && React.cloneElement(icon, { 
            sx: { 
              fontSize: 24, 
              color,
              mb: 1,
              filter: `drop-shadow(0 0 2px ${color}80)`
            } 
          })}
          
          <Typography variant="h3" sx={{ 
            fontWeight: 300,
            lineHeight: 1,
            letterSpacing: -1,
            color: 'white',
            textShadow: `0 0 10px ${color}80`
          }}>
            {animatedValue}
            <Typography 
              component="span" 
              variant="h6" 
              sx={{ 
                ml: 0.5, 
                opacity: 0.7, 
                fontWeight: 300,
                verticalAlign: 'middle' 
              }}
            >
              {unit}
            </Typography>
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: 2,
              textTransform: 'uppercase',
              fontWeight: 300,
              mt: 0.5
            }}
          >
            {label}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Premium styled stat card for vehicle info
const PremiumStatCard = ({ icon, value, label, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: '16px',
      background: 'rgba(20,20,20,0.6)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.05)',
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
      transition: 'all 0.4s ease',
      '&:hover': {
        boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${color}40`,
        '& .icon-wrapper': {
          background: `linear-gradient(135deg, ${color}50, ${color}20)`,
        }
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '50%',
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${color}50)`,
      }
    }}
  >
    <Box sx={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box 
        className="icon-wrapper"
        sx={{ 
          width: 48, 
          height: 48, 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.05)',
          transition: 'all 0.4s ease',
          mb: 2
        }}
      >
        {React.cloneElement(icon, { sx: { color, fontSize: 24 } })}
      </Box>
      
      <Typography variant="h5" sx={{ 
        fontWeight: 300, 
        color: 'white',
        mb: 0.5
      }}>
        {value}
      </Typography>
      
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'rgba(255,255,255,0.6)', 
          fontWeight: 300,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          mt: 'auto'
        }}
      >
        {label}
      </Typography>
    </Box>
    
    {/* Subtle background decoration */}
    <Box sx={{
      position: 'absolute',
      bottom: -20,
      right: -20,
      width: 100,
      height: 100,
      background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
      opacity: 0.4,
      zIndex: 1
    }} />
  </Paper>
);

// Menu button with premium styling
const PremiumMenuButton = ({ icon, label, color, active = false }) => (
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center',
      p: 1.5,
      borderRadius: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: active ? `linear-gradient(90deg, ${color}30, transparent)` : 'transparent',
      '&:hover': {
        background: `linear-gradient(90deg, ${color}20, transparent)`,
      }
    }}
  >
    <Box 
      sx={{ 
        width: 40, 
        height: 40, 
        borderRadius: '12px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: active ? `linear-gradient(135deg, ${color}, ${color}80)` : 'rgba(255,255,255,0.05)',
        boxShadow: active ? `0 3px 12px ${color}50` : 'none',
        mr: 2
      }}
    >
      {React.cloneElement(icon, { sx: { color: active ? 'white' : color, fontSize: 20 } })}
    </Box>
    
    <Typography 
      variant="body1" 
      sx={{ 
        color: active ? 'white' : 'rgba(255,255,255,0.7)', 
        fontWeight: active ? 500 : 400,
        letterSpacing: 0.5
      }}
    >
      {label}
    </Typography>
    
    {active && (
      <Box 
        sx={{ 
          width: 6, 
          height: 6, 
          borderRadius: '50%', 
          background: 'white',
          ml: 'auto',
          boxShadow: `0 0 6px ${color}`
        }} 
      />
    )}
  </Box>
);

const Dashboard = ({ preferences = {} }) => {
  // Set default premium preferences
  const prefs = {
    theme: 'dark', // Premium look works best with dark theme
    accentColor: preferences.accentColor || '#00e5ff',
    borderRadius: 'large',
    shadow: 'strong',
    animationStyle: 'dynamic',
    ...preferences
  };

  // Mock data with animation
  const [mockData, setMockData] = useState({
    speed: 0,
    temperature: 0,
    batteryLevel: 0,
    range: 0,
    rpm: 0,
    location: 'Connecting...',
    driverName: 'Alexander',
    carModel: 'Model S Plaid+'
  });

  useEffect(() => {
    // Simulate data loading with premium feel (slightly slower, more elegant)
    const timer = setTimeout(() => {
      setMockData({
        speed: 75,
        temperature: 24,
        batteryLevel: 85,
        range: 350,
        rpm: 3000,
        location: 'Monaco Grand Boulevard',
        driverName: 'Alexander',
        carModel: 'Model S Plaid+'
      });
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const mainColor = prefs.accentColor;
  const secondaryColor = prefs.secondaryColor || '#ff8a65';

  return (
    <Fade in={true} timeout={1200}>
      <Box sx={{ 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Premium glass morphism background */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, #111111 0%, #0a0a0a 100%)`,
          zIndex: -2
        }} />
        
        {/* Decorative accent gradients */}
        <Box sx={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: `radial-gradient(circle, ${mainColor}30 0%, transparent 70%)`,
          opacity: 0.6,
          filter: 'blur(80px)',
          zIndex: -1
        }} />
        
        <Box sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, ${secondaryColor}20 0%, transparent 70%)`,
          opacity: 0.5,
          filter: 'blur(60px)',
          zIndex: -1
        }} />
        
        <Grid container spacing={0}>
          {/* Left sidebar with menu */}
          <Grid item xs={2} sx={{ 
            background: 'rgba(15,15,15,0.7)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            p: 3,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Brand logo */}
            <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                background: `linear-gradient(90deg, ${mainColor}, #ffffff)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: 1
              }}>
                TESLA
              </Typography>
            </Box>
            
            {/* Navigation menu */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="caption" sx={{ 
                color: 'rgba(255,255,255,0.4)', 
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontWeight: 500,
                mb: 2,
                display: 'block'
              }}>
                Main Menu
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <PremiumMenuButton 
                  icon={<DashboardIcon />} 
                  label="Dashboard" 
                  color={mainColor} 
                  active={true}
                />
                <PremiumMenuButton 
                  icon={<NavigationIcon />} 
                  label="Navigation" 
                  color={mainColor}
                />
                <PremiumMenuButton 
                  icon={<MusicIcon />} 
                  label="Media" 
                  color={mainColor}
                />
                <PremiumMenuButton 
                  icon={<SettingsIcon />} 
                  label="Settings" 
                  color={mainColor}
                />
              </Box>
            </Box>
            
            {/* Driver profile */}
            <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ 
                  width: 40, 
                  height: 40, 
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  border: '2px solid rgba(255,255,255,0.1)'
                }}>
                  {mockData.driverName.charAt(0)}
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: 'white' }}>
                    {mockData.driverName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    Premium Driver
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          
          {/* Main content area */}
          <Grid item xs={10} sx={{ height: '100vh', overflow: 'auto' }}>
            <Box sx={{ p: 4 }}>
              {/* Header with car info */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 4
              }}>
                <Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 300, 
                    color: 'white',
                    letterSpacing: 1
                  }}>
                    {mockData.carModel}
                    <Box 
                      component="span" 
                      sx={{ 
                        ml: 2,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '30px',
                        background: `linear-gradient(90deg, ${mainColor}40, ${mainColor}10)`,
                        border: `1px solid ${mainColor}30`,
                        fontSize: '0.5em',
                        fontWeight: 400,
                        letterSpacing: 1,
                        verticalAlign: 'middle',
                        color: mainColor
                      }}
                    >
                      CONNECTED
                    </Box>
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
                    {mockData.location} • Battery {mockData.batteryLevel}%
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <IconButton sx={{ 
                    color: mainColor,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)',
                    }
                  }}>
                    <NotificationIcon />
                  </IconButton>
                  <IconButton sx={{ 
                    color: mainColor,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)',
                    }
                  }}>
                    <SettingsIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <Grid container spacing={4}>
                {/* Main gauges */}
                <Grid item xs={12} lg={7}>
                  <Paper sx={{
                    p: 3,
                    background: 'rgba(20,20,20,0.6)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Typography variant="h6" sx={{ 
                      color: 'white', 
                      fontWeight: 300, 
                      mb: 3,
                      letterSpacing: 1
                    }}>
                      Performance Metrics
                    </Typography>
                    
                    <Grid container>
                      <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <PremiumGauge
                          value={mockData.speed}
                          max={200}
                          label="Speed"
                          unit="mph"
                          color={mainColor}
                          size={220}
                          icon={<SpeedIcon />}
                        />
                      </Grid>
                      <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <PremiumGauge
                          value={mockData.rpm}
                          max={8000}
                          label="Engine"
                          unit="rpm"
                          color={secondaryColor}
                          size={220}
                          icon={<SpeedIcon />}
                        />
                      </Grid>
                    </Grid>
                    
                    {/* Decorative accent */}
                    <Box sx={{
                      position: 'absolute',
                      bottom: -20,
                      right: -20,
                      width: 200,
                      height: 200,
                      background: `radial-gradient(circle, ${mainColor}10 0%, transparent 70%)`,
                      opacity: 0.4
                    }} />
                  </Paper>
                  
                  {/* Stats row */}
                  <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid item xs={4}>
                      <PremiumStatCard 
                        icon={<BatteryIcon />}
                        value={`${mockData.batteryLevel}%`}
                        label="Battery"
                        color={mainColor}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <PremiumStatCard 
                        icon={<TempIcon />}
                        value={`${mockData.temperature}°C`}
                        label="Climate"
                        color={mainColor}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <PremiumStatCard 
                        icon={<NavigationIcon />}
                        value={`${mockData.range} km`}
                        label="Range"
                        color={mainColor}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                
                {/* Right side - Map & quick controls */}
                <Grid item xs={12} lg={5}>
                  {/* Map */}
                  <Paper sx={{
                    height: 380,
                    background: 'rgba(20,20,20,0.6)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                  }}>
                    <Typography
                      variant="body1"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        background: 'rgba(15,15,15,0.8)',
                        backdropFilter: 'blur(10px)',
                        px: 2,
                        py: 1,
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: 400,
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      <NavigationIcon sx={{ color: mainColor, fontSize: 18 }} />
                      {mockData.location}
                    </Typography>
                    
                    <Box sx={{ 
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      background: mainColor,
                      color: 'black',
                      px: 2,
                      py: 1,
                      borderRadius: '12px',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      boxShadow: `0 4px 12px ${mainColor}50`
                    }}>
                      View Full Map <ArrowIcon sx={{ fontSize: 16, ml: 0.5 }} />
                    </Box>
                    
                    <MapDisplay preferences={prefs} />
                    
                    {/* Map overlay gradient */}
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '80px',
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
                      pointerEvents: 'none',
                      zIndex: 5
                    }} />
                  </Paper>
                  
                  {/* Quick controls */}
                  <Paper sx={{
                    mt: 3,
                    p: 3,
                    background: 'rgba(20,20,20,0.6)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 300 }}>
                        Quick Controls
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: mainColor, 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        View All <ArrowIcon sx={{ fontSize: 14, ml: 0.5 }} />
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {[
                        { icon: <CarIcon />, label: "Vehicle" },
                        { icon: <TempIcon />, label: "Climate" },
                        { icon: <MusicIcon />, label: "Media" },
                        { icon: <SettingsIcon />, label: "Settings" }
                      ].map((item, index) => (
                        <Grid item xs={3} key={index}>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <Box sx={{ 
                              width: 60, 
                              height: 60, 
                              borderRadius: '16px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.05)',
                              mb: 1,
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              '&:hover': {
                                background: `linear-gradient(135deg, ${mainColor}30, transparent)`,
                                border: `1px solid ${mainColor}40`,
                                boxShadow: `0 5px 15px rgba(0,0,0,0.2), 0 0 0 1px ${mainColor}30`,
                                transform: 'translateY(-5px)'
                              }
                            }}>
                              {React.cloneElement(item.icon, { sx: { color: mainColor, fontSize: 24 } })}
                            </Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {item.label}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default Dashboard;