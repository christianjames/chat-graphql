import React from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import Router from 'next/router'

import { logoutMutation } from './mutations'

const LogoutContainer = ({ children }) => (
  <Mutation mutation={ logoutMutation }>
    { send => (
      <Button icon={ <LogoutIcon /> } onClick={ () => logout(send) } />      
    ) }
  </Mutation>
)
/**
 * Redirect when logout.
 */
const redirect = () => {
  Router.push('/')
  return undefined
}

const logout = ( send ) => {
  send()
    .then(redirect)
    .catch(redirect)
}

LogoutContainer.propTypes = {
  children: PropTypes.func,
}

export default LogoutContainer
