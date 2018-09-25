import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { emailVerify } from '../actions/authentication';

class Verify extends Component {
    
    constructor(){
        super();
        this.state = {
            verifyToken: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleClick(e) {
        
        const verifyData = {
            verifyToken: this.state.verifyToken
        }
        
        this.props.emailVerify(verifyData, this.props.history);
    }

    render() {
     
       return (
            <div className="container" >

                <h4>Please verify email with your token value.</h4>
                    
                    <div className="form-group">
                        <input type="text" 
                            placeholder="Type your verify tokem." 
                            className="form-control form-control-lg" 
                            name="verifyToken"
                            onChange={ this.handleInputChange }
                            value={ this.state.password } />
                        
                    </div>
                    <div className="form-group">
                        <input type="button" className="btn btn-primary" value="Verify" onClick={this.handleClick} />
                    </div>
               
            </div>
        );
    }
}

Verify.propTypes = {
    emailVerify: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export  default connect(mapStateToProps, { emailVerify })(Verify)