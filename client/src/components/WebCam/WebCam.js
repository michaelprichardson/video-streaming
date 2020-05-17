import React, { Component } from 'react';
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

class WebCam extends Component {

  constructor(props) {
    super(props);
    this.videoTag = React.createRef();
    // this.mediaRecorder;
    // this.recordedBlobs = [];
    this.state = {
      buttonText: 'Start Recording',
      recordedBlobs: [],
      mediaRecorder: null
    }

    this.startRecording = this.startRecording.bind(this);
  }

  componentDidMount() {
    // getting access to webcam
    navigator.mediaDevices
    .getUserMedia({video: true})
    .then(stream => {
      this.videoTag.current.srcObject = stream;
      console.log(stream);
    })
    .catch(console.log);
  }

  startRecording() {
    console.log('Starting recording');
    this.state.recordedBlobs = [];
    let options = {mimeType: 'video/webm;codecs=vp9'};
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not Supported`);
      options = {mimeType: 'video/webm;codecs=vp8'};
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not Supported`);
        options = {mimeType: 'video/webm'};
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.error(`${options.mimeType} is not Supported`);
          options = {mimeType: ''};
        }
      }
    }

    console.log(window);

    try {
      this.mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
      console.error('Exception while creating MediaRecorder:', e);
      return;
    }

    console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);
    this.setState({buttonText: 'Stop Recording'});
    this.mediaRecorder.onstop = (event) => {
      console.log('Recorder stopped: ', event);
      console.log('Recorded Blobs: ', this.state.recordedBlobs);
    };
    this.mediaRecorder.ondataavailable = this.handleDataAvailable;
    this.mediaRecorder.start(10); // collect 10ms of data
    console.log('MediaRecorder started', this.mediaRecorder);
  }

  handleDataAvailable(event) {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
      // this.state.recordedBlobs.push(event.data);
      this.setState(state => {
        const recordedBlobs = [...state.recordedBlobs, event.data];

        return { recordedBlobs };
      });
    }
  }

  render() {
    return (
      <div>
        <video id={this.props.id}
          ref={this.videoTag}
          width={1280}
          height={720}
          autoPlay
          title={this.props.title}>
        </video>
        <button onClick={this.startRecording}>{this.state.buttonText}</button>
      </div>
    );
  }
}


export default WebCam;
