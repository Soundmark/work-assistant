import { Layout, Menu } from 'antd';
import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import routeConfig from '../routes/index';
import './index.scss';

const { Sider, Content } = Layout;

function Index() {
  return (
    <Layout>
      <Sider>
        <Menu mode="vertical">
          {routeConfig.map((item) => (
            <Menu.Item key={item.path}>
              <Link to={item.path}>
                <i className={`iconfont ${item.icon}`} />
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Content>
        <Switch>
          <Route path="/" component={routeConfig[0].component} exact />
          {routeConfig.map((item) => (
            <Route
              key={item.path}
              path={item.path}
              component={item.component}
              exact
            />
          ))}
        </Switch>
      </Content>
    </Layout>
  );
}

export default Index;
