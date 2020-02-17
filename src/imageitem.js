import React, {Component} from 'react';
import './App.css'

class ImageItem extends Component 
{
    state = {}

    async getImageFromServer()
    {
        var imgselect = document.getElementById("img");
        await fetch('https://partyshare-server.herokuapp.com/get_image/' + this.props.img_name)
            .then(resp => resp.blob())
            .then(function(resp)
            {
                var objectURL = URL.createObjectURL(resp);
                imgselect.src = objectURL;
            })
        setTimeout(() => {  this.props.continue(); }, 15000)
        document.getElementById("sent_img").style.display = "block"
        document.getElementById("download").innerHTML = ""
    }

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
            <h1>{this.props.desc}</h1>
            </div>
            </div>);
    }
}

export default ImageItem;
