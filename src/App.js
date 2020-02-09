import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './App.css'
import ImageItem from './imageitem';
import YTVideoItem from './ytvideoitem';

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

  callAPI()
  {
    fetch('https://partyshare-server.herokuapp.com/new_room', {
      method: 'POST'
    })
      .then(resp => resp.text())
      .then(resp => this.setState({room_number : Number(resp)}))
      .then(setTimeout(() => {  this.callResp(); }, 500))
      .then(setTimeout(() => {this.getQueueItem();}, 500))
  }

  componentDidMount()
  {
    this.callAPI();
  }

  render()
  {
    return(
      <div>
      <h1>
      PartyShare
      </h1>
      <h2>
      Room number: {this.state.room_number}
      </h2>
      <div id="action_display">
      </div>
      <div id="queue">
        <h3>
          Queue
        </h3>
      </div>
      </div>
    )
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
        queue_html += "<div id='queue_entry'><img src='" + image_icon + "'></img><h4>Image sent by " + queue_resp[i].user +"</h4></div>";
      }
      else if(queue_resp[i].type == "yt-video")
      {
        queue_html += "<div id='queue_entry'><img src='" + video_icon + "'></img><h4>Youtube Video by " + queue_resp[i].user +"</h4></div>";
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
      ReactDOM.render(<ImageItem user={next_item.user} img_name={next_item.img}/>,document.getElementById("action_display"))
      setTimeout(() => { this.getQueueItem();}, 15000);
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
      document.getElementById("action_display").innerHTML = "<div id='item'><h3>No action is present in the room queue. Add one!</h3></div>"
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
