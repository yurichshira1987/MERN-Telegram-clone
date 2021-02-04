import React, { Fragment} from 'react'
import {NavLink} from 'react-router-dom'
import axios from 'axios'
import config from '../utils/config.json'
import { connect } from 'react-redux'
import actionRedux from '../Redux/actions'






class Auth extends React.Component {
    constructor(props){
        super(props)
        this.state={
            formControls:{
                email:{value:'', error:'', errItem:'', box:false},
                password:{value:'', error:'', errItem:'', box:false},
                general_error:{error:'', errItem:'' }           
            },
            clickAnimation:false          
        }    
    }
    
    
    focusRedBorderBox = item =>{ 
        let formControls = {...this.state.formControls}
        formControls[item].box = true
        this.setState({formControls})
    }
    blurRedBorderBox = item =>{
        let formControls = {...this.state.formControls}
        formControls[item].box = false
        this.setState({formControls})
    } 
    emailValidate = e =>{
        let formControls = {...this.state.formControls}
        formControls.email.value = e.target.value
        this.setState({formControls})
        if(formControls.email.value !== ''){
            formControls.email.errItem = ''
            formControls.general_error.errItem = ''
            this.setState({formControls})
        }
    }
    passwordValidate = e =>{
        let formControls = {...this.state.formControls}
        formControls.password.value = e.target.value
        this.setState({formControls})
        if(formControls.password.value !== ''){
            formControls.password.errItem = ''
            formControls.general_error.errItem = ''
            this.setState({formControls})
        }
    }
    btnSubmit = async () =>{

        let { email, password} = this.state.formControls
        let formControls = {...this.state.formControls}    
        if(email.value ===''){
            formControls.email.error = 'Введите email'
            formControls.email.errItem = 'show'
            this.setState({formControls})
        }
        if(password.value ===''){
            formControls.password.error = 'Введите пароль'
            formControls.password.errItem = 'show'
            this.setState({formControls})
        }           
        if(email.value !==''  && password.value !==''){
            let data = {email:email.value, password:password.value}

            await axios.post(`${config.url}/auth`, data)
            .then(res =>{
                console.log(res)
                if(res.data.message){
                    formControls.general_error.error = res.data.message
                    formControls.general_error.errItem = 'show'
                    this.setState({formControls})
                }

                if(formControls.general_error.error === 'всё ок'){
                    this.props.login(res.data.token, res.data.userId, res.data.userInit)
                    
                }
            })
        }   
    }


    render(){
    var { email, password, general_error } = this.state.formControls
    return(
        <Fragment>
        <div className="auth">
            <h4>Войти в аккаунт</h4>
            <p>Пожалуйста войдите в свой аккаунт</p>
            
            <div className='startBlock'>
                <div className="form">

                <div className="inp">
                    <input 
                        onBlur={this.blurRedBorderBox.bind(this, 'email')} 
                        onFocus={this.focusRedBorderBox.bind(this, 'email')} 
                        className={(email.errItem === 'show'?'redBorder':'') + (email.box && email.errItem ==='show' ?' redBox':'')}
                        onChange={this.emailValidate}  
                        value={email.value}  
                        placeholder="E-mail" 
                        type="text"/>

                    <i className={"fas fa-times-circle " + (email.errItem === 'show'?'showIcon':null)}></i> 
                    <div className={'error '+ (email.errItem === 'show'? 'showError':'hideError')}>{email.error}</div>
                </div>

        
                <div className="inp">
                    <input 
                        onBlur={this.blurRedBorderBox.bind(this, 'password')} 
                        onFocus={this.focusRedBorderBox.bind(this, 'password')} 
                        className={(password.errItem === 'show'?'redBorder':'') + (password.box && password.errItem ==='show' ?' redBox':'')}
                        onChange={this.passwordValidate} 
                        value={password.value} 
                        placeholder="Пароль" 
                        type="password"/>

            
                    <i className={"fas fa-times-circle " + (password.errItem === 'show'?'showIcon':null)}></i>
                    <div className={'error ' + (password.errItem==='show'?'showError':'hideError')}>{password.error}</div>
                    <div className={'error ' + (general_error.errItem==='show'?'showError':'hideError')}>{general_error.error}</div>
                </div>
                
                <div> <button onClick={this.btnSubmit}>Авторизироваться</button></div>
                 <NavLink to='/registr'><p>Зарегистрироваться</p></NavLink>
                
                </div>
            </div>
        </div>
    </Fragment>
    )
    }
}

export default connect(null, actionRedux )(Auth)