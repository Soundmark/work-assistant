import { Col, Row } from 'antd';
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import dog from '../../assets/icons/Dog.svg';
import './index.scss';

function Header() {
  const [isMax, setIsMax] = useState(false);

  const minimum = () => {
    ipcRenderer.send('window-min');
  };

  const maximum = () => {
    ipcRenderer.send('window-max');
    setIsMax(!isMax);
  };

  const close = () => {
    ipcRenderer.send('window-close');
  };

  return (
    <Row id="header">
      <Col className="title">
        <img className="icon" src={dog} alt="" />
        work-assistant
      </Col>
      <Col className="drag-section" />
      <Col className="window-control">
        <Row>
          <Col span={8} onClick={minimum}>
            <i className="iconfont iconzuixiaohua" />
          </Col>
          <Col span={8} onClick={maximum}>
            {isMax ? (
              <i className="iconfont iconzuidahua" />
            ) : (
              <i className="iconfont iconzuidahuaxi" />
            )}
          </Col>
          <Col span={8} onClick={close}>
            <i className="iconfont iconguanbi" />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Header;
