import { History } from 'history'
import * as React from 'react'
import { Button, Divider, Grid, Header, Item, Loader } from 'semantic-ui-react'
import { getNewsFeedUser, deleteNews  } from '../api/news-api'
import Auth from '../auth/Auth'
import { NewsItem } from '../types/News'

interface NewsProps {
  auth: Auth
  history: History
}

interface NewsState {
  allNews: NewsItem[]
  loadingNews: boolean
}

export class News extends React.PureComponent<NewsProps, NewsState> {
  state: NewsState = {
    allNews: [],
    loadingNews: true
  }

  onReadButtonClick = (newsId: string) => {
    this.props.history.push(`/news/${newsId}/view`)
  }

  onEditButtonClick = (newsId: string) => {
    this.props.history.push(`/news/${newsId}/edit`)
  }

  onAddButtonClick = () => {
    this.props.history.push(`/news/add`)
  }

  onDeleteNews = async (newsId: string) => {
    try {
      await deleteNews(this.props.auth.getIdToken(), newsId)
      this.setState({
        allNews: this.state.allNews.filter(news => news.newsId !== newsId)
      })
    } catch {
      alert('News deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const allNews = await getNewsFeedUser(this.props.auth.getIdToken())
      console.log('API: ', allNews)

      this.setState({
        allNews,
        loadingNews: false
      }, () => {
        console.log('STATE: ', this.state.allNews)
      })
    } catch (e: any) {
      alert('Failed to fetch news: ' + e.message)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">TRIPLE LOVE NEWS</Header>

        {this.renderAddNewsButton()}

        {this.renderNews()}
      </div>
    )
  }

  renderAddNewsButton() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <div>
            <Button positive onClick={this.onAddButtonClick}>Add News</Button>
          </div>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderNews() {
    if (this.state.loadingNews) {
      return this.renderLoading()
    }

    return this.renderNewsList()
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

  renderNewsList() {
    return (
      
      <div>
        <h2>Latest News...</h2>
        <Item.Group relaxed>
          {this.state.allNews.map((newsItem) => {
            return (
              <Item key={newsItem.newsId}>
                <Item.Image src={newsItem.attachmentUrl} />

                <Item.Content verticalAlign='middle'>
                  <Item.Header as='a' href={`/news/${newsItem.newsId}/view`} > {newsItem.newsTitle}</Item.Header>
                  <Item.Description>{newsItem.newsSummary}</Item.Description>
                  <Item.Extra>
                    <Button onClick={() => this.onDeleteNews(newsItem.newsId)} basic color='red' floated='right'>Delete</Button>
                    <Button onClick={() => this.onEditButtonClick(newsItem.newsId)} basic color='blue' floated='right'>Edit</Button>
                    <Button onClick={() => this.onReadButtonClick(newsItem.newsId)} basic color='green' floated='right'>Read</Button>
                  </Item.Extra>
                </Item.Content>
              </Item>
            )
          })}  
        </Item.Group>
      </div>
    )
  }

  /* calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  } */
}
