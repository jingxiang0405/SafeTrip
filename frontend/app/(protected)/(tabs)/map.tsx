import React, { useEffect } from 'react';
import { Platform, StyleSheet, ScrollView, useWindowDimensions, View, SafeAreaView, Text, useColorScheme } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from '@/constants/Colors';
// import maplibregl from 'maplibre-gl';

export default function MapTest() {
  const { width, height } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const nowColorScheme: 'light' | 'dark' = colorScheme ?? 'light';
  const styles = initStyles(nowColorScheme);
  const mapHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8" />
    <meta name="viewport" content='width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;' />
    <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css" />
    <script src="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js"></script>
    <style>
      body { margin: 0; padding: 0; background: black; }
      #map { position: absolute; top: 0px; bottom: 0; width: 100%; }
      .header {
      position: absolute;
      top: 0;
      width: 100%;
      background: #111;
      color: #fff;
      z-index: 1000;
      text-align: center;
      font-size: 20px;
      }
      .side-menu a {
      display: block;
      padding: 0px;
      color: white;
      text-decoration: none;
      cursor: pointer;
      }

    </style>
    </head>
    <body>
    <div class="side-menu" id="menu" hidden></div>
    <div id="map"></div>

    <script>
      const voyager = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

      const styles = [  
      { label: 'Voyager', source: voyager },
      ];

      const menu = document.getElementById('menu');
      let activeStyle = null;

      styles.forEach(style => {
      let link = document.createElement('a');
      link.innerHTML = style.label;
      link.onclick = (e) => {
        map.setStyle(style.source);
        document.querySelector('.active')?.classList.remove('active');
        e.target.classList.add('active');
      };
      menu.appendChild(link);

      if (!activeStyle) {
        link.classList.add('active');
        activeStyle = { source: style.source };
        activeStyle = { source: voyager };
      }
      });

      const map = new maplibregl.Map({
      container: 'map',
      style: activeStyle.source,
      center: [121.56033, 25.00239],
      zoom: 12,
      pitchWithRotate: false,    // disables pitch when rotating
      dragRotate: false,         // disables right-click + drag rotation
      });
      map.touchZoomRotate.disableRotation();
      let marker = new maplibregl.Marker({
        // color: "#FFFFFF",
        // draggable: true
        }).setLngLat([121.56033, 25.00239])
        .addTo(map);

      map.addControl(new maplibregl.NavigationControl());
    
      map.on('load', () => {
        const layers = map.getStyle().layers;
        // var layers = map.getStyle().layers;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].id === 'building' || layers[i].id === 'building-top') {  // Check for the building layer ID
          map.setLayoutProperty(layers[i].id, 'visibility', 'none');
          // break; // Exit loop once we've found and modified the building layer
          }
        }
        const MAPTILER_KEY = 'get_your_own_OpIi9ZULNHzrESv6T2vL';
        map.addSource('openmaptiles', {
          url: "https://api.maptiler.com/tiles/v3/tiles.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
          type: 'vector',
        });
         map.addLayer(
          {
            'id': '3d-buildings',
            'source': 'openmaptiles',
            'source-layer': 'building',
            'type': 'fill-extrusion',
            'minzoom': 15,
            'filter': ['!=', ['get', 'hide_3d'], true],
            'paint': {
              'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['get', 'render_height'], 0, 'lightgray', 200, 'royalblue', 400, 'lightblue'
              ],
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                16,
                ['get', 'render_height']
              ],
              'fill-extrusion-base': ['case',
                ['>=', ['get', 'zoom'], 16],
                ['get', 'render_min_height'], 0
              ]
            }
          },
          labelLayerId
        );
      });
    </script>
    </body>
    </html>
  `;
  if (Platform.OS === 'web') {
    const injectMapLibreAssets = () => {
      // Inject CSS
      const link = document.createElement('link');
      link.href = 'https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    
      // Inject JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js';
      script.async = true;
      document.body.appendChild(script);
      };
    
      injectMapLibreAssets();
    // return <div dangerouslySetInnerHTML={{ __html: mapHtml }}></div>
    const maplibregl = require('maplibre-gl');
    useEffect(() => {
      const MAPTILER_KEY = 'get_your_own_OpIi9ZULNHzrESv6T2vL';
      const map = new maplibregl.Map({
        style: `https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json`,
        center: [121.56033, 25.00239],
        zoom: 15.5,
        pitch: 10,
        // bearing: -17.6,
        container: 'map',
        canvasContextAttributes: {antialias: true}
      });
    
      // The 'building' layer in the streets vector source contains building-height
      // data from OpenStreetMap.
      map.on('load', () => {
        // Insert the layer beneath any symbol layer.
        const layers = map.getStyle().layers;
        // var layers = map.getStyle().layers;
        for (var i = 0; i < layers.length; i++) {
        if (layers[i].id === 'building' || layers[i].id === 'building-top') {  // Check for the building layer ID
          map.setLayoutProperty(layers[i].id, 'visibility', 'none');
          // break; // Exit loop once we've found and modified the building layer
        }
        }
        let labelLayerId;
        for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
          }
        }
    
        map.addSource('openmaptiles', {
          url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_KEY}`,
          type: 'vector',
        });
    
        map.addLayer(
          {
            'id': '3d-buildings',
            'source': 'openmaptiles',
            'source-layer': 'building',
            'type': 'fill-extrusion',
            'minzoom': 15,
            'filter': ['!=', ['get', 'hide_3d'], true],
            'paint': {
              'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['get', 'render_height'], 0, 'lightgray', 200, 'royalblue', 400, 'lightblue'
              ],
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                16,
                ['get', 'render_height']
              ],
              'fill-extrusion-base': ['case',
                ['>=', ['get', 'zoom'], 16],
                ['get', 'render_min_height'], 0
              ]
            }
          },
          labelLayerId
        );
        const allLayers = map.getStyle().layers;
        for (let i = allLayers.length - 1; i >= 0; i--) {
          if (allLayers[i].id !== '3d-buildings') {
            map.moveLayer('3d-buildings', allLayers[i].id);
            break;
          }
        }
      });
    
      map.addControl(new maplibregl.NavigationControl());
      let marker = new maplibregl.Marker({
        // color: "#FFFFFF",
        // draggable: true
        }).setLngLat([121.56033, 25.00239])
        .addTo(map);
      
      }, []);
    
      return <div id="map" style={{ width: '100%', height: '100%' }} />;
    }

  return (
    <SafeAreaView style={styles.topBarContainer}>
      <View style={styles.topBar}>
        <Text style={{color: Colors[nowColorScheme].text, fontWeight: 'bold', fontSize: 28}}>Map</Text>
      </View>
      <View style={styles.container}>
        
        <View style={{
          width: '92%',
          height: Platform.OS === 'android' ? '95%' : '90%',
          marginBottom: Platform.OS === 'android' ? 0 : 47,
          borderRadius: 20,
          overflow: 'hidden',
          alignSelf: 'center',
        }}>
          <WebView 
            originWhitelist={['*']}
            source={{ html: mapHtml }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

// export default MapTest;
const initStyles = (nowColorScheme: 'light' | 'dark') => {
  const styles = StyleSheet.create({
    topBarContainer: {
      flex: 1,
      backgroundColor: Colors[nowColorScheme].background,
    },
    topBar: {
      backgroundColor: Colors[nowColorScheme].background,
      marginTop: 10,
      paddingTop: Platform.OS === 'android' ? 25 : 0, // status bar padding for Android
      height: Platform.OS === 'android' ? 79 : 50,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      borderBottomColor: Colors[nowColorScheme].border,
      borderBottomWidth: 0.5,
    },
    container: {
    flex: 1,
    backgroundColor: Colors[nowColorScheme].background,
    justifyContent: 'center',
    // alignItems: 'center',
    },
    text: {
      fontSize: 24,
      color: Colors[nowColorScheme].text,
    },
    
  });
  return styles
}