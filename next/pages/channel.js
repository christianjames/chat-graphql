/**
 * This is the page rendered when inside a chat room.
 */

import React from 'react'
import PropTypes from 'prop-types'
import styled, { injectGlobal } from 'styled-components'
import Link from 'next/link'
import md5 from 'blueimp-md5'

import { HashLoader } from 'react-spinners'
import App from 'grommet/components/App'
import ChatIcon from 'grommet/components/icons/base/Chat'
import RefreshIcon from 'grommet/components/icons/base/Refresh'
import AddCircleIcon from 'grommet/components/icons/base/Add'
import UserIcon from 'grommet/components/icons/base/User'
import Split from 'grommet/components/Split'
import Sidebar from 'grommet/components/Sidebar'
import Header from 'grommet/components/Header'
import Footer from 'grommet/components/Footer'
import Title from 'grommet/components/Title'
import Box from 'grommet/components/Box'
import Menu from 'grommet/components/Menu'
import Anchor from 'grommet/components/Anchor'
import Button from 'grommet/components/Button'
import Paragraph from 'grommet/components/Paragraph'
import Label from 'grommet/components/Label'
import Animate from 'grommet/components/Animate'
import Image from 'grommet/components/Image'

import bootstrap from 'app/lib/bootstrap'
import TextInput from 'app/modules/form/components/TextInput'
import CustomScroll from 'app/modules/form/components/CustomScroll'

import LogoutContainer from 'app/modules/auth/containers/LogoutContainer'

const StyledRoomHeader = styled(Header)`
  border-bottom: 1px solid #ddd;
`

const StyledMessage = styled(Paragraph)`
  margin: 0;
`

const StyledAuthor = styled(Label)`
  margin: 0;
`

const StyledTextInput = styled(TextInput)`
  width: 100%;
`

const AddChannelButton = styled(Button)`
  margin-left: auto;
`
const GlobalStyle = injectGlobal`
  html {
    overflow-y: auto;
  }
`
const LoadingComponent = () => (
  <Box full='vertical' justify='center' align='center'>
    <HashLoader color='#e02438' loading />
  </Box>
)

import CurrentUserContainer from 'app/modules/auth/containers/CurrentUserContainer'
import ChannelsContainer from 'app/modules/channel/containers/ChannelsContainer'
import MessagesContainer from 'app/modules/channel/containers/MessagesContainer'
import NewMessageContainer from 'app/modules/channel/containers/NewMessageContainer'
import NewChannelContainer from 'app/modules/channel/containers/NewChannelContainer'

const ChatRoom = ({ url, url: { query: { channel = 'general' } } }) => {
  
  let scrollRef = null;

  const setScrollRef = element => {
    scrollRef = element;
  };

  const redirectToChannel = (channel) => {
    Router.push('/channel', `/messages/${channel}`)
    return undefined
  }

  return (
    <CurrentUserContainer>
      { ({ user }) => (
        <ChannelsContainer>
          { ({ loading, channels }) => (
            (loading && !channels.length) ? <LoadingComponent /> : (
              <App centered={ false }>
                <Split fixed={false} flex='right'>
                  <Sidebar colorIndex='neutral-1'>
                    <Header pad='medium'>
                      <Title>
                        TallerChat <ChatIcon />
                      </Title>

                      <NewChannelContainer channels={ channels }>
                        { create => (
                          <AddChannelButton
                            icon={ <AddCircleIcon /> }
                            onClick={ () => create(
                              window.prompt('Name your new channel')
                            ) }
                          />
                        ) }
                      </NewChannelContainer>
                    </Header>

                    <Box flex='grow' justify='start'>
                      <Menu primary>
                        { channels.map(({ name }) => (
                          <Link key={ name } prefetch href={ `/messages/${name}` }>
                            <Anchor className={ channel === name ? 'active' : '' }>
                              # <b>{ name }</b>
                            </Anchor>
                          </Link>
                        )) }
                      </Menu>
                    </Box>

                    <Footer pad='medium'>
                      <Button icon={ <UserIcon /> } onClick={ console.log } />
                      <LogoutContainer />
                    </Footer>
                  </Sidebar>

                  { !user || !user.uid ? (
                    <LoadingComponent />
                  ) : (                  
                      <MessagesContainer channel={ channels.find(({ name }) => name === channel) }>
                        { ({ loading, refetch, messages }) => (
                          <Box full='vertical'>
                            <StyledRoomHeader pad={ { vertical: 'small', horizontal: 'medium' } } justify='between'>
                              <Title>
                                { '#' + channel }
                              </Title>

                              <Button icon={ <RefreshIcon /> } onClick={ () => refetch() } />
                            </StyledRoomHeader>

                            <CustomScroll>
                              <Box pad='medium' flex='grow'>
                                { loading ? 'Loading...' : (
                                  messages.length === 0 ? 'No one talking here yet :(' : (
                                    messages.map(({ id, author, message }) => (
                                      <Animate visible={true} key={ id } enter={{"animation": "fade", "duration": 1000, "delay": 0}}
                                        keep={true}>
                                        <Box pad='small' credit={ author }>
                                          <Box flex direction='row' align='center'>
                                            <Image style={{marginRight: '10px'}} size="thumb" src={`https://www.gravatar.com/avatar/${md5(author.mail)}`}/>
                                            <Label>{ author.name }</Label>
                                          </Box>
                                          <StyledMessage>{ message }</StyledMessage>
                                        </Box>
                                      </Animate>
                                      
                                    ))
                                  )
                                ) }
                              </Box>
                            </CustomScroll>

                            <Box pad='medium' direction='column'>
                              { user && user.uid ? (
                                <NewMessageContainer
                                  user={ user }
                                  channel={ channels.find(({ name }) => name === channel) }
                                >
                                  { ({ handleSubmit }) => (
                                    <form onSubmit={ handleSubmit }>
                                      <NewMessageContainer.Message
                                        placeHolder='Message #general'
                                        component={ StyledTextInput }
                                      />
                                    </form>
                                  ) }
                                </NewMessageContainer>
                              ) : (
                                'Log in to post messages'
                              ) }
                            </Box>
                          </Box>
                        ) }
                      </MessagesContainer>
                  ) }

                </Split>
              </App>
            )
          ) }
        </ChannelsContainer>
      ) }
    </CurrentUserContainer>
  )
}

ChatRoom.propTypes = {
  url: PropTypes.object.isRequired,
}

export default bootstrap(ChatRoom)
