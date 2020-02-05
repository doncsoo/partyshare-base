import React, {Component} from 'react';
import YouTube from 'react-youtube';
import './App.css'

class YTVideoItem extends Component
{

    state = {}
    constructor()
    {
        super()
        this.state = ({called_end : false})
        this.removeCheck = this.removeCheck.bind(this);
        console.log("Rendering YT video")
    }
    render()
    {
        const opts = {
            height: '390',
            width: '640',
            playerVars: { 
              autoplay: 1
        } }

        return(
            <div id="item">
            <div id="sentby"><h4>Sent by: </h4> {this.props.user}</div>
            <YouTube videoId={this.props.vid_id} opts={opts} onStateChange={this.removeCheck}/>
            </div>
        )
    }

    removeCheck(event)
    {
        if(event.target.getPlayerState() == 0)
        {
            this.props.continue()
        }
    }
}

export default YTVideoItem;