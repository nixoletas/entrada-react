import { CameraView, useCameraPermissions } from 'expo-camera';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Overlay } from '../Overlay';

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
      const cracha = `http://sistemas.9bcomge.eb.mil.br/crachas/cracha2.php?id=${data.data}`;
      let tipo = '';
      setCrachaID(data.data);

      fetch(cracha)
        .then(response => response.json())
        .then(result => {
          tipo = result;
          console.log(tipo);
          setMessageVisible(true);
        })
        .then(() => {
          const url = `http://sistemas.9bcomge.eb.mil.br/crachas/cracha.php?movimentacao=${data.data}&tipo=${tipo}&status=${movimentacao}&destino=&obs=`;
          fetch(url)
            .then(response => response.status)
            .then(result => {
              console.log(url);
              setMessageVisible(true);
            })
            .catch(error => {
              console.error('Erro na requisição:', error);
            });
        });
    } else {
      return;
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing='back'
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={(data) => {
          confirmarEntrada(data);
        }}
      >
        <View style={styles.buttonContainer}>
          <Text style={styles.text}>{movimentacao.toString().toUpperCase()}</Text>
        </View>
        <Overlay />
      </CameraView>
      {messageVisible && (
        <View style={styles.confirmationMessage}>
          <Text style={styles.confirmationText}>{movimentacao.toString().toLocaleUpperCase()} confirmada! 🆗</Text>
          <Text style={styles.confirmationText}>ID: {crachaID}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => {
            setMessageVisible(false);
            setCrachaID('');
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
        )}
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
    backgroundColor: '#008000',
    borderRadius: 5,
  },
});