import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGoogleInfo } from '../actions/getGoogleInfo';


class Home extends Component {
    
       
    componentWillMount() {
        console.log('will mount');
        this.props.getGoogleInfo();
    }

    componentDidMount() {
        console.log('did mount');
    }

    render() {
        console.log('render');
        return (
            <div>
                Welcome to user name.
                <label> your corrent city is {this.props.data.googleInfo.userLocationCity} </label> <br />
                <label> your timezone is {this.props.data.googleInfo.userTimezone} </label> <br />
                <label> current time is ???    </label>
            </div>
        );
    }
}

Home.propTypes = {
    data: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    data: state.googleInfo,
})

export  default connect(mapStateToProps, { getGoogleInfo })(Home)