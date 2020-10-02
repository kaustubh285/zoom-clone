const socket = io();
let myVideoStream;

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: 443,
});

// Get the video and audio from the browser
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, myVideoStream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
    let text = $("input");

    $("html").keydown((e) => {
      if (e.which == 13 && text.val().length !== 0) {
        socket.emit("SentMessage", text.val());
        text.val("");
      }
    });
    socket.on("createMessage", (message) => {
      $("ul").append(`<li class="messages"><b>User</b><br />${message}</li>`);
      scrollToBottom();
    });
  });

socket.emit("join-room", ROOM_ID);

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.appendChild(video);
};

const scrollToBottom = () => {
  var d = $(".main__chatWindow");
  d.scrollTop(d.prop("scrollHeight"));
};

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setMuteButton = () => {
  const html = '<i class="fas fa-microphone"></i><span>Mute</span>';

  document.querySelector(".Microphone").innerHTML = html;
};

const setUnmuteButton = () => {
  const html =
    '<i class="fas fa-microphone-slash unmute"></i><span>Unmute</span>';

  document.querySelector(".Microphone").innerHTML = html;
};

const muteUnmuteVideo = () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setUnmuteVideoButton();
  } else {
    setMuteVideoButton();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const setMuteVideoButton = () => {
  const html = '<i class="fas fa-video"></i><span>Stop Video</span>';

  document.querySelector(".VideoCamera").innerHTML = html;
};

const setUnmuteVideoButton = () => {
  const html =
    '<i class="fas fa-video-slash unmute"></i><span>Start Video</span>';

  document.querySelector(".VideoCamera").innerHTML = html;
};
