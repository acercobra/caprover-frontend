import React, { Component } from "react";
import { connect } from "react-redux";
import AddNode, { INodeToAdd } from "./AddNode";
import { Alert, Row, Col, Divider, message } from "antd";
import ApiComponent from "../global/ApiComponent";
import Toaster from "../../utils/Toaster";
import CenteredSpinner from "../global/CenteredSpinner";
import ErrorRetry from "../global/ErrorRetry";
import {
  IHostApi,
  IHostInfo,
  IHostTypes
} from "../../models/IHostInfo";

class CurrentHosts extends ApiComponent<
  {
    defaultRegistryId: string | undefined;
    isMobile: boolean;
  },
  {
    isLoading: boolean;
    apiData: IHostApi | undefined;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      apiData: undefined,
      isLoading: true,

    };
  }

  fetchData() {
    const self = this;
    self.setState({ apiData: undefined, isLoading: true });
    self.apiManager
      .getAllHosts()
      .then(function(data) {
        self.setState({ apiData: data });
      })
      .catch(Toaster.createCatcher())
      .then(function() {
        self.setState({ isLoading: false });
      });
  }

  addNode(nodeToAdd: INodeToAdd) {
    const self = this;
    self.setState({ apiData: undefined, isLoading: true });
    self.apiManager
      .addDockerNode(
        nodeToAdd.nodeType,
        nodeToAdd.privateKey,
        nodeToAdd.remoteNodeIpAddress,
        nodeToAdd.captainIpAddress
      )
      .then(function() {
        message.success("Node added successfully!");
      })
      .catch(Toaster.createCatcher())
      .then(function() {
        self.fetchData();
      });
  }

  componentDidMount() {
    this.fetchData();
  }

  createNodes() {
    const nodes: any[] = this.state.apiData.hosts || [];

    return nodes.map(node => {
      return (
        <div
          key={node.nodeId}
          style={{
            paddingTop: 15,
            paddingBottom: 20,
            paddingRight: 20,
            paddingLeft: 20,
            marginBottom: 40,
            borderRadius: 5,
            border: "1px solid #dddddd",
            backgroundColor: "#fcfcfc"
          }}
        >
          <Row type="flex" justify="center">
            <b>Node ID:&nbsp;&nbsp;</b> {node.nodeId}
          </Row>
          <hr />
          <div style={{ height: 10 }} />
          <Row>
            <Col lg={{ span: 12 }} xs={{ span: 24 }}>
              <b>Type: </b>
              {node.isLeader ? "Leader (Main Node)" : node.type}
            </Col>
            <Col lg={{ span: 12 }} xs={{ span: 24 }}>
              <b>IP: </b>
              {node.ip}
            </Col>
          </Row>
          <Row>
            <Col lg={{ span: 12 }} xs={{ span: 24 }}>
              <b>State: </b>
              {node.state}
            </Col>
            <Col lg={{ span: 12 }} xs={{ span: 24 }}>
              <b>Status: </b>
              {node.status}
            </Col>
          </Row>
          <br />
          <Row>
            <Col lg={{ span: 12 }} xs={{ span: 24 }}>
              <b>RAM: </b>
              {(node.memoryBytes / 1073741824).toFixed(2)} GB
            </Col>
            <Col lg={{ span: 12 }} xs={{ span: 24 }}>
              <b>OS: </b>
              {node.operatingSystem}
            </Col>
          </Row>
          <Row>
            <Col lg={{ span: 12 }} xs={{ span: 24 }}>
              <b>CPU: </b>
              {(node.nanoCpu / 1000000000).toFixed(0)} cores
            </Col>
            <Col lg={{ span: 12 }} xs={{ span: 24 }}>
              <b>Architecture: </b>
              {node.architecture}
            </Col>
          </Row>
          <br />
          <Row>
            <Col lg={{ span: 12 }} xs={{ span: 24 }}>
              <b>Hostname: </b>
              {node.hostname}
            </Col>
            <Col lg={{ span: 12 }} xs={{ span: 24 }}>
              <b>Docker Version: </b>
              {node.dockerEngineVersion}
            </Col>
          </Row>
        </div>
      );
    });
  }

  render() {
    const self = this;
    if (this.state.isLoading) {
      return <CenteredSpinner />;
    }

    if (!this.state.apiData) {
      return <ErrorRetry />;
    }

    return (
      <div>
        <div
            style={{ textAlign: "center" }}
            className={
              this.state.apiData.registries.length === 0 ? "" : "hide-on-demand"
            }
        >
          <Alert
              type="info"
              message="No hosts is added yet. Go ahead and add your first host!"
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    defaultRegistryId: state.registryReducer.defaultRegistryId,
    isMobile: state.globalReducer.isMobile
  };
}

export default connect(mapStateToProps)(CurrentHosts);
