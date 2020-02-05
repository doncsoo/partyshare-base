import React, {Component} from 'react';
import './App.css'

class ImageItem extends Component 
{
    state = {}

    getImageFromServer()
    {
        var imgselect = document.getElementById("img");
        fetch('https://warm-reef-48121.herokuapp.com/get_image/' + this.props.img_name)
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
            <div id="sent_img">
            <img id="img" src=""></img>
            </div>
            <br></br>
            <h1>{this.props.img_name}</h1>
            </div>);
    }
}

export default ImageItem;
