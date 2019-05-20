import React from 'react'
import { func } from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

const mutation = gql`
  mutation CreateChannel ($name: String!) {
    createTaxonomyTermChannel (input: { name: $name }) {
      violations {
        message
        path
        code
      }
      errors
      entity {
        entityId
      }
    }
  }
`

const createSlug = (str = '') => {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();
  
  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to   = "aaaaeeeeiiiioooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
  str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }
  
  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
  .replace(/\s+/g, '-') // collapse whitespace and replace by -
  .replace(/-+/g, '-'); // collapse dashes
  
  return str;

} ;

const normalizeChanneName = (name) => {
  const nameNormalized = createSlug(name)
  return { variables: { name: nameNormalized } }
}
// @TODO: implement optimistic query on channels?

const NewMessageContainer = ({ children }) => (
  <Mutation mutation={ mutation } refetchQueries={ ['Channels'] }>
    { mutate => (
      children(name => {
        if (name) {
          mutate(normalizeChanneName(name))
        }
      })
    ) }
  </Mutation>
)

NewMessageContainer.propTypes = {
  children: func,
}

export default NewMessageContainer
