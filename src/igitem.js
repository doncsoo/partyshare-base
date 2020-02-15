import React, {Component} from 'react';
import './App.css'

class ImageItem extends Component 
{
    state = {}

    componentDidMount()
    {
        this.getImageFromServer()
    }

    render()
    {
        return(
            <div id="item">
            <div id="download"><h3>Downloading image...</h3></div>
            <div id="sent_img" style={{display: "none"}}>
            <div id="sentby"><h4>Sent by: </h4> {this.props.user}</div>
            <img id="img" src=""></img>
            <br></br>
            <h1>{this.props.img_name}</h1>
            </div>
            </div>);
    }
}

export default ImageItem;
