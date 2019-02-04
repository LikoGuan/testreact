import React, { Component } from "react";
import Alert from "react-s-alert";

import IconButton from "../../components/IconButton";
import PermissionCheck from "../../components/PermissionCheck";
import Modal from "../../modals";
import OrgForm from "../../forms/Org";
import api from "../../api";

class Org extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
      modal: false
    };
    this.onHide = this.onHide.bind(this);
    this.onChangeOrg = this.onChangeOrg.bind(this);
  }
  async componentDidMount() {
    const { data } = await api.me.org.get();
    if (data.code === 0) {
      this.setState({
        data
      });
    }
  }
  async onChangeOrg(form) {
    const { data } = await api.me.org.update(form);
    if (data.code === 0) {
      this.setState({
        modal: false,
        data: form
      });
      Alert.success("Succeeded");
    } else {
      Alert.warning("Failed, Please try it later");
    }
  }
  onHide() {
    this.setState({
      modal: false
    });
  }
  render() {
    let {
      name,
      phone,
      email,
      street,
      suburb,
      city,
      zipcode,
      country
    } = this.state.data;
    return (
      <div>
        <div className="page-header lat-page-header">
          <p>Organisation Details</p>
          <div className="lat-header-op">
            <PermissionCheck permission="ORG_OPERATE">
              <IconButton
                type="primary"
                icon="edit"
                onClick={() => this.setState({ modal: true })}
              >
                Edit
              </IconButton>
            </PermissionCheck>
          </div>
        </div>
        <div className="lat-table">
          <table className="table  table-hover ">
            <tbody>
              <tr>
                <td>Name</td>
                <td>{name}</td>
              </tr>
              <tr>
                <td>Phone</td>
                <td>{phone}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{email}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>
                  {street && street}
                  {suburb && (
                    <span>
                      <br />
                      {suburb}
                    </span>
                  )}

                  {(city || zipcode) && (
                    <span>
                      <br />
                      {city} {zipcode}
                    </span>
                  )}

                  {country && (
                    <span>
                      <br />
                      {country}
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Modal
          show={this.state.modal}
          onHide={this.onHide}
          title="Organisation"
        >
          <OrgForm
            onSubmit={this.onChangeOrg}
            initialValues={this.state.data}
          />
        </Modal>
      </div>
    );
  }
}

export default Org;
