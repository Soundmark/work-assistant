import { Layout, Menu } from 'antd';
import React, { useEffect } from 'react';
import { Link, Route, Switch, useHistory } from 'react-router-dom';
import routeConfig from '../routes/index';
import './index.scss';

const { Sider, Content } = Layout;

function Index() {
  const history = useHistory();
  useEffect(() => {
    history.push('/colorpicker');
  }, []);
  return (
    <Layout>
      <Sider>
        <Menu mode="vertical" defaultSelectedKeys={['/colorpicker']}>
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
