import React, { useState, useEffect } from 'react'
import { Feather as Icon } from "@expo/vector-icons"
import { View, Text, Image, StyleSheet, ImageBackground, TextInput, KeyboardAvoidingView, KeyboardAvoidingViewBase, Platform } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select'
import axios from 'axios'


interface IBGEUfResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

const Home = () => {
  const navigation = useNavigation();
  const [selectedUf, setSelectedUf] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  useEffect(() => {
    getUfs();
    getCities();
  }, [])





  function getUfs() {
    axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      setUfs(response.data.map(uf => uf.sigla))
    }).catch(err => console.log(err))
  }
  function getCities() {

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
      setCities(response.data.map(city => city.nome))
    }).catch(err => console.log(err))
  }

  function handleNavigateToPoints() {
    navigation.navigate("Points", {
      selectedUf,
      selectedCity
    })
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require("../../assets/home-background.png")}
      imageStyle={{ width: 274, height: 368 }}
    >

      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontratem pontos de coleta de forma eficiente.</Text>

      </View >
      <View style={styles.footer}>

        <RNPickerSelect
          style={{ ...pickerStyle }}
          onValueChange={(value) => setSelectedUf(value)}
          items={ufs.map(uf => { return { label: String(uf), value: String(uf) } })}
          placeholder={{ label: 'Selecione uma UF', value: '0' }}
        />
        <RNPickerSelect
          style={{ ...pickerStyle }}
          onValueChange={(value) => setSelectedCity(value)}
          items={cities.map(city => { return { label: city, value: city } })}
          placeholder={{ label: 'Selecione uma Cidade', value: '0' }}
        />



        <RectButton style={styles.button} onPress={() => handleNavigateToPoints()}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>

        </RectButton>
      </View>

    </ImageBackground>
  )
}

const pickerStyle = StyleSheet.create({
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home