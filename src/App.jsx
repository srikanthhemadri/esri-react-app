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

  getSubLayers(lyrObj, lvlCount) {
    //console.log(JSON.stringify(lyrObj));
    var lyrArray = [];
    lyrArray = lyrObj.sublayers.toArray().map((subLayer) => {
      var tmp = {};
      tmp["level" + lvlCount] = subLayer;
      tmp["sublevel" + lvlCount] = [];
      if (subLayer.sublayers && subLayer.sublayers.length > 0) {
        tmp["sublevel" + lvlCount] = this.getSubLayers(subLayer, lvlCount + 1);
      }
      return tmp;
    });
    return lyrArray;
  }

  handleMapLoad(map, view) {
    this.setState({ map, view });

    var layerObj = [];

    map.layers.toArray().forEach((layer) => {
      if (layer.type === "map-image") {
        var lvlCount = 0;
        var temp = {};
        temp["level" + lvlCount] = layer;
        temp["sublevel" + lvlCount] = [];
        lvlCount++;

        if (layer.sublayers.length > 0) {
          temp["sublevel" + (lvlCount - 1)] = this.getSubLayers(
            layer,
            lvlCount
          );
        }
        layerObj.push(temp);
      }
    });

    // this.setState({
    //   layerList: this.layerListTree(layerObj, 0),
    // });

    this.setState({
      layerList: <LayerList LayerObject={layerObj} LevelCount="0"></LayerList>,
    });
  }

  layerListTree(layerObj, lvlcount) {
    //console.log(JSON.stringify(layerObj));
    return (
      <Accordion>
        {layerObj.length > 0
          ? layerObj.map((lyr) => {
              return (
                <>
                  <Accordion.Item eventKey={lyr["level" + lvlcount]["id"]}>
                    <Accordion.Header>
                      <ListGroupItem key={lyr["level" + lvlcount]["id"]}>
                        <Button
                          onClick={() => {
                            //alert(item);
                            lyr["level" + lvlcount]["visible"] =
                              !lyr["level" + lvlcount]["visible"];
                          }}
                        >
                          {"OP : " + lyr["level" + lvlcount]["title"]}
                        </Button>
                      </ListGroupItem>
                    </Accordion.Header>
                    <Accordion.Body>
                      {lyr["sublevel" + lvlcount] &&
                      lyr["sublevel" + lvlcount].length > 0
                        ? lyr["sublevel" + lvlcount].map((item) => {
                            return (
                              <>
                                {item["sublevel" + (lvlcount + 1)] &&
                                item["sublevel" + (lvlcount + 1)].length > 0 ? (
                                  this.layerListTree(item, lvlcount + 1)
                                ) : (
                                  <ListGroupItem
                                    key={item["level" + (lvlcount + 1)].id}
                                  >
                                    <Button
                                      onClick={() => {
                                        //alert(item);
                                        item["level" + (lvlcount + 1)].visible =
                                          !item["level" + (lvlcount + 1)]
                                            .visible;
                                      }}
                                    >
                                      {item["level" + (lvlcount + 1)].title}
                                    </Button>
                                  </ListGroupItem>
                                )}
                              </>
                            );
                          })
                        : ""}
                    </Accordion.Body>
                  </Accordion.Item>
                </>
              );
            })
          : ""}
      </Accordion>
    );
  }

  render() {
    return (
      <div className="App">
        <div className="LayerListCSS">
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

class LayerList extends React.Component {
  // layerObj;
  // lvlCount;

  constructor(props) {
    super(props);

    this.layerObj = this.props.LayerObject;
    this.lvlcount = parseInt(this.props.LevelCount);
  }

  render() {
    console.log(this.lvlcount + "  --  " + JSON.stringify(this.layerObj));
    return (
      <Accordion>
        {this.layerObj.length > 0
          ? this.layerObj.map((lyr) => {
              return (
                <>
                  <Accordion.Item eventKey={lyr["level" + this.lvlcount]["id"]}>
                    <Accordion.Header>
                      <ListGroupItem key={lyr["level" + this.lvlcount]["id"]}>
                        <Button
                          onClick={() => {
                            //alert(item);
                            lyr["level" + this.lvlcount]["visible"] =
                              !lyr["level" + this.lvlcount]["visible"];
                          }}
                        >
                          {"OP : " + lyr["level" + this.lvlcount]["title"]}
                        </Button>
                      </ListGroupItem>
                    </Accordion.Header>
                    <Accordion.Body>
                      {(lyr["sublevel" + this.lvlcount] &&
                      lyr["sublevel" + this.lvlcount].length) > 0
                        ? lyr["sublevel" + this.lvlcount].map((item) => {
                            return (
                              <>
                                {(item["sublevel" + (this.lvlcount + 1)] &&
                                item["sublevel" + (this.lvlcount + 1)].length) >
                                  0 ? (
                                  <LayerList
                                    LayerObject={[item]}
                                    LevelCount={this.lvlcount + 1}
                                  ></LayerList>
                                ) : (
                                  <ListGroupItem
                                    key={item["level" + (this.lvlcount + 1)].id}
                                  >
                                    <Button
                                      onClick={() => {
                                        //alert(item);
                                        item[
                                          "level" + (this.lvlcount + 1)
                                        ].visible =
                                          !item["level" + (this.lvlcount + 1)]
                                            .visible;
                                      }}
                                    >
                                      {
                                        item["level" + (this.lvlcount + 1)]
                                          .title
                                      }
                                    </Button>
                                  </ListGroupItem>
                                )}
                              </>
                            );
                          })
                        : "Empty1"}
                    </Accordion.Body>
                  </Accordion.Item>
                </>
              );
            })
          : "Empty"}
      </Accordion>
    );
  }
}
