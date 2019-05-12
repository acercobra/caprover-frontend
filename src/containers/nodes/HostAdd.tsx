import React, { Component } from "react";
import { Button, Row, Modal, Input, Tooltip, Icon } from "antd";
import {
  IHostInfo,
  IHostTypes,
  IHostApi
} from "../../models/IHostInfo";
import Utils from "../../utils/Utils";
import PasswordField from "../global/PasswordField";

const ADDING_DIGITAL_OCEAN = "ADDING_DIGITAL_OCEAN_HOST"

export default class HostAdd extends Component<
  {
    apiData: IHostApi;
    addHost: (hostInfo: IHostInfo) => void;
    isMobile: boolean;
  },
  {
    modalShowing: "ADDING_DIGITAL_OCEAN_HOST" | undefined;
    hostToAdd: IHostInfo;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      modalShowing: undefined,
      hostToAdd: this.getPlainHostInfo()
    };
  }

  getPlainHostInfo(): IHostInfo {
    return {
      id: "",
      name: "",
      token: "",
      hostAuthClientId: "",
      hostAuthRedirectUri: "",
      hostAuthType: "",
      hostAuthState: "",
      hostAuthScope: "",
      hostType: IHostTypes.DIGITAL_OCEAN_HOST
    };
  }

  render() {
    const self = this;

    return (
      <div>
        <Modal
          title="Digital Ocean Host"
          okText="Add Host Info"
          onCancel={() => self.setState({ modalShowing: undefined })}
          onOk={() => {
            self.setState({ modalShowing: undefined });
            self.props.addHost(self.state.hostToAdd);
          }}
          visible={ self.state.modalShowing === "ADDING_DIGITAL_OCEAN_HOST" }
        >
          <p>
            You can create new api token from the Digital Ocean Control Panel. Go to
            "API >> Token/Keys >> Personal Access Tokens" and create a new token.
            Allow Read and Write Scope.
          </p>
          <div style={{ height: 20 }} />
          <div style={{ maxWidth: 360 }}>
            <Input
              addonBefore="Name"
              placeholder="token name"
              type="text"
              value={self.state.hostToAdd.name}
              onChange={e => {
               const newData = Utils.copyObject(
                self.state.hostToAdd
               );
               newData.name = e.target.value.trim();
                self.setState({ hostToAdd: newData });
              }}
            />
            <div style={{ height: 20 }} />
            <Input
              addonBefore="Token"
              placeholder="personal access token"
              type="text"
              value={self.state.hostToAdd.token}
              onChange={e => {
                const newData = Utils.copyObject(
                  self.state.hostToAdd
                );
                newData.token = e.target.value.trim();
                self.setState({ hostToAdd: newData });
              }}
            />
          </div>
        </Modal>
        <div style={{ height: 20 }} />
        <Row type="flex" justify="end">
          <Button
            block={this.props.isMobile}
            onClick={() =>
              self.setState({
                modalShowing: ADDING_DIGITAL_OCEAN,
                hostToAdd: self.getPlainHostInfo()
              })
            }
          >
            Add DigitalOcean Host
          </Button>
        </Row>
      </div>
    );
  }
}
