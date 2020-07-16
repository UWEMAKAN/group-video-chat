import React, { Component, createRef } from 'react';
import io from 'socket.io-client';
import Window from '../Window/Window';

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.localVideo = createRef();
    this.remoteVideos = createRef([]);
    this.remoteVideo1 = createRef();
    this.remoteVideo1.current = {};
    this.remoteVideo2 = createRef();
    this.remoteVideo2.current = {};
    this.remoteVideo3 = createRef();
    this.remoteVideo3.current = {};
    this.socket = createRef();
    this.peers = createRef([]);
    this.peerConnections = createRef([]);
    this.localICECandidates = createRef({});
    this.connectionStatuses = createRef({});
    this.roomId = props.match.params.roomID;
  }

  state = {
    localStream: null,
    remoteStreams: [],
    offers: [],
    token: null
  };

  componentDidMount() {
    this.peers.current = [];
    this.peerConnections.current = [];
    this.remoteVideos.current = [];
    this.connectionStatuses.current = {};
    this.localICECandidates.current = {};
    this.socket.current = io.connect('https://signals-server.herokuapp.com');
    // this.socket.current = io.connect('http://localhost:8000');
    navigator.mediaDevices
      .getUserMedia({
        video: {
          height: window.innerHeight / 2,
          width: window.innerWidth / 2
        },
        audio: true
      })
      .then((stream) => {
        this.onMediaStream(stream);
      })
      .catch((err) => {
        alert('Your browser does not support WebRTC');
      });
  }

  onMediaStream = (stream) => {
    this.setState((prevState) => ({
      ...prevState,
      localStream: stream
    }));
    this.localVideo.current.srcObject = stream;
    this.localVideo.current.volume = 0;
    this.socket.current.emit('join room', this.roomId);
    this.socket.current.on('token', this.onToken);
    this.socket.current.on('offer', this.onOffer);
    this.socket.current.on('all users', this.onAllUsers);
    this.socket.current.on('new user', this.onNewUser);
    this.socket.current.on('answer', this.onAnswer);
  };

  onAnswer = (answer) => {
    console.log('answer received');
    const response = JSON.parse(answer);
    console.log(response);
    const rtcSession = new RTCSessionDescription(response.answer);
    const { peerConnection } = this.peerConnections.current.filter((p) => p.id === response.id)[0];
    peerConnection.setRemoteDescription(rtcSession);
    this.connectionStatuses.current[response.id] = true;
    console.log('local ICE Candidates', this.localICECandidates.current);
    let candidate = this.localICECandidates.current[response.id];
    console.log('logging candidate', candidate);
    this.socket.current.emit('candidate', JSON.stringify({ id: response.id, candidate }));
    console.log('candidate emitted');
  };

  onOffer = (offer) => {
    console.log('offer received');
    const offering = JSON.parse(offer);
    console.log(offering);
    console.log(this.peerConnections.current.filter((p) => p.id === offering.id));
    this.createAnswer(offering)();
  };

  onToken = (token) => {
    this.setState((prevState) => ({
      ...prevState,
      token
    }));
    this.socket.current.on('candidate', this.onCandidate);
  };

  createAnswer = (offering) => () => {
    console.log('creating answer');
    this.connectionStatuses.current[offering.id] = true;
    const rtcSession = new RTCSessionDescription(offering.offer);
    console.log('rtcSesstionDescription ', rtcSession);
    const { peerConnection } = this.peerConnections.current.filter((p) => p.id === offering.id)[0];
    peerConnection.setRemoteDescription(rtcSession);
    peerConnection.createAnswer(
      (answer) => {
        console.log('answer created', answer);
        peerConnection.setLocalDescription(answer);
        console.log('local description set');
        const response = { id: offering.id, answer };
        this.socket.current.emit('answer', JSON.stringify(response));
        console.log('answer emitted');
      },
      (err) => {
        console.log(err);
      }
    );
  };

  createOffer = (peerConnection, peer) => {
    peerConnection.createOffer(
      (offer) => {
        peerConnection.setLocalDescription(offer);
        const offering = { id: peer.userId, offer };
        this.socket.current.emit('offer', JSON.stringify(offering));
        console.log('offer emitted');
      },
      (err) => {
        console.log(err);
      }
    );
  };

  onAllUsers = (users) => {
    users.forEach((user) => {
      this.peers.current.push({ userId: user });
      this.connectionStatuses.current[user] = false;
    });
    if (this.peers.current.length > 0) {
      this.peers.current.forEach((peer) => {
        const peerConnection = this.createPeerConnection(peer);
        this.createOffer(peerConnection, peer);
        console.log('offer created');
        this.peerConnections.current.push({ id: peer.userId, peerConnection });
      });
      console.log('all users peerConnections updated');
    }
  };

  onNewUser = (user) => {
    console.log('new user');
    const peer = { userId: user };
    this.peers.current.push(peer);
    this.connectionStatuses.current[user] = false;
    const peerConnection = this.createPeerConnection(peer);
    this.peerConnections.current.push({ id: peer.userId, peerConnection });
    console.log('new user peerConnections updated');
  };

  createPeerConnection = (peer) => {
    const rtcConnection = this.createConnection();
    const peerConnection = this.addStreamToPeerConnection(rtcConnection);
    const connection = this.addEventListenersToPeerConnection(peerConnection, peer);
    return connection;
  };

  createConnection = () => {
    const peerConnection = new RTCPeerConnection({
      iceServers: this.state.token.iceServers
    });
    return peerConnection;
  };

  addStreamToPeerConnection = (peerConnection) => {
    peerConnection.addStream(this.state.localStream);
    return peerConnection;
  };

  addEventListenersToPeerConnection = (peerConnection, peer) => {
    peerConnection.onaddstream = (event) => {
      let remoteVideo = createRef();
      remoteVideo.current = {};
      remoteVideo.current.srcObject = event.stream;
      this.remoteVideos.current.push({ id: peer.userId, remoteVideo });
      this.setState((prevState) => ({
        ...prevState,
        remoteStreams: [...prevState.remoteStreams, { key: peer.userId, remoteStream: event.stream }]
      }));
      console.log('remote videos updated');
    };
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const candidate = { id: peer.userId, candidate: event.candidate };
        const connected = this.connectionStatuses.current[peer.userId];
        if (connected) {
          this.socket.current.emit('candidate', JSON.stringify(candidate));
          console.log('candidate emitted');
        } else {
          this.localICECandidates.current[peer.userId] = candidate.candidate;
        }
      }
    };
    return peerConnection;
  };

  onCandidate = (candidate) => {
    console.log('candidate received');
    const receivedCandidate = JSON.parse(candidate);
    console.log(receivedCandidate);
    const rtcCandidate = new RTCIceCandidate(receivedCandidate.candidate);
    console.log('rtcCandidate', rtcCandidate);
    const { peerConnection } = this.peerConnections.current.filter((p) => receivedCandidate.id === p.id)[0];
    peerConnection.addIceCandidate(rtcCandidate);
    console.log(this.remoteVideos.current);
  };

  render() {
    const { remoteStreams } = this.state;
    const length = remoteStreams.length;
    let keys = [];
    if (length) {
      if (length === 1) {
        this.remoteVideo1.current.srcObject = remoteStreams[0].remoteStream;
        keys.push(remoteStreams[0].key);
      } else if (length === 2) {
        this.remoteVideo1.current.srcObject = remoteStreams[0].remoteStream;
        this.remoteVideo2.current.srcObject = remoteStreams[1].remoteStream;
        keys.push(remoteStreams[0].key);
        keys.push(remoteStreams[1].key);
      } else if (length === 3) {
        this.remoteVideo1.current.srcObject = remoteStreams[0].remoteStream;
        this.remoteVideo2.current.srcObject = remoteStreams[1].remoteStream;
        this.remoteVideo3.current.srcObject = remoteStreams[2].remoteStream;
        keys.push(remoteStreams[0].key);
        keys.push(remoteStreams[1].key);
        keys.push(remoteStreams[2].key);
      }
    }

    return (
      <Window
        localVideo={this.localVideo}
        keys={keys}
        remoteVideos={[this.remoteVideo1, this.remoteVideo2, this.remoteVideo3]}
      />
    );
  }
}

export default ChatRoom;
