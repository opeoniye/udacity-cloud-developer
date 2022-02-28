//import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import { Button, Form, Header } from 'semantic-ui-react'
import { addNews } from '../api/news-api'
import Auth from '../auth/Auth'

interface AddNewsProps {
  auth: Auth
  history: History
}

interface AddNewsState {
  newNewsTitle: string
  newNewsSummary: string
  newNewsBody: string
  uploadingNews: boolean
}

export class AddNews extends React.PureComponent<AddNewsProps, AddNewsState> {
  state: AddNewsState = {
    newNewsTitle: '',
    newNewsSummary: '',
    newNewsBody: '',
    uploadingNews: false
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newNewsTitle: event.target.value })
  }

  handleSubmit = () => {
    document.querySelectorAll('input')
    this.setState({
      newNewsTitle: '',
      newNewsSummary: '',
      newNewsBody: '',
    })
  }

  handleTextChange1 = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ newNewsSummary: event.target.value })
  }

  handleTextChange2 = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ newNewsBody: event.target.value })
  }

  onAddNews = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      if (!this.state.newNewsTitle || !this.state.newNewsSummary || !this.state.newNewsBody) {
        alert('News Title, News Summary and New content should be provided')
        return
      }
      this.setUploadState(true)
      const newNews = await addNews(this.props.auth.getIdToken(), {
        newsTitle: this.state.newNewsTitle,
        newsSummary: this.state.newNewsSummary,
        newsBody: this.state.newNewsBody
      })
      console.log('Adding new News', newNews)
      alert('News item added successfully!')
    } catch (e: any) {
      alert('Add news failed: ' + e.message)
    } finally {
      this.setUploadState(false)
      this.handleSubmit()
    }
  }

  setUploadState(uploadingNews: boolean) {
    this.setState({
      uploadingNews
    })
  }

  render() {
    return (
      <div>
        <Header as="h1">NEWS</Header>

        {this.renderAddNewsInput()}

      </div>
    )
  }

  renderAddNewsInput() {
    return (
      <div>
        <h2>Add News Item</h2>

        <Form onSubmit={this.onAddNews}>
          <Form.Field>
            <label>News Title</label>
            <input placeholder='News Title' value={this.state.newNewsTitle} onChange={this.handleNameChange} />
          </Form.Field>
          <Form.TextArea label='News Summary' placeholder='News Summary' rows="3" value={this.state.newNewsSummary} onChange={this.handleTextChange1} />
          <Form.TextArea label='News Content' placeholder='Add News content here...' rows="7" value={this.state.newNewsBody} onChange={this.handleTextChange2} />

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {
    return (
      <div>
        <Button
          positive
          loading={this.state.uploadingNews}
          type="submit"
        >
          Add News Item
        </Button>
      </div>
    )
  }
}
