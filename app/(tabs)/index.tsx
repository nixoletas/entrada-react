import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Platform, Image } from 'react-native';

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [messageVisible, setMessageVisible] = useState(false);
  const [movimentacao, setMovimentacao] = useState('entrada');
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
      const url = `http://sistemas.9bcomge.eb.mil.br/crachas/cracha.php?movimentacao=${data.data}&tipo=veiculo&status=${movimentacao}&destino=&obs=`;
      
      setCrachaID(data.data);
      fetch(url)
      //não é json
      .then(response => response.status)
      // perguntar se deseja continuar ou não a entrada
      
      .then(result => {
        console.log('Requisição bem-sucedida:', result);
        // Você pode adicionar qualquer lógica adicional aqui
        setMessageVisible(true);
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
            <Text style={styles.text}>{movimentacao.toString().toUpperCase()}</Text>
        </View>
      </CameraView>
      {messageVisible && (
        <View style={styles.confirmationMessage}>
          <Text style={styles.confirmationText}>{movimentacao.toString().toLocaleUpperCase()} confirmada! 🆗</Text>
          <Text style={styles.confirmationText}>ID: {crachaID}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => {
            setMessageVisible(false) 
            setCrachaID('')
            }}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}

        <View style={styles.typeMessage}>
          {movimentacao === 'entrada' ? (
            <TouchableOpacity style={styles.entradaButton} onPress={() => {
              movimentacao === 'entrada' ? setMovimentacao('saida') : setMovimentacao('entrada');
              }}>
              <Text style={styles.closeButtonText}>{movimentacao.toString().toUpperCase()}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.closeButton} onPress={() => {
              movimentacao === 'entrada' ? setMovimentacao('saida') : setMovimentacao('entrada');
              }}>
              <Text style={styles.closeButtonText}>{movimentacao.toString().toUpperCase()}</Text>
            </TouchableOpacity>
          )
          }
          
        </View>
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
  typeMessage: {
    position: 'absolute',
    bottom: 10,
    left: '20%',
    right: '20%',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
  },
  confirmationMessage: {
    position: 'absolute',
    left: '20%',
    right: '20%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
  },
  confirmationText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FF6347',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  entradaButton: {
    marginTop: 10,
    padding: 10,
    //fundo verde
    backgroundColor: '#008000',
    borderRadius: 5,
  },
});