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
import HostAdd from "./HostAdd";
import DefaultDockerRegistry from "./DefaultDockerRegistry";
import DockerRegistryTable from "./DockerRegistryTable";
import {IRegistryInfo, IRegistryTypes} from "../../models/IRegistryInfo";
import HostTable from "./HostTable";

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

  addHost(hostToAdd: IHostInfo) {
    const self = this;
    self.setState({ apiData: undefined, isLoading: true });
    self.apiManager
      .addHost(hostToAdd)
      .then(function() {
        message.success("Host added successfully!");
      })
      .catch(Toaster.createCatcher())
      .then(function() {
        self.fetchData();
      });
  }

  updateHost(host: IHostInfo) {
    const self = this;
    self.setState({ apiData: undefined, isLoading: true });
    self.apiManager
        .updateHost(host)
        .then(function() {
          message.success("Host updated successfully!");
        })
        .catch(Toaster.createCatcher())
        .then(function() {
          self.fetchData();
        });
  }

  createHostNode(host: IHostInfo) {
    const self = this;
    self.setState({ apiData: undefined, isLoading: true });
    self.apiManager
      .createHostNode(host)
      .then(function() {
        message.success("Host Node created successfully!");
      })
      .catch(Toaster.createCatcher())
      .then(function() {
        self.fetchData();
      });
  }

  deleteHost(hostId: string) {
    const self = this;
    this.setState({ apiData: undefined, isLoading: true });
    self.apiManager
        .deleteHost(hostId)
        .then(function() {
          message.success("Host deleted successfully!");
        })
        .catch(Toaster.createCatcher())
        .then(function() {
          self.fetchData();
        });
  }

  componentDidMount() {
    this.fetchData();
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
              this.state.apiData.hosts.length === 0 ? "" : "hide-on-demand"
            }
        >
          <Alert
              type="info"
              message="No hosts is added yet. Go ahead and add your first host!"
          />
        </div>
        <div
            className={
              this.state.apiData.hosts.length > 0 ? "" : "hide-on-demand"
            }
        >
          <HostTable
              apiData={self.state.apiData!}
              isMobile={this.props.isMobile}
              deleteHost={id => {
                self.deleteHost(id);
              }}
              updateHost={host => {
                self.updateHost(host);
              }}
              createHostNode={host => {
                self.createHostNode(host);
              }}
          />
        </div>
        <div style={{ height: 50 }} />
        <HostAdd
            apiData={self.state.apiData!}
            addHost={host => self.addHost(host)}
            isMobile={this.props.isMobile}
         />
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
