import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Platform, Image } from 'react-native';

export default function HomeScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

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

  let crachaID = '';

  const confirmarEntrada = (data: any) => {

    if (crachaID != data.data) {
      crachaID = data.data;
      console.log(`Entrada confirmada! 🆗 ID: ${crachaID}`);
      const url = `http://sistemas.9bcomge.eb.mil.br/crachas/cracha.php?movimentacao=${crachaID}&tipo=veiculo&status=Entrada&destino=Residência&obs=`;
      
      fetch(url)
      //não é json
      .then(response => response.ok)
      // perguntar se deseja continuar ou não a entrada
      
      .then(result => {
        console.log('Requisição bem-sucedida:', result);
        // Você pode adicionar qualquer lógica adicional aqui
        return (
          <View>
            <Text>Entrada confirmada! 🆗</Text>
            <Text>ID: {data.data}</Text>
          </View>
        );
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
        return;
      });
      return;
    } else {
      console.log('Entrada já confirmada do crachá ID:', crachaID);
      return;
    }

  }

  return (
    <View style={styles.container}>
      <CameraView 
      style={styles.camera} 
      facing='back'
      barcodeScannerSettings={{barcodeTypes: ["qr"],}}
      onBarcodeScanned={(data) => {
        // confirmar a entrada somente uma vez
        return (
          // modal de entrada confirmada
          <View>
            <Text>Entrada confirmada! 🆗</Text>
            <Text>ID: {data.data}</Text>  
          </View>
        )
        confirmarEntrada(data);
      }
    }
      >
        <View style={styles.buttonContainer}>
            <Text style={styles.text}>ENTRADA</Text>
        </View>
      </CameraView>
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
});