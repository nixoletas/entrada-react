import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Platform, Image } from 'react-native';

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [messageVisible, setMessageVisible] = useState(false);
  const [crachaID, setCrachaID] = useState('');

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos de sua permissão para usar a câmera</Text>
        <Button onPress={requestPermission} title="Conceder permissão" />
      </View>
    );
  }

  const confirmarEntrada = (data: any) => {
    if (crachaID != data.data) {
      const url = `http://sistemas.9bcomge.eb.mil.br/crachas/cracha.php?movimentacao=${data.data}&tipo=veiculo&status=Entrada&destino=Residência&obs=`;
      
      setCrachaID(data.data);
      fetch(url)
      //não é json
      .then(response => response.status)
      // perguntar se deseja continuar ou não a entrada
      
      .then(result => {
        console.log('Requisição bem-sucedida:', result);
        // Você pode adicionar qualquer lógica adicional aqui
        setMessageVisible(true);
        setTimeout(() => {
          setMessageVisible(false);
        }
        , 3000);
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
      });
    } else {
      console.log('Entrada já confirmada do crachá ID:', crachaID);
    }

  }

  return (
    <View style={styles.container}>
      <CameraView 
      style={styles.camera} 
      facing='back'
      barcodeScannerSettings={{barcodeTypes: ["qr"],}}
      onBarcodeScanned={(data) => {
        confirmarEntrada(data);
      }
    }
      >
        <View style={styles.buttonContainer}>
            <Text style={styles.text}>ENTRADA</Text>
        </View>
      </CameraView>
      {messageVisible && (
        <View style={styles.confirmationMessage}>
          <Text style={styles.confirmationText}>Entrada confirmada! 🆗</Text>
          <Text style={styles.confirmationText}>ID: {crachaID}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  // alinhar o texto no centro
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  confirmationMessage: {
    position: 'absolute',
    bottom: 50,
    left: '20%',
    right: '20%',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
  },
  confirmationText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});