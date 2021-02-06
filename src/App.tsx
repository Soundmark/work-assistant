import { Button, Layout, Menu } from 'antd';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ColorPicker from './pages/ColorPicker/index';
import 'antd/dist/antd.css';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function App() {
  return (
    <Router>
      <Layout>
        <Sider>
          <Menu mode="horizontal">
            {/* <SubMenu> */}
            <Menu.Item key="1">option1</Menu.Item>
            <Menu.Item key="2">option2</Menu.Item>
            <Menu.Item key="3">
              <Button>222</Button>
            </Menu.Item>
            {/* </SubMenu> */}
          </Menu>
        </Sider>
      </Layout>
      <Switch>
        <Route path="/" component={ColorPicker} />
      </Switch>
    </Router>
  );
}
