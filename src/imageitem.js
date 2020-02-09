import React, {Component} from 'react';
import './App.css'

class ImageItem extends Component 
{
    state = {}

    getImageFromServer()
    {
        var imgselect = document.getElementById("img");
        fetch('https://partyshare-server.herokuapp.com/get_image/' + this.props.img_name)
            .then(resp => resp.blob())
            .then(function(resp)
            {
                var objectURL = URL.createObjectURL(resp);
                imgselect.src = objectURL;
            })
    }

    componentDidMount()
    {
        this.getImageFromServer()
    }

    render()
    {
        return(
            <div id="item">
            <div id="sentby"><h4>Sent by: </h4> {this.props.user}</div>
            <div id="sent_img">
            <img id="img" src=""></img>
            </div>
            <br></br>
            <h1>{this.props.img_name}</h1>
            </div>);
    }
}

export default ImageItem;
