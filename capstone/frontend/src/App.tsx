import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { AddNews } from './components/AddNews'
import { ViewNews } from './components/ViewNews'
import { EditNews } from './components/EditNews'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { News } from './components/News'
import logo from './logo.svg';

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu stackable>
        <Menu.Item>
          <img alt="logo" src={logo} />
        </Menu.Item>

        <Menu.Item name="home">
          <Link to="/">Triple Love News</Link>
        </Menu.Item>

        <Menu.Item name="add">
          <Link to="/news/add">Add News</Link>
        </Menu.Item>

        <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
      )
    } else {
      return (
        <Menu stackable>
        <Menu.Item>
          <img alt="logo" src={logo} />
        </Menu.Item>

        <Menu.Item name="home">
          <Link to="/">Triple Love News</Link>
        </Menu.Item>

        <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
        </Menu>
      )
    }
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Logout
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Login
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Switch>
          <Route
            path="/"
            exact
            render={props => {
              return <News {...props} auth={this.props.auth} />
            }}
          />

          <Route
            path="/news/add"
            exact
            render={props => {
              return <AddNews {...props} auth={this.props.auth} />
            }}
          />  

          <Route
            path="/news/:newsId/view"
            exact
            render={props => {
              return <ViewNews {...props} auth={this.props.auth} />
            }}
          />

          <Route
            path="/news/:newsId/edit"
            exact
            render={props => {
              return <EditNews {...props} auth={this.props.auth} />
            }}
          />

          <Route 
            component={NotFound} 
          />
        </Switch>
      )

    } else {
        return (
          <LogIn auth={this.props.auth} />

        )
    }
  }
}


/** 
  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <News {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/news/:newsId/edit"
          exact
          render={props => {
            return <EditNews {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }

      <Switch>
        <Route
          path="/news"
          exact
          render={props => {
            return <News {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/news/:newsId/view"
          exact
          render={props => {
            return <News {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>

*/