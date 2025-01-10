import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [messageVisible, setMessageVisible] = useState(false);
  const [movimentacao, setMovimentacao] = useState('entrada');
  const [crachaID, setCrachaID] = useState('');
  const [requestOptions, setRequestOptions] = useState({
    ID: '',
    tipo: '',
    status: '',
    foto: '',
    pg: '',
    nome: '',
    fabricante: '',
    modelo: '',
    placa: '',
    eb: '',
    descricao: ''
  });

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

  // const confirmarEntrada = (data: any) => {
  //   if (crachaID != data.data) {
  //     const cracha = `http://sistemas.9bcomge.eb.mil.br/crachas/cracha3.php?id=${data.data}`;
  //     let tipo = '';
  //     setCrachaID(data.data);
  //     let dados = data.data;
  //     console.log(dados.nome);

  //     fetch(cracha)
  //       .then(response => response.json())
  //       .then(result => {
  //         tipo = result;
  //         setMessageVisible(true);
  //         console.log(result);
  //       })
  //       .then(() => {
  //         const url = `http://sistemas.9bcomge.eb.mil.br/crachas/cracha.php?movimentacao=${data.data}&tipo=${tipo}&status=${movimentacao}&destino=&obs=`;
  //         setRequestOptions({
  //           ID: data.data,
  //           tipo: tipo,
  //           status: movimentacao,
  //         });
  //         fetch(url)
  //         .then(response => response.status)
  //         .then(result => {
  //           setMessageVisible(true);
  //         })
  //         .catch(error => {
  //           console.error('Erro na requisição:', error);
  //         });
  //       });
  //   }
  // };

  const obterDados = (data: any) => {
    if (crachaID != data.data) {
      const cracha = `http://sistemas.9bcomge.eb.mil.br/crachas/cracha3.php?id=${data.data}`;
      let tipo = '';
      let pg = '';
      let nome = '';
      let foto = '';
      let fabricante = '';
      let modelo = '';
      let placa = '';
      let eb = '';
      let descricao = '';

      setCrachaID(data.data);
      console.log(data.data);
      fetch(cracha)
        .then(response => response.json())
        .then(result => {
          tipo = result.tipo;
          pg = result.pg;
          nome = result.nome;
          foto = result.foto;
          fabricante = result.fabricante;
          modelo = result.modelo;
          placa = result.placa;
          eb = result.eb_vtr;
          descricao = result.descr_vtr;
          console.log(result);
          setMessageVisible(true);
        })
        .then(() => {
          const url = `http://sistemas.9bcomge.eb.mil.br/crachas/cracha.php?movimentacao=${data.data}&tipo=${tipo}&status=${movimentacao}&destino=&obs=`;
          setRequestOptions({
            ID: data.data,
            tipo: tipo,
            status: movimentacao,
            foto: `http://10.56.19.173/formtools/upload/${foto}`,
            pg: pg,
            nome: nome,
            fabricante: fabricante,
            modelo: modelo,
            placa: placa,
            eb: eb,
            descricao: descricao
          });
          fetch(url)
          .then(response => response.status)
          .then(result => {
            setMessageVisible(true);
          })
          .catch(error => {
            console.error('Erro na requisição:', error);
          });
        });
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing='back'
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={(data) => {
          obterDados(data);
        }}
      >
        <View style={styles.buttonContainer}>
          <Text style={styles.text}>{movimentacao.toString().toUpperCase()}</Text>
        </View>
      </CameraView>
      {messageVisible && (
        <View style={styles.confirmationMessage}>
          <Text style={styles.confirmationText}>{movimentacao.toString().toLocaleUpperCase()} confirmada! ✅</Text>
          <Text style={styles.divider}></Text>
          <Text style={styles.confirmationText}>Status: {requestOptions.status.toUpperCase()}</Text>
          <Text style={styles.confirmationText}>Tipo: {requestOptions.tipo.toUpperCase()}</Text>
          {(() => {
            switch (requestOptions.tipo) {
              case 'pessoa':
                return(
                  <>
                  <Text style={styles.confirmationText}>{requestOptions.pg} {requestOptions.nome}</Text>
          <Image
            source={{uri: requestOptions.foto}}
            style={{width: 120, height: 150, alignContent: 'center', justifyContent: 'center', alignSelf: 'center'}}
          />
                  </>
                );
              case 'veiculo':
                return(
                  <>
                  <Text style={styles.divider}></Text>
                  <Text style={styles.confirmationText}>Modelo: {requestOptions.fabricante} {requestOptions.modelo}</Text>
                  <Text style={styles.confirmationText}>Placa: {requestOptions.placa}</Text>
                  </>
                );
              case 'viatura':
                return(
                  <>
                  <Text style={styles.divider}></Text>
                  <Text style={styles.confirmationText}>EB: {requestOptions.eb}</Text>
                  <Text style={styles.confirmationText}>{requestOptions.descricao}</Text>
                  </>
                );
              default:
                return <Text style={styles.confirmationText}>Entrada Civil - Obra ou Outros</Text>;
            }
          })()}
          <TouchableOpacity style={styles.closeButton} onPress={() => {
            setMessageVisible(false);
            setCrachaID('');
            setRequestOptions({ ID: '', tipo: '', status: '', pg: '', nome: '', foto: '', fabricante: '', modelo: '', placa: '', eb: '', descricao: '' });
          }}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.typeMessage}>
        {movimentacao === 'entrada' ? (
          <TouchableOpacity style={styles.entradaButton} onPress={() => {
            movimentacao === 'entrada' ? setMovimentacao('saida') : setMovimentacao('entrada');
            setMessageVisible(false);
            setCrachaID('');
          }}>
            <Text style={styles.closeButtonText}>{movimentacao.toString().toUpperCase()}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.saidaButton} onPress={() => {
            movimentacao === 'entrada' ? setMovimentacao('saida') : setMovimentacao('entrada');
            setMessageVisible(false);
            setCrachaID('');
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
    bottom: 24,
    left: '20%',
    right: '20%',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
  },
  confirmationMessage: {
    position: 'absolute',
    left: '15%',
    right: '15%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
  },
  confirmationText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 10,
  },

  closeButton: {
    marginTop: 10,
    padding: 15,
    //background white
    backgroundColor: '#3545A7',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  entradaButton: {
    marginTop: 15,
    padding: 30,
    backgroundColor: '#008000',
    borderRadius: 5,
  },
  saidaButton: {
    marginTop: 15,
    padding: 30,
    backgroundColor: '#CC0000',
    borderRadius: 5,
  },
});