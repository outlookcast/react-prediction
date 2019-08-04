import React, { Component } from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Input } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const axios = require('axios');

const URL_API_BASE = 'https://analisenoticiasapi20190803054511.azurewebsites.net';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fomr1: '',
      form2: '',
      valor: false,
      openModalResponse: false,
      comentarioResponse: '',
      probabilidadeResponse: null,
      resultadoResponse: null
    }
  }

  handleChange1 = (event) => {
    this.setState({
      fomr1: event.target.value,
    });
  };

  handleClick = () => {
    console.log(this.state.fomr1);
    axios({
      method: 'get',
      url: URL_API_BASE + '/api/Prediction' + `?comentario=${this.state.fomr1}`,
      responseType: 'stream'
    })
      .then((response) => {
        
        this.setState({
          comentarioResponse: response.data.comentario,
          resultadoResponse: response.data.predicao ? 'POSITIVA': 'NEGATIVA',
          probabilidadeResponse: (response.data.probabilidade * 100).toFixed(2) + '%'
        }
        , () => {
          this.handleOpen();
        });

      });
  };

  handleClose = () => {
    this.setState({
      openModalResponse: false
    })
  };

  handleOpen = () => {
    this.setState({
      openModalResponse: true
    })
  };

  renderModal() {
    return (
      <Dialog
        open={this.state.openModalResponse}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Resultado da predição</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Comentário: {this.state.comentarioResponse}
            <br />
            Notícia é: {this.state.resultadoResponse}
            <br />
            Probabilidade: {this.state.probabilidadeResponse}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    );
  }


  render() {
    return (
      <div>
        <header className="App-header">
          <h5 style={{ margin: '0' }}>Predições</h5>
          <h6>Aplicativo para tentar prever se uma notícia é positiva ou negativa :)</h6>
          <Card style={{ width: '300px' }}>
            <CardContent>
              <Typography variant="h5" component="h2">
                Obter Predição
              </Typography>
              <Typography variant="body2" component="p">
                Digite um título de notícia:
              <Input value={this.state.fomr1} onChange={this.handleChange1} style={{ width: '100%' }} />
                <Button onClick={this.handleClick} style={{ marginTop: '30px' }} variant="contained" color="secondary">Enviar</Button>
              </Typography>
            </CardContent>
          </Card>
        </header>

        {this.renderModal()}
      </div>
    );
  }
}

export default App;
