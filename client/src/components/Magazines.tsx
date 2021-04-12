import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createMagazine, deleteMagazine, getMagazines, patchMagazine } from '../api/magazines-api'
import Auth from '../auth/Auth'
import { Magazine } from '../types/Magazine'

interface MagazinesProps {
  auth: Auth
  history: History
}

interface MagazinesState {
  magazines: Magazine[]
  newMagazineName: string
  loadingMagazines: boolean
}

export class Magazines extends React.PureComponent<MagazinesProps, MagazinesState> {
  state: MagazinesState = {
    magazines: [],
    newMagazineName: '',
    loadingMagazines: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newMagazineName: event.target.value })
  }

  onEditButtonClick = (magazineId: string) => {
    this.props.history.push(`/magazines/${magazineId}/edit`)
  }

  onMagazineCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newMagazine = await createMagazine(this.props.auth.getIdToken(), {
        name: this.state.newMagazineName,
        dueDate
      })
      this.setState({
        magazines: [...this.state.magazines, newMagazine],
        newMagazineName: ''
      })
    } catch {
      alert('Magazine creation failed')
    }
  }

  onMagazineDelete = async (magazineId: string) => {
    try {
      await deleteMagazine(this.props.auth.getIdToken(), magazineId)
      this.setState({
        magazines: this.state.magazines.filter(magazine => magazine.magazineId != magazineId)
      })
    } catch {
      alert('Magazine deletion failed')
    }
  }

  onMagazineCheck = async (pos: number) => {
    try {
      const magazine = this.state.magazines[pos]
      await patchMagazine(this.props.auth.getIdToken(), magazine.magazineId, {
        title: magazine.title,
        topic: magazine.topic
      })
    } catch {
      alert('Magazine deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const magazines = await getMagazines(this.props.auth.getIdToken())
      this.setState({
        magazines,
        loadingMagazines: false
      })
    } catch (e) {
      alert(`Failed to fetch magazines: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Magazines</Header>

        {this.renderCreateMagazineInput()}

        {this.renderMagazines()}
      </div>
    )
  }

  renderCreateMagazineInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onMagazineCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderMagazines() {
    if (this.state.loadingMagazines) {
      return this.renderLoading()
    }

    return this.renderMagazinesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Magazines
        </Loader>
      </Grid.Row>
    )
  }

  renderMagazinesList() {
    return (
      <Grid padded>
        {this.state.magazines.map((magazine, pos) => {
          return (
            <Grid.Row key={magazine.magazineId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onMagazineCheck(pos)}
                  checked={magazine.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {magazine.title}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {magazine.topic}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(magazine.magazineId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onMagazineDelete(magazine.magazineId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {magazine.attachmentUrl && (
                <Image src={magazine.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
