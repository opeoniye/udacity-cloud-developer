import React from 'react';
import { History } from 'history'
import { Form, Button, Header, Grid, Loader, Image, Message } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { NewsItem } from '../types/News'
import Iroyin from '../types/onenews'
import { getNewsFeedView, editNews, getUploadUrl, uploadFile } from '../api/news-api'
import { apiEndpoint } from '../config'
import Axios from 'axios'


enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditNewsProps {
  auth: Auth;
  history: History;
  match: { 
      isExact: boolean
      params: {
        newsId:string
      },
      path: string,
      url: string,
  }    
}

interface EditNewsState {
  iroyin: Iroyin
  file: any
  loadingNews: boolean
  uploadState: UploadState
}


export class EditNews extends React.PureComponent<EditNewsProps, EditNewsState> {
  constructor(props: EditNewsProps) {
    super(props);
    this.state = {
    iroyin: {
      onenewsId: '',
      onenewsTitle: '',
      onenewsSummary: '',
      onenewsBody: '',
      oneattachmentUrl: '',
      },
    file: undefined,
    loadingNews: true,
    uploadState: UploadState.NoUpload
    }
  }

  onEditNews = async (newsId: string, updatedNews: NewsItem) => {
    try {
      await editNews(this.props.auth.getIdToken(), newsId, updatedNews)
      this.setState({
        //iroyin: this.state.iroyin{}.filter(news => news.newsId !== newsId)
        iroyin: { ...this.state.iroyin }
      })
    } catch {
      alert('News editing failed')
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <Header as="h1">NEWS</Header>

        {this.renderNews()}

      </div>
    )
  }

  renderNews() {
    if (this.state.loadingNews) {
      return this.renderLoading()
    }

    return this.renderEditNewsItem()
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

  /* async componentDidMount() {
  
    try {
      const { Data: iroyin } = await getNewsFeedView(this.props.auth.getIdToken(), this.props.match.params.newsId )
      //const newsItem: NewsItem = Object.entries(newsItemApi);
      console.log('API: ', iroyin)

      const useiroyin = iroyin
      console.log(useiroyin)

      this.setState({ iroyin: new Iroyin(useiroyin.newsId, useiroyin.newsTitle, useiroyin.newsSummary, useiroyin.newsBody),
        loadingNews: false
      },
      () => {
        console.log('STATE: ', this.state.iroyin);
      }) 
    } catch (e: any) {
      alert(`Failed to fetch news: ${e.message}`)
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
            iroyin: new Iroyin(response.data.items.newsId, response.data.items.newsTitle, response.data.items.newsSummary, response.data.items.newsBody, response.data.items.attachmentUrl),
            loadingNews: false
          },
          () => {
            console.log('STATE: ', this.state.iroyin);
          })
        }).catch(function (error) {
            console.log(error);
        })
  } 

  handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
      e.preventDefault();
      this.setState({ iroyin: {...this.state.iroyin, [e.currentTarget.id]: e.currentTarget.value} });
      //this.setValues({ [e.currentTarget.id]: e.currentTarget.value })
  }

  setValues = (news: Iroyin) => {
    this.setState({ iroyin: { ...this.state.iroyin, ...news } });
  }

  handleTextAreaChanges = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    this.setState({ iroyin: {...this.state.iroyin, [e.currentTarget.id]: e.currentTarget.value} });
    //this.setValues({ [e.currentTarget.id]: e.currentTarget.value })
  }

  handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.newsId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e: any) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  renderEditNewsItem() {
    const { iroyin } = this.state
    return (
      
      <div>
      <h2>Edit News Item</h2>

      <Form.Group>
        <Form onSubmit={(e) => {this.handleSubmit(e)}} >
          <Form.Field > 
            <label>Upload News Item Image</label>
            <input
              type="file"
              accept="image/*"
              placeholder="News Image"
              onChange={(e) => this.handleFileChange(e)}
            />
          </Form.Field>
          <Form.Field>
            <label>News Title</label>
            <input id='newsTitle' name='newsTitle' placeholder='News Title' value={iroyin.onenewsTitle} onChange={(e) => this.handleInputChanges(e)} />
          </Form.Field>
          <Form.TextArea
            label='News Summary' id='newsSummary' name='newsSummary' rows="3" placeholder='News Summary' value={iroyin.onenewsSummary} onChange={(e) => this.handleTextAreaChanges(e)} />
          <Form.TextArea id='newsBody' name='newsBody' label='News Content' rows="7" placeholder='News Content' value={iroyin.onenewsBody} onChange={(e) => this.handleTextAreaChanges(e)} />
        
          {this.renderButton()}
        </Form>
      </Form.Group>
      </div>
    )
  }

  renderButton() {
    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Updating News Item</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading image</p>}
        <Button positive loading={this.state.uploadState !== UploadState.NoUpload} type="submit">
          Save
        </Button>
      </div>
    )
  }
}