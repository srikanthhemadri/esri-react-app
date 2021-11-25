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
    lyrArray = lyrObj.sublayers
      .toArray()
      .reverse()
      .map((subLayer) => {
        var tmp = {};
        tmp["level" + lvlCount] = subLayer;
        tmp["sublevel" + lvlCount] = [];
        if (subLayer.sublayers && subLayer.sublayers.length > 0) {
          tmp["sublevel" + lvlCount] = this.getSubLayers(
            subLayer,
            lvlCount + 1
          );
        }
        return tmp;
      });
    return lyrArray;
  }

  handleMapLoad(map, view) {
    this.setState({ map, view });

    var layerObj = [];

    map.layers
      .toArray()
      .reverse()
      .forEach((layer) => {
        //if (layer.type === "map-image") {
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
        //}
      });

    this.setState({
      layerList: <LayerList LayerObject={layerObj} LevelCount="0"></LayerList>,
    });
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

    this.state = {
      buttonvariant: "primary",
    };

    this.layerObj = this.props.LayerObject;
    this.lvlcount = parseInt(this.props.LevelCount);
  }

  render() {
    console.log(this.lvlcount + "  --  " + JSON.stringify(this.layerObj));
    return (
      <div class="accordion" id={"level" + this.lvlcount + "root"}>
        {this.layerObj.length > 0
          ? this.layerObj.map((lyr) => {
              return (
                <>
                  <div class="accordion-item">
                    <h2
                      class="accordion-header"
                      id={"lvl" + lyr["level" + this.lvlcount]["id"] + "head"}
                    >
                      <div
                        class="accordion-button collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target={
                          "#" +
                          "lvl" +
                          lyr["level" + this.lvlcount]["id"] +
                          "body"
                        }
                        aria-expanded="false"
                        aria-controls={
                          "lvl" + lyr["level" + this.lvlcount]["id"] + "body"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                      >
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            e.nativeEvent.stopImmediatePropagation();
                            //alert(item);
                            lyr["level" + this.lvlcount]["visible"] =
                              !lyr["level" + this.lvlcount]["visible"];
                            this.setState({
                              buttonvariant: lyr["level" + this.lvlcount][
                                "visible"
                              ]
                                ? "primary"
                                : "outline-primary",
                            });
                          }}
                          variant={
                            lyr["level" + this.lvlcount]["visible"]
                              ? "primary"
                              : "outline-dark"
                          }
                          size="sm"
                        >
                          {"OP : " + lyr["level" + this.lvlcount]["title"]}
                        </Button>
                      </div>
                    </h2>
                    <div
                      id={"lvl" + lyr["level" + this.lvlcount]["id"] + "body"}
                      class="accordion-collapse collapse"
                      aria-labelledby={
                        "lvl" + lyr["level" + this.lvlcount]["id"] + "head"
                      }
                    >
                      <div class="accordion-body">
                        {(lyr["sublevel" + this.lvlcount] &&
                          lyr["sublevel" + this.lvlcount].length) > 0
                          ? lyr["sublevel" + this.lvlcount].map((item) => {
                              return (
                                <>
                                  {(item["sublevel" + (this.lvlcount + 1)] &&
                                    item["sublevel" + (this.lvlcount + 1)]
                                      .length) > 0 ? (
                                    <LayerList
                                      LayerObject={[item]}
                                      LevelCount={this.lvlcount + 1}
                                    ></LayerList>
                                  ) : (
                                    <ListGroupItem
                                      key={
                                        item["level" + (this.lvlcount + 1)].id
                                      }
                                    >
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          e.preventDefault();
                                          e.nativeEvent.stopImmediatePropagation();
                                          //alert(item);
                                          item[
                                            "level" + (this.lvlcount + 1)
                                          ].visible =
                                            !item["level" + (this.lvlcount + 1)]
                                              .visible;
                                          this.setState({
                                            buttonvariant: item[
                                              "level" + (this.lvlcount + 1)
                                            ]["visible"]
                                              ? "primary"
                                              : "outline-primary",
                                          });
                                        }}
                                        variant={
                                          item["level" + (this.lvlcount + 1)][
                                            "visible"
                                          ]
                                            ? "primary"
                                            : "outline-dark"
                                        }
                                        size="sm"
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
                      </div>
                    </div>
                  </div>
                </>
              );
            })
          : "Empty"}
      </div>
    );
  }
}
