import React, { Component } from "react";
import { Icon, Button, message, Modal, Row, Alert } from "antd";
import ApiComponent from "../global/ApiComponent";
import CenteredSpinner from "../global/CenteredSpinner";
import Toaster from "../../utils/Toaster";

export default class BackupCreator extends ApiComponent<
  {},
  {
    isLoading: boolean;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  onCreateBackupClicked() {
    const self = this;
    self.setState({ isLoading: true });
    self.apiManager
      .createBackup()
      .then(function(data) {
        let link = document.createElement("a"); //create 'a' element
        link.setAttribute(
          "href",
          self.apiManager.getApiBaseUrl() +
            "/downloads/?namespace=captain&downloadToken=" +
            encodeURIComponent(data.downloadToken)
        ); //replace "file" with link to file you want to download
        link.click(); //virtually click <a> element to initiate download

        message.success("Downloading backup started...");
      })
      .catch(Toaster.createCatcher())
      .then(function() {
        self.setState({ isLoading: false });
      });
  }

  render() {
    const self = this;

    if (self.state.isLoading) {
      return <CenteredSpinner />;
    }

    return (
      <div>
        <p>
          Create a backup of CapRover configs in order to be able to spin up a
          clone of this server. Note that your application data (volumes, and
          images) are not part of this backup. This backup only includes the
          server configuration details, such as root domains, app names, SSL
          certs and etc.
        </p>
        <p>
          See the documents for more details on how to restore your server using
          the backup file.
        </p>
        <p>Note that this is, currently, an EXPERIMENTAL FEATURE.</p>
        <br />

        <Row type="flex" justify="end">
          <Button type="primary" onClick={() => this.onCreateBackupClicked()}>
            <span>
              <Icon type="cloud-download" />
            </span>{" "}
            &nbsp; Create Backup
          </Button>
        </Row>
      </div>
    );
  }
}