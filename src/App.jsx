import React, { useRef, useEffect } from "react";
import { Button, ListGroup, ListGroupItem, Accordion } from "react-bootstrap";

import { WebMap } from "@esri/react-arcgis";
import { loadModules, setDefaultOptions } from "esri-loader";
import "./App.css";

setDefaultOptions({ css: true });

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      view: null,
      layerList: [],
    };

    this.handleMapLoad = this.handleMapLoad.bind(this);
  }

  handleMapLoad(map, view) {
    this.setState({ map, view });

    var layerObj = [];

    map.layers.toArray().forEach((layer) => {
      if (layer.type === "map-image") {
        var temp = { oplevel: layer, sublevel: [] };

        layer.allSublayers.toArray().forEach((subLayer) => {
          temp.sublevel.push(subLayer);
        });
        layerObj.push(temp);
        console.log(JSON.stringify(layerObj));
      }
    });

    this.setState({
      layerList: (
        <ListGroup>
          {layerObj.length > 0
            ? layerObj.map((lyr) => {
                return (
                  <>
                    <ListGroupItem key={lyr.oplevel.id}>
                      <Button
                        onClick={() => {
                          //alert(item);
                          lyr.oplevel.visible = !lyr.oplevel.visible;
                        }}
                      >
                        {lyr.oplevel.title}
                      </Button>
                    </ListGroupItem>
                    {lyr.sublevel.map((item) => {
                      return (
                        <ListGroupItem key={item.id}>
                          <Button
                            onClick={() => {
                              //alert(item);
                              item.visible = !item.visible;
                            }}
                          >
                            {item.title}
                          </Button>
                        </ListGroupItem>
                      );
                    })}
                  </>
                );
              })
            : ""}
        </ListGroup>
      ),
    });
  }

  render() {
    return (
      <div className="App">
        <div className="LayerList">
          <ListGroup>{this.state.layerList}</ListGroup>
        </div>
        <WebMap
          id="a0e4e55b82aa49739dbd0d061d29fc8f"
          onLoad={this.handleMapLoad}
        />
      </div>
    );
  }
}
