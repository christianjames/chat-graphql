import React from 'react'
import PropTypes from 'prop-types'

class CustomScroll extends React.Component {
    constructor(props) {
      super(props);
  
      this.scrollRef = null;
      this.changedScroll = false;      
    }

    setScrollRef = element => {
        this.scrollRef = element;
    }

    setScroll = () => {
        if (this.changedScroll === false) {
            this.scrollRef.scrollTop = this.scrollRef.scrollHeight - this.scrollRef.clientHeight;
        }
    }

    handleScroll = (e) => {
        if (this.scrollRef.scrollTop == this.scrollRef.scrollHeight - this.scrollRef.clientHeight) {
            this.changedScroll = false
        }
        else {
            this.changedScroll = true
        }
    }
  
    componentDidMount() {
      this.setScroll()
    }

    componentDidUpdate() {
        this.setScroll()
    }
  
    render() {
        const {offsetHeight, children} = this.props
      return (
        <div 
            ref={this.setScrollRef} 
            onWheel={this.handleScroll} 
            onScroll={this.handleScroll} 
            style={{
                width: '100%', 
                height: `calc(100vh - ${offsetHeight})`, 
                overflowY: 'scroll'}
            }>
            { children }
        </div>
      );
    }
  }

  CustomScroll.propTypes = {
      offsetHeight: PropTypes.string
  }

  CustomScroll.defaultProps = {
    offsetHeight: '170px'
  }

  export default CustomScroll