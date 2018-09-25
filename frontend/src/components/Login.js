import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authentication';
import classnames from 'classnames';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

class Login extends Component {
    
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            errors: {}
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.componentClicked = this.componentClicked.bind(this);
        this.responseFacebook = this.responseFacebook.bind(this);
        this.responseGoolge = this.responseGoolge.bind(this);
    }

    socialState = {
        isLoggedIn: false,
        userID: '',
        name: '',
        email: '',
        picture: ''
    }

    responseFacebook = response => {
        console.log(response);
        this.setState({
            userID: response.userID,
            name: response.name,
            email: response.email,
            picture: response.picture.data.url,
            token: response.accessToken
        });
        const user = {
            email: response.email,
            password: this.state.password,
            isSocialLogin: true,
            token: this.socialState.token

        }
        this.props.loginUser(user, this.props.history);
    }
    componentClicked = () => {
        console.log('clicked');
    };

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password,
            isSocialLogin: false
        }
        this.props.loginUser(user, this.props.history);
    }

    componentDidMount() {
        if(this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.auth.isAuthenticated) {
            this.props.history.push('/')
        }
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    responseGoolge = (response) => {
        console.log(response);
    }

    render() {
        
        const {errors} = this.state;
        let fbContent;
        fbContent = (<FacebookLogin
            appId="466541550516478"
            autoLoad={true}
            fields="name, email, picture"
            onClick={this.componentClicked}
            callback={this.responseFacebook} />);
        let glContent;
        glContent = (
            <GoogleLogin 
             clientId="149931598909-masvnt4d25tkuhg67vl41tap42ts3jmg.apps.googleusercontent.com"
             buttonText="Login"
             onSuccess={this.responseGoolge}
             onFailure={this.responseGoolge} />
        );    
        return(
        <div className="container" style={{ marginTop: '50px', width: '700px'}}>
            <h2 style={{marginBottom: '40px'}}>Login</h2>
            <form onSubmit={ this.handleSubmit }>
                <div className="form-group">
                    <input
                    type="email"
                    placeholder="Email"
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': errors.email
                    })}
                    name="email"
                    onChange={ this.handleInputChange }
                    value={ this.state.email }
                    />
                    {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                </div>
                <div className="form-group">
                    <input
                    type="password"
                    placeholder="Password"
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': errors.password
                    })} 
                    name="password"
                    onChange={ this.handleInputChange }
                    value={ this.state.password }
                    />
                    {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                </div>
                <div className="form-group">
                    <button type="submit" className='btn btn-primary' >
                        Login User
                    </button>
                    <br /><br />
                    {fbContent}
                                       
                </div>
            </form>
        </div>
        )
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export  default connect(mapStateToProps, { loginUser })(Login)