import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './App.css'
import ImageItem from './imageitem';
import YTVideoItem from './ytvideoitem';
import bg from './video/bg_loop.mp4';
import logo from './partysharelogo.png';
import qr from './qrcode.png';

import image_icon from './image.png'
import video_icon from './videologo.png'

class App extends Component 
{

  state = {}

  constructor(props)
  {
    super();
    this.state = ({room_number : -1})
    this.getQueueItem = this.getQueueItem.bind(this);
  }

  getRoomCredentials()
  {
    if(localStorage.getItem("RoomNumber"))
    {
      console.log(localStorage.getItem("RoomNumber"))
      this.setState({room_number : Number(localStorage.getItem("RoomNumber"))})
      document.getElementById("rid").innerHTML = "Room ID : " + localStorage.getItem("RoomNumber")
      setTimeout(() => {  this.callResp(); }, 500)
      setTimeout(() => {this.getQueueItem();}, 500)
    }
    else this.callAPI()
  }

  async callAPI()
  {
    await fetch('https://partyshare-server.herokuapp.com/new_room', {
      method: 'POST'
    })
      .then(resp => resp.text())
      .then(resp => this.setState({room_number : Number(resp)}))
      .then(setTimeout(() => {  this.callResp(); }, 500))
      .then(setTimeout(() => {this.getQueueItem();}, 500))
    localStorage.setItem("RoomNumber",this.state.room_number)
    document.getElementById("rid").innerHTML = "Room number: " + this.state.room_number
  }

  componentDidMount()
  {
    window.addEventListener("resize",this.checkDisplaySize)
    this.checkDisplaySize();
    this.getRoomCredentials();
  }

  render()
  { 
    return(
      <div>
      <video autoPlay muted loop id="myVideo">
      <source src={bg} type="video/mp4"/>
      </video>
      <div id="main">
      <img id="logo" width="200" height="115" src={logo} alt="Logo"></img>
      <h1 id="rid">
      Fetching room...
      </h1>
      <div id="action_display">
      </div>
      <div id="queue">
      <div>
        <h3>
          Queue
        </h3>
      </div>
      </div>
      </div>
      <div style={{display : "none"}} id="screenwarning">
      <label id="warn">PartyShare requires 1280x800 resolution. Please switch to a device with bigger screen size, or resize the windows if possible.</label>
      </div>
      </div>
    )
  }

  checkDisplaySize()
  {
    if(window.innerWidth < 1280 || window.innerHeight < 800)
    {
      document.getElementById("main").style.display = "none"
      document.getElementById("screenwarning").style.display = "block"
    }
    else
    {
      document.getElementById("main").style.display = "block"
      document.getElementById("screenwarning").style.display = "none"
    }
  }

  callResp()
  {
    this.produceQueue()
    setTimeout(() => {  this.callResp(); }, 2000);
  }

  async produceQueue()
  {
    var queue_html = "<h3>Queue</h3>"
    if(this.state.room_number == -1) return
    var queue_resp = await fetch('https://partyshare-server.herokuapp.com/get_queue/' + this.state.room_number)
      .then(resp => resp.json())
    for(var i = 0; i < queue_resp.length; i++)
    {
      if(queue_resp[i].type == "image")
      {
        queue_html += "<div id='queue_entry'><img src='" + image_icon + "'></img><h4>Image sent by " + queue_resp[i].user +"</h4></div><br></br>";
      }
      else if(queue_resp[i].type == "yt-video")
      {
        queue_html += "<div id='queue_entry'><img src='" + video_icon + "'></img><h4>Youtube Video by " + queue_resp[i].user +"</h4></div><br></br>";
      }
    }
    document.getElementById("queue").innerHTML = queue_html
  }

  async getQueueItem()
  {
    if(this.state.room_number == -1)
    {
      setTimeout(() => {  this.getQueueItem(); }, 500);
      return
    }
    var next_item = await fetch('https://partyshare-server.herokuapp.com/room_queue_item_pop/' + this.state.room_number,
    {
      method: 'POST'
    })
      .then(resp => resp.json())
    ReactDOM.unmountComponentAtNode(document.getElementById("action_display"))
    if(document.getElementById("item") != undefined)
    {
      document.getElementById("item").remove();
    }
    if(next_item.type == "image")
    {
      ReactDOM.render(<ImageItem user={next_item.user} img_name={next_item.img} continue={this.getQueueItem}/>,document.getElementById("action_display"))
      this.produceQueue();
    }
    else if(next_item.type == "yt-video")
    {
      var parent = React.createRef()
      ReactDOM.render(<YTVideoItem user={next_item.user} vid_id={next_item.id} continue={this.getQueueItem}/>,document.getElementById("action_display"))
      this.produceQueue();
    }
    else if(next_item.type == "none")
    {
      var no_item_html = 
      <div id="item">
      <img width="300" height="300" src={qr} alt="Logo"></img>
      <h1>Upload your stuff now at <b>partyshare-client.herokuapp.com</b>!</h1>
      </div>
      ReactDOM.render(no_item_html,document.getElementById("action_display"))
      //document.getElementById("action_display").innerHTML = "<div id='item'><h3>No action is present in the room queue. Add one!</h3></div>"
      setTimeout(() => {  this.getQueueItem(); }, 1000);
    }
    else
    {
      document.getElementById("action_display").innerHTML = "<div id='item'><h3>This action is unsupported at the moment!</h3></div>"
    }
    
  }

  continue()
  {
    console.log("Continuing")
    this.getQueueItem()
  }
}

export default App;
