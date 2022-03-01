import { History } from 'history'
import * as React from 'react'
import { Button, Divider, Grid, Header, Image, Loader, Segment, Container } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import Iroyin from '../types/onenews'
import { apiEndpoint } from '../config'
import Axios from 'axios'

interface ViewNewsProps {
  auth: Auth
  history: History
  match: {
    params: {
      newsId: string
    }
  }
}

interface ViewNewsState {
  viewnews: Iroyin
  loadingNews: boolean
}

export class ViewNews extends React.PureComponent<ViewNewsProps, ViewNewsState> {
  state: ViewNewsState = {
    viewnews: {
      onenewsId: '',
      onenewsTitle: '',
      onenewsSummary: '',
      onenewsBody: '',
      oneattachmentUrl: '',
      },
    loadingNews: true
  }

  onButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.props.history.push('/')
  }

  /* async componentDidMount() {
    try {
      const onenews = await getNewsFeedView(this.props.auth.getIdToken(), this.props.match.params.newsId)
      let viewnews = []
      viewnews.push(onenews)
      console.log(viewnews)
      
      this.setState({
        //viewnews: new Iroyin(viewnews.newsId, viewnews.Data.items.newsTitle, viewnews.Data.items.newsSummary, viewnews.Data.items.newsBody),
        viewnews,
        loadingNews: false
      }, 
      () => {
        console.log('STATE: ', this.state.viewnews);
      })
    } catch (e: any) {
      alert(`Failed to fetch news:` + e.message)
    }
  } */

  async componentDidMount() {
    const idToken = this.props.auth.getIdToken()
    const newsid = this.props.match.params.newsId
    const response = await Axios.get(`${apiEndpoint}/news/${newsid}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      }
      })
      .then(response => {
          this.setState({ 
            viewnews: new Iroyin(response.data.items.newsId, response.data.items.newsTitle, response.data.items.newsSummary, response.data.items.newsBody, response.data.items.attachmentUrl),
            loadingNews: false
          },
          () => {
            console.log('STATE: ', this.state.viewnews);
          })
        }).catch(function (error) {
            console.log(error);
        })
  } 

  render() {
    return (
      <div>
        <Header as="h1">NEWS</Header>
        <Divider />

        {this.renderViewNews()}
      </div>
    )
  }

  renderViewNews() {
    if (this.state.loadingNews) {
      return this.renderLoading()
    }

    return this.renderNews()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading News
        </Loader>
      </Grid.Row>
    )
  }

  renderNews() {
    const { viewnews } = this.state
    return (
      <div>
      <Container fluid>
        <Header as='h2'>{viewnews.onenewsTitle}</Header>
        <Image src={viewnews.oneattachmentUrl} size='medium' centered />

        <p>
          {viewnews.onenewsBody}
        </p>

        <p>
          {this.renderBackButton()}
        </p>
      </Container>
      </div>
    )
  }

  renderBackButton() {

    return (
      <div>
        <Segment>
          <Grid>
            <Grid.Column textAlign="center">
              <Button onClick={this.onButtonClick} positive type="submit"> All News</Button>
            </Grid.Column>
          </Grid>
        </Segment>
      </div>
    )
  }
}
