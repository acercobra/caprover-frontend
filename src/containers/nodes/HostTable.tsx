import React, { Component } from "react";
import { Table, Icon, message, Modal, Input, Tooltip, Card } from "antd";
import ClickableLink from "../global/ClickableLink";
import Utils from "../../utils/Utils";
import { ColumnProps } from "antd/lib/table";
import {IHostApi, IHostInfo, IHostTypes} from "../../models/IHostInfo";
import digitalOceanLogo from "./hostlogos/digitalocean-logo.png";

const EDITING_MODAL = "EDITING_MODAL";
const DELETING_MODAL = "DELETING_MODAL";
const SPIN_NODE_MODAL = "SPIN_NODE_MODAL";

export default class HostTable extends Component<
  {
    apiData: IHostApi;
    isMobile: boolean;
    updateHost: (host: IHostInfo) => void;
    createHostNode: (host: IHostInfo) => void;
    deleteHost: (hostId: string) => void;
  },
  {
    modalShowing: "EDITING_MODAL" | "DELETING_MODAL" | "SPIN_NODE_MODAL" | undefined;
    hostToUpdate: IHostInfo | undefined;
    hostIdToDelete: string | undefined;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      modalShowing: undefined,
      hostToUpdate: undefined,
      hostIdToDelete: undefined
    };
  }

  deleteHost(id: string) {
    this.setState({
      hostIdToDelete: id,
      modalShowing: DELETING_MODAL
    });
  }

  updateHost(host: IHostInfo) {
    this.setState({
      modalShowing: EDITING_MODAL,
      hostToUpdate: Utils.copyObject(host)
    });
  }

  spinHostNode(host: IHostInfo) {
    this.setState({
      modalShowing: SPIN_NODE_MODAL,
      hostToUpdate: Utils.copyObject(host)
    });
  }

  getCols(): ColumnProps<IHostInfo>[] {
    const self = this;
    const columns = [
      {
        title: "Name",
        dataIndex: "name" as "name"
      },
      {
        title: "Token",
        dataIndex: "token" as "token",
        render: (token: string) => {
          return <span>Edit to see.</span>;
        }
      },
      {
        title: "Type",
        dataIndex: "hostType" as "hostType",
        render: (type: string) => {
            if (type === IHostTypes.DIGITAL_OCEAN_HOST) {
                return <img src={digitalOceanLogo} alt="DigitalOcean" width={50} />;
            }

            return <span>UNKNOWN</span>;
        }
      },
      {
        title: "Actions",
        dataIndex: "id" as "id",
        render: (id: string, host: IHostInfo) => {
          return (
            <span>
              <ClickableLink
                onLinkClicked={() => {
                  self.updateHost(host);
                }}
              >
                <Icon type="form" />
              </ClickableLink>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <ClickableLink
                onLinkClicked={() => {
                  self.spinHostNode(host);
                }}
              >
                <Icon type="cloud" />
              </ClickableLink>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <ClickableLink
                onLinkClicked={() => {
                  self.deleteHost(host.id);
                }}
              >
                <Icon type="delete" />
              </ClickableLink>
            </span>
          );
        }
      }
    ];
    return columns;
  }

  createEditModalContent() {
    const self = this;

    return (
      <div style={{ maxWidth: 360 }}>
        <Input
          addonBefore="Name"
          placeholder="name"
          type="text"
          value={self.state.hostToUpdate!.name}
          onChange={e => {
            const newData = Utils.copyObject(self.state.hostToUpdate!);
            newData.name = e.target.value.trim();
            self.setState({ hostToUpdate: newData });
          }}
        />
        <div style={{ height: 20 }} />
        <Input
          addonBefore="Token"
          placeholder="token"
          defaultValue={self.state.hostToUpdate!.token}
          onChange={e => {
            const newData = Utils.copyObject(self.state.hostToUpdate!);
            newData.token = e.target.value;
            self.setState({ hostToUpdate: newData });
          }}
        />
      </div>
    );
  }

  render() {
    const self = this;
    return (
      <div>
        <Modal
          title="Confirm Create Node"
          okText="Create Node"
          onCancel={() => self.setState({ modalShowing: undefined })}
          onOk={() => {
            self.setState({ modalShowing: undefined });
            self.props.createHostNode(self.state.hostToUpdate!);
          }}
          visible={self.state.modalShowing === SPIN_NODE_MODAL}
        >
          Are you sure you want to create a new node on this host?
          Note you may be charged by the host.
        </Modal>
        <Modal
          title="Confirm Delete"
          okText="Delete Host"
          onCancel={() => self.setState({ modalShowing: undefined })}
          onOk={() => {
            self.setState({ modalShowing: undefined });
            self.props.deleteHost(self.state.hostIdToDelete!);
          }}
          visible={self.state.modalShowing === DELETING_MODAL}
        >
          Are you sure you want to remove this host from your list. You will
          no longer be to create new nodes from it.
        </Modal>
        <Modal
          title="Edit Host"
          okText="Save and Update"
          onCancel={() => self.setState({ modalShowing: undefined })}
          onOk={() => {
            self.setState({ modalShowing: undefined });
            self.props.updateHost(
              Utils.copyObject(self.state.hostToUpdate!)
            );
          }}
          visible={self.state.modalShowing === EDITING_MODAL}
        >
          {self.state.hostToUpdate ? (
            self.createEditModalContent()
          ) : (
            <div />
          )}
        </Modal>
        <div>
          {this.props.isMobile ?
          this.props.apiData.hosts.map(host => (
            <Card
            type="inner"
            key={host.id}
            style={{ marginBottom: 8, wordWrap: "break-word" }}
            title={host.name}
            >
            <div>
              <b>Name: </b>{host.name}
            </div>
            <div>
              <b>Token: </b>Edit to see.
            </div>
            <div>
              <b>Type: </b>{host.hostType}
            </div>
            <div>
              <b>Actions: </b>
              <span>
                <ClickableLink
                  onLinkClicked={() => {
                    self.updateHost(host);
                  }}
                >
                  <Icon type="form" />
                </ClickableLink>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <ClickableLink
                  onLinkClicked={() => {
                    self.spinHostNode(host);
                  }}
                >
                  <Icon type="cloud" />
                </ClickableLink>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <ClickableLink
                  onLinkClicked={() => {
                    self.deleteHost(host.id);
                  }}
                >
                  <Icon type="delete" />
                </ClickableLink>
              </span>
            </div>
          </Card>
          ))
        :
        <Table
          rowKey="id"
          pagination={false}
          columns={this.getCols()}
          dataSource={this.props.apiData.hosts}
        />
        }
        </div>
      </div>
    );
  }
}
